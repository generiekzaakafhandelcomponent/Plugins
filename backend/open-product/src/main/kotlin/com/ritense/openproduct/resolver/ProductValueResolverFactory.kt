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

package com.ritense.openproduct.resolver

import com.ritense.openproduct.service.ProductService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.valueresolver.ValueResolverFactory
import com.ritense.valueresolver.ValueResolverOption
import org.camunda.bpm.engine.delegate.VariableScope
import java.util.UUID
import java.util.function.Function

class ProductValueResolverFactory(
    private val productService: ProductService,
    private val processDocumentService: ProcessDocumentService,
) : ValueResolverFactory {

    override fun supportedPrefix(): String = PREFIX

    override fun createResolver(processInstanceId: String, variableScope: VariableScope): Function<String, Any?> {
        val documentId = processDocumentService.getDocumentId(CamundaProcessInstanceId(processInstanceId), variableScope).toString()
        return createResolver(documentId)
    }

    override fun createResolver(documentId: String): Function<String, Any?> {
        val product = productService.getByDocumentIdOrThrow(documentId)
        return Function { field ->
            when (field) {
                "status" -> product.status
                "naam" -> product.naam
                "startDatum" -> product.startDatum
                "eindDatum" -> product.eindDatum
                "prijs" -> product.prijs
                else -> null // or throw IllegalArgumentException("Unknown product field: $field")
            }
        }
    }

    override fun handleValues(processInstanceId: String, variableScope: VariableScope?, values: Map<String, Any?>) {
        // no-op unless you support targetKey writes; then call productService to write back
    }

    override fun getResolvableKeyOptions(documentDefinitionName: String, version: Long): List<ValueResolverOption> =
        createFieldList(PRODUCT_FIELD_LIST)

    override fun getResolvableKeyOptions(documentDefinitionName: String): List<ValueResolverOption> =
        createFieldList(PRODUCT_FIELD_LIST)

    override fun handleValues(documentId: UUID, values: Map<String, Any?>) {
        // no-op
    }

    companion object {
        const val PREFIX = "product"
        val PRODUCT_FIELD_LIST = listOf("status", "naam", "startDatum", "eindDatum", "prijs").sorted()
    }
}