/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.plugin.text

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_TEXT
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "text-template",
    title = "Text template Plugin",
    description = "Create Text templates with Freemarker"
)
open class TextTemplatePlugin(
    private val templateService: TemplateService,
    private val processDocumentService: ProcessDocumentService,
    private val storageService: TemporaryResourceStorageService,
) {

    @PluginAction(
        key = "generate-text-file",
        title = "Generate Text File",
        description = "Generates text based on the template and saves it in a temporary file",
        activityTypes = [SERVICE_TASK_START]
    )
    open fun generateTextFile(
        execution: DelegateExecution,
        @PluginActionProperty textTemplateKey: String,
        @PluginActionProperty processVariableName: String
    ) {
        val textContent = generateTextContent(execution, textTemplateKey)
        val resourceId = storageService.store(textContent.byteInputStream())
        execution.setVariable(processVariableName, resourceId)
    }

    private fun generateTextContent(execution: DelegateExecution, templateKey: String): String {
        val document = processDocumentService.getDocument(
            CamundaProcessInstanceId(execution.processInstanceId),
            execution
        )
        return templateService.generate(
            templateKey = templateKey,
            caseDefinitionName = document.definitionId().name(),
            templateType = TEMPLATE_TYPE_TEXT,
            document = document,
            processVariables = execution.variables,
        )
    }
}
