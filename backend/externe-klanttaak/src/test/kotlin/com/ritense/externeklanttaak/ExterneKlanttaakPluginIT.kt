/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.externeklanttaak

import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.BaseIntegrationTest
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.impl.request.NewDocumentRequest
import com.ritense.externeklanttaak.domain.ExterneKlanttaakVersion
import com.ritense.externeklanttaak.domain.Version
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.externeklanttaak.web.rest.ExterneKlanttaakManagementResource
import com.ritense.notificatiesapi.NotificatiesApiAuthentication
import com.ritense.objectenapi.ObjectenApiAuthentication
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiAuthentication
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.domain.PluginProcessLink
import com.ritense.plugin.domain.PluginProcessLinkId
import com.ritense.plugin.repository.PluginConfigurationRepository
import com.ritense.plugin.repository.PluginProcessLinkRepository
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.request.NewDocumentAndStartProcessRequest
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimo.camunda.domain.CamundaTask
import com.ritense.valtimo.camunda.repository.CamundaTaskSpecificationHelper.Companion.byActive
import com.ritense.valtimo.camunda.repository.CamundaTaskSpecificationHelper.Companion.byProcessInstanceId
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.zakenapi.domain.ZaakInstanceLink
import com.ritense.zakenapi.domain.ZaakInstanceLinkId
import com.ritense.zakenapi.link.ZaakInstanceLinkService
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.camunda.bpm.engine.RepositoryService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.SpyBean
import org.springframework.http.HttpMethod
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.client.ClientRequest
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.ExchangeFunction
import reactor.core.publisher.Mono
import java.net.URI
import java.util.Optional
import java.util.UUID
import kotlin.test.assertEquals

@Transactional
class ExterneKlanttaakPluginIT : BaseIntegrationTest() {

    @Autowired
    lateinit var externeKlanttaakVersions: List<ExterneKlanttaakVersion>

    @Autowired
    lateinit var externeKlanttaakPluginManagementResource: ExterneKlanttaakManagementResource

    @Autowired
    lateinit var procesDocumentService: ProcessDocumentService

    @Autowired
    lateinit var taskService: CamundaTaskService

    @Autowired
    lateinit var objectManagementService: ObjectManagementService

    @Autowired
    lateinit var repositoryService: RepositoryService

    @Autowired
    lateinit var pluginProcessLinkRepository: PluginProcessLinkRepository

    @SpyBean
    lateinit var externeKlanttaakService: ExterneKlanttaakService

    @SpyBean
    lateinit var pluginService: PluginService

    @SpyBean
    lateinit var pluginConfigurationRepository: PluginConfigurationRepository

    @SpyBean
    lateinit var zaakInstanceLinkService: ZaakInstanceLinkService

    private lateinit var server: MockWebServer
    private lateinit var objectenPluginConfiguration: PluginConfiguration
    private lateinit var objecttypenPluginConfiguration: PluginConfiguration
    private lateinit var objectManagement: ObjectManagement
    private lateinit var notificatiesApiPluginConfiguration: PluginConfiguration
    private lateinit var externeKlanttaakPluginConfiguration: PluginConfiguration
    private val executedRequests = mutableListOf<RecordedRequest>()

    @BeforeEach
    internal fun setUp() {

        server = MockWebServer()
        setupMockObjectenApiServer()
        server.start()

        // Since we do not have an actual authentication plugin in this context we will mock one
        val authenticationPluginConfigurationId =
            PluginConfigurationId.existingId(UUID.fromString("9d92670c-a5b9-48e5-8053-fe1907574a32"))

        doReturn(Optional.of(mock<PluginConfiguration>()))
            .whenever(pluginConfigurationRepository).findById(authenticationPluginConfigurationId)
        doReturn(TestAuthentication())
            .whenever(pluginService).createInstance(authenticationPluginConfigurationId)

        objectenPluginConfiguration = createObjectenApiPlugin()
        objecttypenPluginConfiguration = createObjectTypenApiPlugin()
        objectManagement =
            createObjectManagement(objectenPluginConfiguration.id.id, objecttypenPluginConfiguration.id.id)
        notificatiesApiPluginConfiguration = createNotificatiesApiPlugin()
        externeKlanttaakPluginConfiguration =
            createExterneKlanttaakPluginConfig(notificatiesApiPluginConfiguration, objectManagement, Version(1, 1, 0))

        val zaakInstanceLink = ZaakInstanceLink(
            ZaakInstanceLinkId(UUID.randomUUID()),
            ZAAK_URL,
            UUID.randomUUID(),
            UUID.randomUUID(),
            URI.create("zaakTypeUrl"),
        )

        doReturn(zaakInstanceLink)
            .whenever(zaakInstanceLinkService).getByDocumentId(any())
    }

