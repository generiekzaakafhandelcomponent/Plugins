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

package com.ritense.valtimoplugins.valuemapper.processor

import org.springframework.expression.EvaluationContext
import org.springframework.expression.Expression
import org.springframework.expression.ParseException
import org.springframework.expression.ParserContext
import org.springframework.expression.common.TemplateParserContext
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.springframework.expression.spel.support.StandardEvaluationContext

class SpelExpressionProcessor(
    private val parserContext: ParserContext = TemplateParserContext("\${", "}"),
    private val evaluationContext: EvaluationContext = StandardEvaluationContext(),
    private val contextMap: Map<String, Any?> = mapOf()
) {

    fun <T> process(expression: String, resultType: Class<T>? = null): T? {
        val spelExpression: Expression = try {
            getParser().parseExpression(expression, parserContext)
        } catch (e: ParseException) {
            throw RuntimeException("Failed to parse SpEL expression: \"expression\"", e)
        }

        return try {
            spelExpression.getValue(evaluationContext, contextMap, resultType)
        } catch (e: RuntimeException) {
            throw RuntimeException("Failed to parse SpEL expression: \"$expression\"", e)
        }
    }

    fun isExpression(expression: Any): Boolean {
        return runCatching {
            expression as String
            getParser().parseRaw(expression)
            return true
        }.getOrDefault(false)
    }

    private fun getParser(): SpelExpressionParser = SpelExpressionParser()

    companion object {
        fun get(contextMap: Map<String, Any> = emptyMap()) =
            SpelExpressionProcessor(contextMap = contextMap)
    }
}