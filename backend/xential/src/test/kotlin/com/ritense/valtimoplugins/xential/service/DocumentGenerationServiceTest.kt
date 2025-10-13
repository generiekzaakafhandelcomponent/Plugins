package com.ritense.valtimoplugins.xential.service

import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.authentication.UserManagementService
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.valtimoplugins.xential.domain.XentialToken
import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import com.rotterdam.esb.xential.api.DefaultApi
import com.rotterdam.esb.xential.model.DocumentCreatieResultaat
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.MockitoAnnotations
import org.mockito.kotlin.any
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.web.client.RestClient
import java.util.UUID

class DocumentGenerationServiceTest {
    @Mock
    lateinit var execution: DelegateExecution

    @Mock
    lateinit var defaultApi: DefaultApi

    @Mock
    lateinit var esbClient: OpentunnelEsbClient

    @Mock
    lateinit var xentialTokenRepository: XentialTokenRepository

    @Mock
    lateinit var userManagementService: UserManagementService

    @Mock
    lateinit var temporaryResourceStorageService: TemporaryResourceStorageService

    @Mock
    lateinit var runtimeService: RuntimeService

    @InjectMocks
    lateinit var documentGenerationService: DocumentGenerationService

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    fun shouldGenerateDocument() {
        whenever(userManagementService.currentUserId).thenReturn("1234456")

        whenever(esbClient.documentApi(any<RestClient>())).thenReturn(defaultApi)

        val xentialDocumentProperties =
            XentialDocumentProperties(
                xentialGroupId = UUID.randomUUID(),
                fileFormat = com.ritense.valtimoplugins.xential.domain.FileFormat.PDF,
                documentFilename = "documentNaam",
                informationObjectType = "object-type",
                documentId = "mijn-kenmerk",
                messageName = "messageName",
                content = "voorbeeld data",
            )

        val creatieResultaat =
            DocumentCreatieResultaat(
                documentCreatieSessieId = UUID.randomUUID().toString(),
                status = DocumentCreatieResultaat.Status.VOLTOOID,
                resumeUrl = null,
            )
        whenever(defaultApi.creeerDocument(any(), any(), any())).thenReturn(creatieResultaat)

        documentGenerationService.generateDocument(
            defaultApi,
            UUID.randomUUID(),
            "xentialGebruikersId",
            UUID.randomUUID().toString(),
            xentialDocumentProperties,
            execution,
        )

        verify(xentialTokenRepository).save(any<XentialToken>())
    }
}
