/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.oipklanttaak.service

import com.fasterxml.jackson.databind.node.TextNode
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectRequest
import com.ritense.objectenapi.client.ObjectWrapper
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.ProcessVariables
import com.ritense.valtimoplugins.oipklanttaak.domain.Authorizee
import com.ritense.valtimoplugins.oipklanttaak.domain.Betrokkene
import com.ritense.valtimoplugins.oipklanttaak.domain.Formulier
import com.ritense.valtimoplugins.oipklanttaak.domain.Klanttaak
import com.ritense.valtimoplugins.oipklanttaak.domain.LegalSubject
import com.ritense.valtimoplugins.oipklanttaak.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oipklanttaak.domain.Portaalformulier
import com.ritense.valtimoplugins.oipklanttaak.domain.Status
import com.ritense.valtimoplugins.oipklanttaak.dto.DataBinding
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.operaton.bpm.engine.delegate.DelegateExecution
import org.operaton.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.time.LocalDate
import java.util.UUID
import kotlin.String

class OipKlanttaakServiceTest {

    private val objectMapper = MapperSingleton.get()

    private lateinit var pluginServiceMock: PluginService
    private lateinit var objectManagementServiceMock: ObjectManagementService
    private lateinit var taskServiceMock: OperatonTaskService
    private lateinit var valueResolverServiceMock: ValueResolverService
    private lateinit var zaakUrlProviderMock: ZaakUrlProvider

    private lateinit var oipKlanttaakService: OipKlanttaakService

    @BeforeEach
    fun setup() {
        pluginServiceMock = mock()
        objectManagementServiceMock = mock()
        taskServiceMock = mock()
        valueResolverServiceMock = mock()
        zaakUrlProviderMock = mock()

        oipKlanttaakService = OipKlanttaakService(
            pluginService = pluginServiceMock,
            objectManagementService = objectManagementServiceMock,
            objectMapper = objectMapper,
            taskService = taskServiceMock,
            valueResolverService = valueResolverServiceMock,
            zaakUrlProvider = zaakUrlProviderMock
        )
    }

    @Test
    fun `delegateTask should create a new object via objecten api and not throw exceptions`() {
        // given
        val delegateTask = mock<DelegateTask> {
            on { id } doReturn taskId().toString()
            on { processInstanceId } doReturn processInstanceId().toString()
            on { taskDefinitionKey } doReturn "oip-klanttaak"
            on { name } doReturn "OIP Klanttaak"
        }

        val objectenApiPlugin = objectenApiPlugin()

        doReturn(objectManagementConfiguration())
            .whenever(objectManagementServiceMock).getById(eq(objectManagementConfigurationId()))

        doReturn(objecttypenApiPlugin())
            .whenever(pluginServiceMock).createInstance<ObjecttypenApiPlugin>(eq(objecttypenApiPluginConfigurationId()))

        doReturn(objectenApiPlugin)
            .whenever(pluginServiceMock).createInstance<ObjectenApiPlugin>(eq(objectenApiPluginConfigurationId()))

        doReturn(mapOf(
            "doc:/firstname" to "John",
            "doc:/lastname" to "Doe",
            "doc:/email" to "john.doe@test.com"
        ))
            .whenever(valueResolverServiceMock).resolveValues(
                processInstanceId = any(),
                variableScope = any(),
                requestedValues = any()
            )

        assertDoesNotThrow {
            oipKlanttaakService.delegateTask(
                delegateTask = delegateTask,
                objectManagementId = objectManagementConfigurationId(),
                authorizeeIdentifier = "TestAuthorizee",
                levelOfAssurance = LevelOfAssurance.MOBILE_TWO_FACTOR_CONTRACT,
                formUri = URI.create("https://example.com/form/123"),
                formDataMapping = listOf(
                    DataBinding("/firstname", "doc:/firstname"),
                    DataBinding("/lastname", "doc:/lastname"),
                    DataBinding("/email", "doc:/email")
                )
            )
        }

        argumentCaptor<ObjectRequest>().let { captor ->
            verify(objectenApiPlugin).createObject(captor.capture())

            assertThat(captor.firstValue.record.data).isNotNull
            assertThat(captor.firstValue.record.data!!.at("/status").asText()).isEqualTo(Status.OPEN.value)
            assertThat(captor.firstValue.record.data!!.at("/titel").asText()).isEqualTo("OIP Klanttaak")
            assertThat(captor.firstValue.record.data!!.at("/verwerker_taak_id").asText()).isEqualTo(taskId().toString())
            assertThat(captor.firstValue.record.data!!.at("/portaalformulier/data/firstname").asText()).isEqualTo("John")
            assertThat(captor.firstValue.record.data!!.at("/portaalformulier/data/lastname").asText()).isEqualTo("Doe")
            assertThat(captor.firstValue.record.data!!.at("/portaalformulier/data/email").asText()).isEqualTo("john.doe@test.com")
        }
    }

