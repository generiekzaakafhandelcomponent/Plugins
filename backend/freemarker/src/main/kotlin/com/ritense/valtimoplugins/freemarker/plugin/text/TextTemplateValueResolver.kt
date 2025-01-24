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

import com.ritense.document.domain.Document
import com.ritense.document.service.DocumentService
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_TEXT
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import com.ritense.valueresolver.ValueResolverFactory
import com.ritense.valueresolver.ValueResolverOption
import com.ritense.valueresolver.exception.ValueResolverValidationException
import java.util.UUID
import java.util.function.Function
import org.camunda.bpm.engine.delegate.VariableScope
import org.springframework.stereotype.Component

@Component
@SkipComponentScan
class TextTemplateValueResolver(
    private val templateService: TemplateService,
    private val processDocumentService: ProcessDocumentService,
    private val documentService: DocumentService,
) : ValueResolverFactory {

    override fun supportedPrefix() = PREFIX

    override fun createResolver(documentId: String): Function<String, Any?> {
        val document = documentService[documentId]
        return createResolver(document)
    }

    override fun createResolver(processInstanceId: String, variableScope: VariableScope): Function<String, Any?> {
        val document = processDocumentService.getDocument(CamundaProcessInstanceId(processInstanceId), variableScope)
        return createResolver(document, variableScope.variables)
    }

    override fun handleValues(processInstanceId: String, variableScope: VariableScope?, values: Map<String, Any?>) {
        throw UnsupportedOperationException("Can not to save values in template. ${values.keys}")
    }

    override fun handleValues(documentId: UUID, values: Map<String, Any?>) {
        throw UnsupportedOperationException("Can not to save values in template. ${values.keys}")
    }

    override fun createValidator(documentDefinitionName: String): Function<String, Unit> {
        return Function { requestedValue ->
            val templates = templateService.findTemplates(
                templateKey = requestedValue,
                caseDefinitionName = documentDefinitionName,
                templateType = TEMPLATE_TYPE_TEXT,
            )
            require(templates.isNotEmpty()) {
                throw ValueResolverValidationException("Failed to find textTemplate with name '$requestedValue'")
            }
        }
    }

    override fun preProcessValuesForNewCase(values: Map<String, Any?>): Map<String, Any> {
        throw UnsupportedOperationException("Can not to save values in template. ${values.keys}")
    }

    override fun getResolvableKeyOptions(documentDefinitionName: String, version: Long): List<ValueResolverOption> {
        return getResolvableKeyOptions(documentDefinitionName)
    }

    override fun getResolvableKeyOptions(documentDefinitionName: String): List<ValueResolverOption> {
        val templateKeys = templateService.findTemplates(
            caseDefinitionName = documentDefinitionName,
            templateType = TEMPLATE_TYPE_TEXT,
        ).map { it.key }
        return createFieldList(templateKeys)
    }

    protected fun createResolver(
        document: Document,
        processVariables: Map<String, Any?> = emptyMap()
    ): Function<String, Any?> {
        return Function { requestedValue ->
            templateService.generate(
                templateKey = requestedValue,
                caseDefinitionName = document.definitionId().name(),
                templateType = TEMPLATE_TYPE_TEXT,
                document = document,
                processVariables = processVariables,
                strict = false,
            )
        }
    }

    companion object {
        const val PREFIX = "template"
    }
}
