package com.ritense.valtimoplugins.rotterdam.oracleebs.util

import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

object ValueConverter {

    fun localDateFrom(value: Any): LocalDate =
        when (value) {
            is LocalDate -> value
            is String -> LocalDate.parse(value.trim())
            else -> throw IllegalArgumentException("Unsupported type ${value::class}")
        }

    fun offsetDateTimeFrom(value: Any): OffsetDateTime =
        when (value) {
            is OffsetDateTime -> value
            is String -> OffsetDateTime.parse(value.trim())
            else -> throw IllegalArgumentException("Unsupported type ${value::class}")
        }

    fun doubleFrom(value: Any): Double =
        when (value) {
            is Double -> value
            is Float -> value.toDouble()
            is Int -> value.toDouble()
            is String -> replaceCommaWithDotAsDecimalSeparator(value.trim()).toDouble()
            else -> 0.0
        }

    fun bigDecimalFrom(value: Any): BigDecimal =
        when (value) {
            is BigDecimal -> value
            is Double -> value.toBigDecimal()
            is Float -> value.toBigDecimal()
            is Int -> value.toBigDecimal()
            is String -> replaceCommaWithDotAsDecimalSeparator(value.trim()).toBigDecimal()
            else -> BigDecimal.ZERO
        }

    fun integerOrNullFrom(value: Any?): Int? =
        when (value) {
            is Int -> value
            is String -> value.toInt()
            else -> null
        }

    fun stringFrom(value: Any): String =
        when (value) {
            is String -> value.trim()
            else -> ""
        }

    fun stringOrNullFrom(value: Any?): String? =
        when (value) {
            is String -> value.trim()
            else -> null
        }

    fun replaceCommaWithDotAsDecimalSeparator(value: String): String =
        when {
            value.contains(",") && value.contains(".") -> {
                // Based on the index, determine the decimal separator
                if (value.indexOf(",") > value.indexOf(".")) {
                    // Assume comma is the separator ("1.234,56")
                    value.replace(".", "").replace(",", ".")
                } else {
                    // Assume dot is the separator ("1,234.56")
                    value.replace(",", "")
                }
            }
            value.contains(",") -> {
                // Assume comma is separator ("1234,56")
                value.replace(",", ".")
            }
            else -> value // Assume dot is separator or no decimal ("1234.56", "1234")
        }
}
