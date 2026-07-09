package com.ritense.valtimoplugins.suwinet.util

import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.springframework.expression.spel.support.StandardEvaluationContext
import java.time.LocalDate

object DateExpressionEvaluator {

    private val spelParser = SpelExpressionParser()

    /**
     * Resolves a date expression string to a LocalDate.
     *
     * Supported formats (evaluated in order):
     *   - null / blank → null (caller decides the default)
     *   - "${<spelExpr>}" → Spring Expression Language with `localDateTimeNow` pre-bound to LocalDate.now();
     *       process variables are accessible as `#varName`. Examples:
     *       `${localDateTimeNow}`, `${localDateTimeNow.minusWeeks(2)}`, `${localDateTimeNow.minusMonths(3)}`
     *   - "yyyy-MM-dd" → literal ISO date
     */
    fun evaluatePeriod(
        startExpr: String?,
        endExpr: String?,
        execution: DelegateExecution
    ): Pair<LocalDate?, LocalDate?> {
        val start = evaluate(startExpr, execution)
        val end = evaluate(endExpr, execution) ?: if (start != null) LocalDate.now() else null
        return start to end
    }

    fun evaluate(expression: String?, execution: DelegateExecution): LocalDate? {
        if (expression.isNullOrBlank()) return null
        val trimmed = expression.trim()
        return when {
            trimmed.startsWith("\${") && trimmed.endsWith("}") -> {
                val spelExpr = trimmed.removePrefix("\${").removeSuffix("}")
                evaluateSpel(spelExpr, execution)
            }
            else -> LocalDate.parse(trimmed)
        }
    }

    private fun evaluateSpel(expression: String, execution: DelegateExecution): LocalDate {
        val context = StandardEvaluationContext(SpelDateContext())
        execution.variables.forEach { (key, value) ->
            context.setVariable(key, if (value is String) tryParseLocalDate(value) ?: value else value)
        }
        return spelParser.parseExpression(expression).getValue(context, LocalDate::class.java)
            ?: error("SpEL expression '\${$expression}' evaluated to null")
    }

    private fun tryParseLocalDate(s: String): LocalDate? = try {
        LocalDate.parse(s)
    } catch (_: Exception) {
        null
    }

    class SpelDateContext {
        @Suppress("unused") // accessed by SpEL via reflection
        val localDateTimeNow: LocalDate = LocalDate.now()
    }
}