    @Test
    fun `should enumerate all versions`() {
        val versionBeanCount = 1

        assertEquals(versionBeanCount, externeKlanttaakPluginManagementResource.getSupportedVersions().body?.count())
        assertEquals(versionBeanCount, externeKlanttaakVersions.count())
    }

    @Test
    fun `should create Externe Klanttaak`() {
        val documentContent =
            """
                {
                    "voornaam": "Jan"
                }
            """.trimIndent()
        val createActionConfig =
            """
                {
                    "config": {
                        "taakSoort": "url",
                        "url": "pv:external-url",
                        "taakReceiver": "other",
                        "identificationKey": "bsn",
                        "identificationValue": "999990755",
                        "verloopdatum": "01-01-2025"
                    }
                }
            """.trimIndent()

        createProcessLink(
            externeKlanttaakPluginConfiguration = externeKlanttaakPluginConfiguration,
            createActionConfiguration = createActionConfig,
        )
        startExterneKlanttaakProcess(
            documentContent = documentContent
        )

        assert(true)
    }

    private fun startExterneKlanttaakProcess(
        documentContent: String,
        processDefinitionKey: String = PROCESS_DEFINITION_KEY
    ): CamundaTask {
        return runWithoutAuthorization {
            val newDocumentRequest =
                NewDocumentRequest(DOCUMENT_DEFINITION_KEY, objectMapper.readTree(documentContent))
            val request = NewDocumentAndStartProcessRequest(processDefinitionKey, newDocumentRequest)
                .withProcessVars(
                    mapOf(
                        "myid" to "MY-PSP-ID",
                        "external-url" to "https://example.com/taken/mytask",
                        "datum" to "2024-10-30"
                    )
                )
            val processResult = procesDocumentService.newDocumentAndStartProcess(request)
            taskService.findTask(
                byActive().and(
                    byProcessInstanceId(
                        processResult.resultingProcessInstanceId().get().toString()
                    )
                )
            )
        }
    }

    private fun createObjectManagement(
        objectenApiPluginConfigurationId: UUID,
        objecttypenApiPluginConfigurationId: UUID
    ): ObjectManagement {
        val objectManagement = ObjectManagement(
            title = "Henk",
            objectenApiPluginConfigurationId = objectenApiPluginConfigurationId,
            objecttypenApiPluginConfigurationId = objecttypenApiPluginConfigurationId,
            objecttypeId = "object-type-id"
        )
        return objectManagementService.create(objectManagement)
    }

    private fun createNotificatiesApiPlugin(): PluginConfiguration {
        val pluginPropertiesJson = """
            {
              "url": "${server.url("/")}",
              "callbackUrl": "http://host.docker.internal:8080/api/v1/notificatiesapi/callback",
              "authenticationPluginConfiguration": "9d92670c-a5b9-48e5-8053-fe1907574a32"
            }
        """.trimIndent()

        val configuration = pluginService.createPluginConfiguration(
            "Notificaties API plugin configuration",
            objectMapper.readTree(
                pluginPropertiesJson
            ) as ObjectNode,
            "notificatiesapi"
        )
        return configuration
    }


    private fun createExterneKlanttaakPluginConfig(
        notificatiesApiPlugin: PluginConfiguration,
        objectManagement: ObjectManagement,
        version: Version,
    ): PluginConfiguration {
        val pluginPropertiesJson = """
            {
              "notificatiesApiPluginConfiguration": "${notificatiesApiPlugin.id.id}",
              "objectManagementConfigurationId": "${objectManagement.id}",
              "pluginVersion": "$version",
              "finalizerProcess": "verwerk-afgeronde-externe-klanttaak"
            }
        """.trimIndent()

        val configuration = pluginService.createPluginConfiguration(
            "Externe Klanttaak $version",
            objectMapper.readTree(
                pluginPropertiesJson
            ) as ObjectNode,
            "externeklanttaak"
        )
        return configuration
    }

