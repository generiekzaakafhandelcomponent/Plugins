/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.treeToValue
import com.ritense.BaseIntegrationTest
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.impl.request.NewDocumentRequest
import com.ritense.document.service.DocumentService
import com.ritense.externeklanttaak.domain.IExterneKlanttaakVersion
import com.ritense.externeklanttaak.domain.Version
import com.ritense.externeklanttaak.listener.ExterneKlanttaakEventListener
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0
import com.ritense.externeklanttaak.web.rest.ExterneKlanttaakManagementResource
import com.ritense.notificatiesapi.NotificatiesApiAuthentication
import com.ritense.notificatiesapi.event.NotificatiesApiNotificationReceivedEvent
import com.ritense.objectenapi.ObjectenApiAuthentication
import com.ritense.objectenapi.client.ObjectRequest
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
import com.ritense.processdocument.domain.ProcessInstanceId
import com.ritense.processdocument.domain.impl.request.NewDocumentAndStartProcessRequest
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimo.camunda.domain.CamundaTask
import com.ritense.valtimo.camunda.repository.CamundaTaskSpecificationHelper.Companion.byActive
import com.ritense.valtimo.camunda.repository.CamundaTaskSpecificationHelper.Companion.byProcessInstanceId
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.CamundaProcessService
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.zakenapi.domain.ZaakInstanceLink
import com.ritense.zakenapi.domain.ZaakInstanceLinkId
import com.ritense.zakenapi.link.ZaakInstanceLinkService
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.camunda.bpm.engine.RepositoryService
import org.camunda.bpm.engine.RuntimeService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.SpyBean
import org.springframework.http.HttpMethod
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestClient.Builder
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
    lateinit var externeKlanttaakVersions: List<IExterneKlanttaakVersion>

    @Autowired
    lateinit var externeKlanttaakPluginManagementResource: ExterneKlanttaakManagementResource

    @Autowired
    lateinit var procesDocumentService: ProcessDocumentService

    @Autowired
    lateinit var processService: CamundaProcessService

    @Autowired
    lateinit var taskService: CamundaTaskService

    @Autowired
    lateinit var objectManagementService: ObjectManagementService

    @Autowired
    lateinit var repositoryService: RepositoryService

    @Autowired
    lateinit var pluginProcessLinkRepository: PluginProcessLinkRepository

    @Autowired
    lateinit var externeKlanttaakEventListener: ExterneKlanttaakEventListener

    @SpyBean
    lateinit var externeKlanttaakService: ExterneKlanttaakService

    @SpyBean
    lateinit var documentService: DocumentService

    @SpyBean
    lateinit var runtimeService: RuntimeService

    @SpyBean
    lateinit var pluginService: PluginService

    @SpyBean
    lateinit var pluginConfigurationRepository: PluginConfigurationRepository

    @SpyBean
    lateinit var zaakInstanceLinkService: ZaakInstanceLinkService

    private lateinit var server: MockWebServer
    private lateinit var objectenPluginConfiguration: PluginConfiguration
    private lateinit var objecttypenPluginConfiguration: PluginConfiguration
    private lateinit var openzaakPluginConfiguration: PluginConfiguration
    private lateinit var zakenApiPluginConfig: PluginConfiguration
    private lateinit var objectManagement: ObjectManagement
    private lateinit var notificatiesApiPluginConfiguration: PluginConfiguration
    private lateinit var externeKlanttaakPluginConfiguration: PluginConfiguration
    private val executedRequests = mutableListOf<RecordedRequest>()
    private lateinit var verwerkerTaakId: String

    @BeforeEach
    internal fun setUp() {

        server = MockWebServer()
        setupMockZgwServer()
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
        openzaakPluginConfiguration = createOpenzaakPlugin()
        zakenApiPluginConfig = createzakenApiPlugin()
        objectManagement =
            createObjectManagement(objectenPluginConfiguration.id.id, objecttypenPluginConfiguration.id.id)
        notificatiesApiPluginConfiguration = createNotificatiesApiPlugin()
        externeKlanttaakPluginConfiguration =
            createExterneKlanttaakPluginConfig(notificatiesApiPluginConfiguration, objectManagement, Version(1, 1, 0))

        val zaakUrl = URI.create("${server.url("/")}zaak")

        val zaakInstanceLink = ZaakInstanceLink(
            ZaakInstanceLinkId(UUID.randomUUID()),
            zaakUrl,
            UUID.randomUUID(),
            UUID.randomUUID(),
            URI.create("zaakTypeUrl"),
        )

        whenever(zaakUrlProvider.getZaakUrl(any()))
            .thenReturn(zaakUrl)
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
    fun `should create Externe Klanttaak and store resulting url`() {
        // given
        val documentContentJson =
            """
                {
                    "voornaam": "Jan",
                    "bsn": "999990755"
                }
            """.trimIndent()
        val createActionConfigJson =
            """
                {
                    "config": {
                        "taakSoort": "url",
                        "url": "pv:external-url",
                        "taakReceiver": "other",
                        "identificationKey": "bsn",
                        "identificationValue": "doc:/bsn",
                        "verloopdatum": "01-01-2025",
                        "resultingKlanttaakObjectUrlVariable": "resultingKlanttaakUrl"
                    }
                }
            """.trimIndent()

        // when
        createProcessLink(
            externeKlanttaakPluginConfiguration = externeKlanttaakPluginConfiguration,
            createActionConfiguration = createActionConfigJson,
        )

        val (processId, _) = startExterneKlanttaakProcessAndTask(
            documentContent = documentContentJson
        )
        val processVariables =
            runWithoutAuthorization {
                processService.getProcessInstanceVariables(
                    processId.toString(),
                    listOf(
                        "resultingKlanttaakUrl"
                    )
                )
            }

        // then
        verify(externeKlanttaakService, times(1)).createExterneKlanttaak(any(), any(), any(), any())

        val resultingObjectRecord: ObjectRequest =
            objectMapper.readValue(executedRequests.last().body.inputStream())
        val createdExterneKlanttaak: ExterneKlanttaakV1x1x0 =
            objectMapper.treeToValue(resultingObjectRecord.record.data!!)

        assertEquals("http://example.com", processVariables["resultingKlanttaakUrl"].toString())
        assertEquals("url", createdExterneKlanttaak.soort.toString())
        assertEquals("https://example.com/taken/mytask", createdExterneKlanttaak.url?.uri)
        assertEquals("bsn", createdExterneKlanttaak.identificatie.type)
        assertEquals("999990755", createdExterneKlanttaak.identificatie.value)
    }

    @Test
    @Transactional
    fun `should link documents handle submission values and complete Externe Klanttaak`() {
        // given
        val setVariablesCapture = argumentCaptor<Map<String, Any>>()
        val documentModifyJsonCapture = argumentCaptor<JsonNode>()
        val documentContentJson =
            """
                {
                    "voornaam": "Jan",
                    "bsn": "999990755"
                }
            """.trimIndent()
        val completeActionConfigJson =
            """
                {
                    "config": {
                        "bewaarIngediendeGegevens": true,
                        "verzondenDataMapping": [
                            {
                                "key": "doc:/voornaam",
                                "value": "/newName"
                            },
                            {
                                "key": "pv:isAkkoord",
                                "value": "/doYouAgree"
                            }
                        ],
                        "koppelDocumenten": true
                    }
                }
            """.trimIndent()

        // when
        addCompleteProcessLink(
            externeKlanttaakPluginConfiguration = externeKlanttaakPluginConfiguration,
            completeActionConfiguration = completeActionConfigJson,
        )
        val (processId, task) = startExterneKlanttaakProcessAndTask(
            documentContent = documentContentJson
        )
        verwerkerTaakId = task.id
        val externeKlanttaakSubmittedEvent =
            NotificatiesApiNotificationReceivedEvent(
                kanaal = "objecten",
                actie = "update",
                kenmerken = mapOf(
                    "objectType" to "https://example.com/object-type-id"
                ),
                resourceUrl = "${server.url("/")}objects/completed"
            )

        externeKlanttaakEventListener.handle(externeKlanttaakSubmittedEvent)

        // then
        verify(externeKlanttaakService, times(1)).completeExterneKlanttaak(any(), any(), any(), any())
        verify(runtimeService, times(1)).setVariables(any(), setVariablesCapture.capture())
        verify(documentService, times(1)).modifyDocument(any(), documentModifyJsonCapture.capture())

        val resultingObjectRecord: ObjectRequest =
            objectMapper.readValue(executedRequests.last().body.inputStream())
        val createdExterneKlanttaak: ExterneKlanttaakV1x1x0 =
            objectMapper.treeToValue(resultingObjectRecord.record.data!!)

        assertEquals(true, setVariablesCapture.firstValue["isAkkoord"])
        assertEquals("Julia", documentModifyJsonCapture.firstValue.get("voornaam").textValue())
        assertEquals("portaalformulier", createdExterneKlanttaak.soort.toString())
        assertEquals("bsn", createdExterneKlanttaak.identificatie.type)
        assertEquals("999990755", createdExterneKlanttaak.identificatie.value)
    }

    private fun startExterneKlanttaakProcessAndTask(
        documentContent: String,
        processDefinitionKey: String = CREATE_PROCESS_DEFINITION_KEY
    ): Pair<ProcessInstanceId, CamundaTask> {
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
            val resultingProcessId =
                procesDocumentService.newDocumentAndStartProcess(request).resultingProcessInstanceId()
            val task = taskService.findTask(
                byActive().and(
                    byProcessInstanceId(
                        resultingProcessId.get().toString()
                    )
                )
            )
            resultingProcessId.get() to task
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
              "finalizerProcess": "$COMPLETE_PROCESS_DEFINITION_KEY"
            }
        """.trimIndent()

        val configuration = pluginService.createPluginConfiguration(
            "Externe Klanttaak $version",
            objectMapper.readTree(
                pluginPropertiesJson
            ) as ObjectNode,
            "externe-klanttaak"
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

    private fun createOpenzaakPlugin(): PluginConfiguration {
        val pluginPropertiesJson =
            """
                {
                    "clientId": "gzac",
                    "clientSecret": "12345678901112131234567890111213"
                }
            """.trimIndent()

        val configuration = pluginService.createPluginConfiguration(
            "Openzaak plugin configuration",
            objectMapper.readTree(
                pluginPropertiesJson
            ) as ObjectNode,
            "openzaak"
        )
        return configuration
    }

    private fun createzakenApiPlugin(): PluginConfiguration {
        val pluginPropertiesJson = """
            {
              "url": "${server.url("/")}",
              "authenticationPluginConfiguration": "${openzaakPluginConfiguration.id.id}"
            }
        """.trimIndent()

        val configuration = pluginService.createPluginConfiguration(
            "Zaken Api plugin configuration",
            objectMapper.readTree(
                pluginPropertiesJson
            ) as ObjectNode,
            "zakenapi"
        )
        return configuration
    }

    private fun createProcessLink(
        externeKlanttaakPluginConfiguration: PluginConfiguration,
        createActionConfiguration: String,
        processDefinitionKey: String = CREATE_PROCESS_DEFINITION_KEY
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
                "create-externe-klanttaak",
                activityType = ActivityTypeWithEventName.USER_TASK_CREATE
            )
        )
    }

    private fun addCompleteProcessLink(
        externeKlanttaakPluginConfiguration: PluginConfiguration,
        completeActionConfiguration: String,
        processDefinitionKey: String = COMPLETE_PROCESS_DEFINITION_KEY
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
                "VerwerkExterneKlanttaakTask",
                objectMapper.readTree(completeActionConfiguration) as ObjectNode,
                externeKlanttaakPluginConfiguration.id,
                "complete-externe-klanttaak",
                activityType = ActivityTypeWithEventName.SERVICE_TASK_START
            )
        )
    }

    private fun setupMockZgwServer() {
        val dispatcher: Dispatcher = object : Dispatcher() {
            @Throws(InterruptedException::class)
            override fun dispatch(request: RecordedRequest): MockResponse {
                executedRequests.add(request)
                val path = request.path?.substringBefore('?')
                val response = when (path) {
                    "/kanaal" -> getKanaalResponse()
                    "/abonnement" -> createAbonnementResponse()
                    "/objects" -> createObjectResponse()
                    "/objects/completed" -> {
                        when (request.method) {
                            "GET" -> createSubmittedObjectResponse()
                            "POST" -> createSubmittedObjectResponse()
                            "PATCH" -> createCompletedObjectResponse()
                            else -> MockResponse().setResponseCode(405)
                        }
                    }

                    "/zaakinformatieobjecten" -> {
                        when (request.method) {
                            "POST" -> getLinkDocumentResponse()
                            "GET" -> getZaakDocumentenResponse()
                            else -> MockResponse().setResponseCode(405)
                        }
                    }

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

    private fun getZaakDocumentenResponse(): MockResponse {

        val body =
            """
                [
                    {
                    "url": "http://localhost/${UUID.randomUUID()}",
                    "uuid": "${UUID.randomUUID()}",
                    "informatieobject": "http://localhost/${UUID.randomUUID()}",
                    "zaak": "${server.url("/")}zaak",
                    "aardRelatieWeergave": "something",
                    "registratiedatum": "2024-11-20T14:13:22Z"
                    }
                ]
            """.trimIndent()
        return mockJsonResponse(body)
    }

    private fun getLinkDocumentResponse(): MockResponse {
        val body =
            """
                {
                "url": "http://localhost/${UUID.randomUUID()}",
                "uuid": "${UUID.randomUUID()}",
                "informatieobject": "http://localhost/${UUID.randomUUID()}",
                "zaak": "${server.url("/")}zaak",
                "aardRelatieWeergave": "something",
                "registratiedatum": "2024-11-20T14:13:22Z"
                }
            """.trimIndent()
        return mockJsonResponse(body)
    }

    private fun createObjectResponse(): MockResponse {
        val body = """
            {
              "url": "http://example.com",
              "uuid": "095be615-a8ad-4c33-8e9c-c7612fbf6c9f",
              "type": "https://example.com/object-type-id",
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

    private fun createSubmittedObjectResponse(): MockResponse {
        val body = """
            {
                "uuid": "${UUID.randomUUID()}",
                "url": "${server.url("/")}objects/completed",
                "type": "${server.url("/")}object-type-id",
                "record": {
                    "typeVersion": 1,
                    "data": {
                        "titel": "Name Change Task",
                        "status": "afgerond",
                        "soort": "portaalformulier",
                        "portaalformulier": {
                            "formulier": {
                                "soort": "url",
                                "value": "https://example.com/some-form"
                            },
                            "data": {
                                "currentName": "Jan"
                            },
                            "verzonden_data": {
                                "documenten": [
                                    "/nameChangeProof"
                                ],
                                "newName": "Julia",
                                "doYouAgree": true,
                                "nameChangeProof": [
                                    "https://example.com/some-document"
                                ]
                            }
                        },
                        "url": {"uri": "https://example.com/external-url"},
                        "identificatie": {
                            "type": "bsn",
                            "value": "999990755"
                        },
                        "verloopdatum": "2024-12-23T23:00",
                        "eigenaar": "GZAC",
                        "verwerker_taak_id": "$verwerkerTaakId"
                    },
                    "startAt": "2024-11-07"
                }
            }
        """.trimIndent()
        return mockJsonResponse(body)
    }

    private fun createCompletedObjectResponse(): MockResponse {
        val body = """
            {
                "uuid": "${UUID.randomUUID()}",
                "url": "${server.url("/")}objects/completed",
                "type": "${server.url("/")}object-type-id",
                "record": {
                    "typeVersion": 1,
                    "data": {
                        "titel": "Name Change Task",
                        "status": "verwerkt",
                        "soort": "portaalformulier",
                        "portaalformulier": {
                            "formulier": {
                                "soort": "url",
                                "value": "https://example.com/some-form"
                            },
                            "data": {
                                "currentName": "Jan"
                            },
                            "verzonden_data": {
                                "documenten": "/nameChangeProof",
                                "newName": "Julia",
                                "doYouAgree": true,
                                "nameChangeProof": [
                                    "https://example.com/some-document"
                                ]
                            }
                        },
                        "url": {"uri": "https://example.com/external-url"},
                        "identificatie": {
                            "type": "bsn",
                            "value": "999990755"
                        },
                        "verloopdatum": "2024-12-23T23:00",
                        "eigenaar": "GZAC",
                        "verwerker_taak_id": "$verwerkerTaakId"
                    },
                    "startAt": "2024-11-07"
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
        override val configurationId: PluginConfigurationId
            get() = PluginConfigurationId.newId()

        override fun applyAuth(builder: Builder): Builder {
            return builder
        }

        override fun filter(request: ClientRequest, next: ExchangeFunction): Mono<ClientResponse> {
            return next.exchange(request)
        }
    }

    companion object {
        private val objectMapper = MapperSingleton.get()
        private const val CREATE_PROCESS_DEFINITION_KEY = "create-externe-klanttaak"
        private const val COMPLETE_PROCESS_DEFINITION_KEY = "externe-klanttaak-verwerk-afgeronde-externe-klanttaak"
        private const val DOCUMENT_DEFINITION_KEY = "profile"
    }
}