    @Test
    fun `completeDelegatedTask should complete the task and not throw exceptions`() {
        val execution = mock<DelegateExecution> {
            on { processInstanceId } doReturn processInstanceId().toString()
            on { businessKey } doReturn businessKey().toString()
            on { getVariable(ProcessVariables.VERWERKER_TAAK_ID) } doReturn taskId().toString()
            on { getVariable(ProcessVariables.KLANTTAAK_OBJECT_URL) } doReturn objectUrl().toString()
        }

        val objectenApiPlugin = objectenApiPlugin(
            klanttaak = klanttaak(
                status = Status.UITGEVOERD,
                verzondenData = mapOf(
                    "firstname" to "John Patrick",
                    "lastname" to "Smith",
                    "email" to "john.p.smith@test.com"
                )
            )
        )

        doReturn(objectenApiPlugin)
            .whenever(pluginServiceMock).createInstance<ObjectenApiPlugin>(eq(objectenApiPluginConfigurationId()))

        doReturn(objectManagementConfiguration())
            .whenever(objectManagementServiceMock).getById(eq(objectManagementConfigurationId()))

        assertDoesNotThrow {
            oipKlanttaakService.completeDelegatedTask(
                execution = execution,
                objectManagementId = objectManagementConfigurationId(),
                saveReceivedData = true,
                receivedDataMapping = listOf(
                    DataBinding("/firstname", "doc:/firstname"),
                    DataBinding("/lastname", "doc:/lastname"),
                    DataBinding("/email", "doc:/email")
                ),
                linkDocuments = false,
                pathToDocuments = null
            )
        }

        verify(taskServiceMock).complete(eq(taskId().toString()))

        argumentCaptor<Map<String, Any?>>().let { captor ->
            verify(valueResolverServiceMock).handleValues(any(), captor.capture())

            assertThat(captor.firstValue.size).isEqualTo(3)
            assertThat(captor.firstValue["doc:/firstname"]).isEqualTo(TextNode.valueOf("John Patrick"))
            assertThat(captor.firstValue["doc:/lastname"]).isEqualTo(TextNode.valueOf("Smith"))
            assertThat(captor.firstValue["doc:/email"]).isEqualTo(TextNode.valueOf("john.p.smith@test.com"))
        }

        argumentCaptor<ObjectRequest>().let { captor ->
            verify(objectenApiPlugin).objectPatch(eq(objectUrl()), captor.capture())

            assertThat(captor.firstValue.record.data).isNotNull
            assertThat(captor.firstValue.record.data!!.at("/status").asText()).isEqualTo(Status.VERWERKT.value)
        }
    }

    private fun klanttaak(
        status: Status = Status.OPEN,
        verzondenData: Map<String, Any>? = null
    ) = Klanttaak(
        titel = "OIP Klanttaak",
        status = status,
        eigenaar = "GZAC",
        betrokkene = Betrokkene(
            levelOfAssurance = LevelOfAssurance.MOBILE_TWO_FACTOR_CONTRACT,
            authorizee = Authorizee(
                legalSubject = LegalSubject(identifier = "Authorizee")
            )
        ),
        portaalformulier = Portaalformulier(
            formulier = Formulier(
                value = URI.create("https://example.com/form/123")
            ),
            data = mapOf(
                "firstname" to "John",
                "lastname" to "Doe",
                "email" to "john.doe@test.com"
            ),
            verzondenData = verzondenData
        ),
        verwerkerTaakId = taskId()
    )

    private fun processInstanceId() = UUID.fromString("eae3a5bd-1f0e-48f0-8d51-a4ee6231d36c")

    private fun businessKey() = UUID.fromString("f543c759-5f42-41be-be20-ceba764fa84f")

    private fun taskId() = UUID.fromString("99ab6902-80a1-46f9-8c79-5c040ebd118f")

    private fun objectManagementConfigurationId() = UUID.fromString("135851f4-ace3-4e8c-832b-ec71b0a28352")

    private fun objecttypenApiPluginConfigurationId() = UUID.fromString("edde7ae6-6ad3-40b7-aeb2-7e5cc6bc5ca2")

    private fun objectenApiPluginConfigurationId() = UUID.fromString("c77c4eb2-0af8-4af3-927b-ac6e3e84b7c7")

    private fun objectTypeId() = "72d10488-30b6-48cc-8670-edc07c0e7252"

    private fun objectTypeUrl() = URI.create("https://example.com/objecttype/${objectTypeId()}")

    private fun objectId() = UUID.fromString("fbf7f397-946f-4656-9cce-46d539ea43a7")

    private fun objectUrl() = URI.create("https://example.com/object/${objectId()}")

    private fun objectManagementConfiguration() = ObjectManagement(
        id = objectManagementConfigurationId(),
        title = "OIP Klanttaak",
        objecttypenApiPluginConfigurationId = objecttypenApiPluginConfigurationId(),
        objecttypeId = objectTypeId(),
        objectenApiPluginConfigurationId = objectenApiPluginConfigurationId()
    )

    private fun objecttypenApiPlugin() = mock<ObjecttypenApiPlugin> {
        on { getObjectTypeUrlById(any()) } doReturn objectTypeUrl()
    }

    private fun objectenApiPlugin(
        klanttaak: Klanttaak = klanttaak()
    ): ObjectenApiPlugin {
        val objectWrapper = ObjectWrapper(
            url = objectUrl(),
            uuid = objectId(),
            type = objectTypeUrl(),
                record = ObjectRecord(
                typeVersion = 1,
                startAt = LocalDate.parse("2026-01-01"),
                data = objectMapper.valueToTree(klanttaak)
            )
        )
        return mock<ObjectenApiPlugin> {
            on { createObject(any()) } doReturn objectWrapper
            on { getObject(any() ) } doReturn objectWrapper
        }
    }
}