    private fun createObjectTypenApiPlugin(): PluginConfiguration {
        val pluginPropertiesJson = """
            {
              "url": "${server.url("/")}",
              "authenticationPluginConfiguration": "9d92670c-a5b9-48e5-8053-fe1907574a32"
            }
        """.trimIndent()

        val configuration = pluginService.createPluginConfiguration(
            "Objecten plugin configuration",
            objectMapper.readTree(
                pluginPropertiesJson
            ) as ObjectNode,
            "objecttypenapi"
        )
        return configuration
    }

    private fun createObjectenApiPlugin(): PluginConfiguration {
        val pluginPropertiesJson = """
            {
              "url": "${server.url("/")}",
              "authenticationPluginConfiguration": "9d92670c-a5b9-48e5-8053-fe1907574a32"
            }
        """.trimIndent()

        val configuration = pluginService.createPluginConfiguration(
            "Objecttype plugin configuration",
            objectMapper.readTree(
                pluginPropertiesJson
            ) as ObjectNode,
            "objectenapi"
        )
        return configuration
    }

    private fun createProcessLink(
        externeKlanttaakPluginConfiguration: PluginConfiguration,
        createActionConfiguration: String,
        processDefinitionKey: String = PROCESS_DEFINITION_KEY
    ) {
        val processDefinitionId = repositoryService.createProcessDefinitionQuery()
            .processDefinitionKey(processDefinitionKey)
            .latestVersion()
            .singleResult()
            .id

        pluginProcessLinkRepository.save(
            PluginProcessLink(
                PluginProcessLinkId(UUID.randomUUID()),
                processDefinitionId,
                "user_task",
                objectMapper.readTree(createActionConfiguration) as ObjectNode,
                externeKlanttaakPluginConfiguration.id,
                "create-externeklanttaak",
                activityType = ActivityTypeWithEventName.USER_TASK_CREATE
            )
        )
    }


    private fun setupMockObjectenApiServer() {
        val dispatcher: Dispatcher = object : Dispatcher() {
            @Throws(InterruptedException::class)
            override fun dispatch(request: RecordedRequest): MockResponse {
                executedRequests.add(request)
                val path = request.path?.substringBefore('?')
                val response = when (path) {
                    "/kanaal" -> getKanaalResponse()
                    "/abonnement" -> createAbonnementResponse()
                    "/objects" -> createObjectResponse()
                    else -> MockResponse().setResponseCode(404)
                }
                return response
            }
        }

        server.dispatcher = dispatcher
    }

    private fun getKanaalResponse(): MockResponse {
        val body = """
            [
                {
                  "naam": "objecten"
                }
            ]
        """.trimIndent()
        return mockJsonResponse(body)
    }

    private fun createAbonnementResponse(): MockResponse {
        val body = """
            {
              "url": "http://localhost",
              "auth": "test123",
              "callbackUrl": "http://localhost"
            }
        """.trimIndent()
        return mockJsonResponse(body)
    }

    private fun createObjectResponse(): MockResponse {
        val body = """
            {
              "url": "http://example.com",
              "uuid": "095be615-a8ad-4c33-8e9c-c7612fbf6c9f",
              "type": "http://example.com",
              "record": {
                "index": 0,
                "typeVersion": 32767,
                "data": {
                  "property1": null,
                  "property2": null
                },
                "geometry": {
                  "type": "string",
                  "coordinates": [
                    0,
                    0
                  ]
                },
                "startAt": "2019-08-24",
                "endAt": "2019-08-24",
                "registrationAt": "2019-08-24",
                "correctionFor": "string",
                "correctedBy": "string"
              }
            }
        """.trimIndent()
        return mockJsonResponse(body)
    }

    private fun mockJsonResponse(body: String): MockResponse {
        return MockResponse()
            .addHeader("Content-Type", "application/json")
            .setBody(body)
    }

    fun findRequest(method: HttpMethod, path: String): RecordedRequest? {
        return executedRequests
            .filter { method.matches(it.method!!) }
            .firstOrNull { it.path?.substringBefore('?').equals(path) }
    }

    class TestAuthentication : ObjectenApiAuthentication, ObjecttypenApiAuthentication, NotificatiesApiAuthentication {
        override fun filter(request: ClientRequest, next: ExchangeFunction): Mono<ClientResponse> {
            return next.exchange(request)
        }
    }

    companion object {
        private val objectMapper = MapperSingleton.get()
        private const val PROCESS_DEFINITION_KEY = "create-externe-klanttaak"
        private const val DOCUMENT_DEFINITION_KEY = "profile"
        private val ZAAK_URL = URI("http://zaak.url")
    }
}