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

package com.ritense.valtimoplugins.archief

import com.ritense.document.domain.Document
import com.ritense.document.service.DocumentService
import com.ritense.notificatiesapi.NotificatiesApiListener
import com.ritense.notificatiesapi.NotificatiesApiPlugin
import com.ritense.notificatiesapi.domain.Abonnement
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processdocument.domain.impl.OperatonProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentAssociationService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.archief.domain.ArchiefProperties
import com.ritense.zakenapi.repository.ZaakInstanceLinkRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.validation.Valid
import java.net.URI
import java.util.UUID
import org.operaton.bpm.engine.RepositoryService
import org.springframework.jdbc.core.JdbcTemplate
import org.operaton.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "archief",
    title = "Archief",
    description = "Receives and handles archief event notifications from the Notificaties API"
)
class ArchiefPlugin(
    private val documentService: DocumentService,
    private val zaakInstanceLinkRepository: ZaakInstanceLinkRepository,
    private val processDocumentAssociationService: ProcessDocumentAssociationService,
    private val processDocumentService: ProcessDocumentService,
    private val repositoryService: RepositoryService,
    private val jdbcTemplate: JdbcTemplate,
) : NotificatiesApiListener {

    @PluginProperty(key = "notificatiesApiPluginConfiguration", secret = false)
    lateinit var notificatiesApiPluginConfiguration: NotificatiesApiPlugin

    @PluginProperty(key = "processToStart", secret = false)
    lateinit var processToStart: String

    @Valid
    @PluginProperty(key = "archiefProperties", secret = false)
    lateinit var archiefProperties: List<ArchiefProperties>

    @PluginAction(
        key = "link-process-to-document",
        title = "Link system process to document",
        description = "Links the current system process to the document associated with the zaak instance URL",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun linkProcessToDocument(
        execution: DelegateExecution,
        @PluginActionProperty zaakInstanceUrl: URI?,
        @PluginActionProperty documentId: UUID?,
    ) {
        val resolvedDocumentId = getDocumentId(zaakInstanceUrl, documentId)
        execution.processBusinessKey = resolvedDocumentId.toString()
        processDocumentAssociationService.createProcessDocumentInstance(
            execution.processInstanceId,
            resolvedDocumentId,
            getProcessName(execution.processDefinitionId!!),
        )
        logger.info { "Process '${execution.processInstanceId}' linked to document '$resolvedDocumentId'" }
    }

    @PluginAction(
        key = "delete-document",
        title = "Delete document",
        description = "Delete the document associated with the current case",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun deleteDocument(
        execution: DelegateExecution,
    ) {
        logger.info { "Deleting document with ID '${execution.processBusinessKey}'" }
        val processInstanceId = OperatonProcessInstanceId(execution.processInstanceId)
        val documentId = processDocumentService.getDocumentId(processInstanceId, execution)
        unlinkDocumentFromProcess(execution, processInstanceId, documentId)
        documentService.deleteDocument(documentId)
        logger.info { "Document with id '${documentId.id}' deleted successfully" }
    }

    override fun getNotificatiesApiPlugin(): NotificatiesApiPlugin {
        return notificatiesApiPluginConfiguration
    }

    override fun getKanaalFilters(): List<Abonnement.Kanaal> {
        return archiefProperties.map { archiefProperty ->
            Abonnement.Kanaal(
                naam = archiefProperty.kanaal,
                filters = archiefProperty.filters.associate { filter -> filter.key to filter.value }
            )
        }
    }

    private fun getDocumentId(zaakInstanceUrl: URI?, documentId: UUID?): UUID {
        return when {
            documentId != null -> {
                logger.info { "Using provided documentId '$documentId'" }
                documentId
            }

            zaakInstanceUrl != null -> {
                logger.info { "Looking up documentId for zaak instance URL '$zaakInstanceUrl'" }
                val zaakInstanceLink = zaakInstanceLinkRepository.findByZaakInstanceUrl(zaakInstanceUrl)
                    ?: error("No document linked to zaak instance URL: $zaakInstanceUrl")
                zaakInstanceLink.documentId
            }

            else -> error("Either 'zaakInstanceUrl' or 'documentId' must be provided")
        }
    }

    private fun getProcessName(processDefinitionId: String): String {
        val processDefinition = repositoryService.getProcessDefinition(processDefinitionId)
        return processDefinition.name ?: processDefinition.key
    }

    private fun unlinkDocumentFromProcess(
        execution: DelegateExecution,
        processInstanceId: OperatonProcessInstanceId,
        documentId: Document.Id
    ) {
        if (execution.processBusinessKey == documentId.id.toString()) {
            val newBusinessKey = "DELETED:${documentId.id}"
            execution.processBusinessKey = newBusinessKey
            jdbcTemplate.update(
                "UPDATE ACT_RU_EXECUTION SET BUSINESS_KEY_ = ? WHERE ID_ = ?",
                newBusinessKey, execution.processInstanceId
            )
        }
        val processDocumentInstance = processDocumentAssociationService.findProcessDocumentInstance(processInstanceId)
        if (processDocumentInstance.isPresent) {
            processDocumentAssociationService.deleteProcessDocumentInstance(
                processDocumentInstance.get().processDocumentInstanceId()
            )
            logger.info { "Unlinked process '${processInstanceId}' from document '${documentId.id}'" }
        }
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
