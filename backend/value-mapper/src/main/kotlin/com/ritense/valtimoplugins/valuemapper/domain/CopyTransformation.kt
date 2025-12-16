/*
 * Copyright 2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.valuemapper.domain

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimoplugins.valuemapper.processor.SpelExpressionProcessor

data class CopyTransformation(
    private val `when`: Any,
    private val then: Any? = null,
    private val skipCondition: String? = null,
) : ValueMapperTransformation() {
    override fun canTransform(node: JsonNode): Boolean = `when` == mapper.convertValue(node)

    override fun transform(value: Any): Pair<Boolean, Any> {
        if (
            !skipCondition.isNullOrBlank() &&
            SpelExpressionProcessor.get().isExpression(skipCondition)
        ) {
            val contextMap = mapOf("it" to value)
            if (SpelExpressionProcessor.get(contextMap).process<Boolean>(skipCondition) == true) {
                return true to value
            } else {
                return false to (then ?: value)
            }
        }
        return false to (then ?: value)
    }

    companion object {
        private val mapper = MapperSingleton.get()
    }
}
