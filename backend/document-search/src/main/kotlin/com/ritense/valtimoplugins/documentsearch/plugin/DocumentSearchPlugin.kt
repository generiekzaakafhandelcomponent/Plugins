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
 *
 */


package com.ritense.valtimoplugins.documentsearch.plugin

import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.Document
import com.ritense.document.service.DocumentService
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.documentsearch.service.DocumentSearchPluginService
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "document-search",
    title = "Document search",
    description = "Document search plugin for searching documents",
)
class DocumentSearchPlugin(
    private val documentService: DocumentService,
    private val documentSearchPluginService: DocumentSearchPluginService
) {
    @PluginAction(
        key = "search-document",
        title = "Search document",
        description = "Search document",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun searchDocuments(
        execution: DelegateExecution,
        @PluginActionProperty documentPath: String,
        @PluginActionProperty searchedValue: String,
        @PluginActionProperty resultProcessVariableName: String
    ) {

        val businessKey = execution.businessKey
        val documentDefinitionName = getDocumentById(businessKey).definitionId().name()

        logger.info {
            "Searching cases of type='$documentDefinitionName' | path='$documentPath' searched value='$searchedValue'"
        }

        val results = documentSearchPluginService.searchDocuments(
            documentPath = documentPath,
            documentDefinitionName = documentDefinitionName,
            searchedValue = searchedValue
        )
        val documentIds = results.map { it.id().toString() }

        logger.info {
            "${documentIds.size} matching cases found (path='$documentPath', value='$searchedValue', businessKey='$businessKey')"
        }

        execution.processInstance.setVariable(resultProcessVariableName, documentIds)
    }

    private fun getDocumentById(businessKey: String): Document {
        return runWithoutAuthorization { documentService.get(businessKey) }
    }

    companion object {
        private val logger = KotlinLogging.logger { }
    }
}
