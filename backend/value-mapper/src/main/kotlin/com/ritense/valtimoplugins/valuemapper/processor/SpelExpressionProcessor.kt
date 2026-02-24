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

import org.springframework.context.expression.MapAccessor
import org.springframework.expression.Expression
import org.springframework.expression.ParseException
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.springframework.expression.spel.support.StandardEvaluationContext

class SpelExpressionProcessor {
    /**
     * Parse and evaluate the given String as a SpEL Expression and return the typed result
     *
     * @param expression the expression String that should be evaluated by the [SpelExpressionParser]
     * @param context optional object to use as the rootObject for the [StandardEvaluationContext]
     * @param resultType Class type for the result of the expression.
     *
     * @return the result of the evaluated expression as the specified [resultType]
     *
     * @throws RuntimeException
     **/
    inline fun <reified T : Any> process(
        expression: String,
        context: Any,
        resultType: Class<T>? = T::class.java,
    ): T? {
        val spelExpression: Expression =
            try {
                SpelExpressionParser().parseExpression(expression)
            } catch (e: ParseException) {
                throw RuntimeException("Failed to parse SpEL expression: \"expression\"", e)
            }

        val evaluationContext =
            StandardEvaluationContext(context).apply {
                addPropertyAccessor(MapAccessor())
            }

        return try {
            spelExpression.getValue(evaluationContext, resultType)
        } catch (e: RuntimeException) {
            throw RuntimeException("Failed to parse SpEL expression: \"$expression\"", e)
        }
    }

    /**
     * Attempts to parse the provided expression as a [LiteralExpression][org.springframework.expression.common.LiteralExpression]
     *
     * @param expression the expression String that should be validated by the [SpelExpressionParser]
     *
     * @return a [Boolean] denoting whether the provided expression is a valid SpEL expression
     **/
    fun isExpression(expression: String): Boolean {
        return runCatching {
            SpelExpressionParser().parseRaw(expression)
            return true
        }.getOrDefault(false)
    }
}
