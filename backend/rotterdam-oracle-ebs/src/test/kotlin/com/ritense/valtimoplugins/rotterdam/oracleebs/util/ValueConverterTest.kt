package com.ritense.valtimoplugins.rotterdam.oracleebs.util

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

class ValueConverterTest {

    @Test
    fun `localDateFrom returns LocalDate when input is LocalDate`() {
        val date = LocalDate.of(2023, 5, 17)
        val result = ValueConverter.localDateFrom(date)
        assertEquals(date, result)
    }

    @Test
    fun `localDateFrom parses LocalDate from trimmed String`() {
        val result = ValueConverter.localDateFrom(" 2023-05-17 ")
        assertEquals(LocalDate.of(2023, 5, 17), result)
    }

    @Test
    fun `localDateFrom throws on unsupported type`() {
        assertThrows(IllegalArgumentException::class.java) {
            ValueConverter.localDateFrom(true)
        }
    }

    @Test
    fun `offsetDateTimeFrom returns OffsetDateTime when input is OffsetDateTime`() {
        val odt = OffsetDateTime.parse("2023-01-02T03:04:05+02:00")
        val result = ValueConverter.offsetDateTimeFrom(odt)
        assertEquals(odt, result)
    }

    @Test
    fun `offsetDateTimeFrom parses OffsetDateTime from trimmed String`() {
        val result = ValueConverter.offsetDateTimeFrom(" 2023-01-02T03:04:05+02:00 ")
        assertEquals(OffsetDateTime.parse("2023-01-02T03:04:05+02:00"), result)
    }

    @Test
    fun `offsetDateTimeFrom throws on unsupported type`() {
        assertThrows(IllegalArgumentException::class.java) {
            ValueConverter.offsetDateTimeFrom(123L)
        }
    }

    @Test
    fun `doubleFrom handles numeric types`() {
        assertEquals(12.34, ValueConverter.doubleFrom(12.34), 0.000001)
        assertEquals(12.34, ValueConverter.doubleFrom(12.34f), 0.000001)
        assertEquals(12.0, ValueConverter.doubleFrom(12), 0.000001)
    }

    @Test
    fun `doubleFrom parses String with various decimal separators`() {
        // European style with thousand separator dot and decimal comma
        assertEquals(1234.56, ValueConverter.doubleFrom("1.234,56"), 0.000001)
        // US style with thousand separator comma and decimal dot
        assertEquals(1234.56, ValueConverter.doubleFrom("1,234.56"), 0.000001)
        // Only comma as decimal
        assertEquals(1234.56, ValueConverter.doubleFrom("1234,56"), 0.000001)
        // Only dot as decimal
        assertEquals(1234.56, ValueConverter.doubleFrom("1234.56"), 0.000001)
        // Trimmed string
        assertEquals(42.0, ValueConverter.doubleFrom(" 42 "), 0.000001)
    }

    @Test
    fun `doubleFrom returns 0_0 on unsupported type`() {
        assertEquals(0.0, ValueConverter.doubleFrom(listOf(1, 2, 3)), 0.000001)
    }

    @Test
    fun `bigDecimalFrom handles numeric types`() {
        assertEquals(BigDecimal("12.34"), ValueConverter.bigDecimalFrom(BigDecimal("12.34")))
        assertEquals(BigDecimal("12.34"), ValueConverter.bigDecimalFrom(12.34))
        assertEquals(BigDecimal("12.34"), ValueConverter.bigDecimalFrom(12.34f))
        assertEquals(BigDecimal("12"), ValueConverter.bigDecimalFrom(12))
    }

    @Test
    fun `bigDecimalFrom parses String with various decimal separators`() {
        assertEquals(BigDecimal("1234.56"), ValueConverter.bigDecimalFrom("1.234,56"))
        assertEquals(BigDecimal("1234.56"), ValueConverter.bigDecimalFrom("1,234.56"))
        assertEquals(BigDecimal("1234.56"), ValueConverter.bigDecimalFrom("1234,56"))
        assertEquals(BigDecimal("1234.56"), ValueConverter.bigDecimalFrom("1234.56"))
        assertEquals(BigDecimal("42"), ValueConverter.bigDecimalFrom(" 42 "))
    }

    @Test
    fun `bigDecimalFrom returns ZERO on unsupported type`() {
        assertEquals(BigDecimal.ZERO, ValueConverter.bigDecimalFrom(mapOf("a" to 1)))
    }

    @Test
    fun `integerOrNullFrom handles Int and numeric String`() {
        assertEquals(42, ValueConverter.integerOrNullFrom(42))
        assertEquals(42, ValueConverter.integerOrNullFrom("42"))
    }

    @Test
    fun `integerOrNullFrom returns null for null or unsupported`() {
        assertNull(ValueConverter.integerOrNullFrom(null))
        assertNull(ValueConverter.integerOrNullFrom(42.0))
    }

    @Test
    fun `stringFrom returns trimmed String or empty for non-string`() {
        assertEquals("abc", ValueConverter.stringFrom("  abc  "))
        assertEquals("", ValueConverter.stringFrom(123))
    }

    @Test
    fun `stringOrNullFrom returns trimmed String or null for non-string`() {
        assertEquals("abc", ValueConverter.stringOrNullFrom("  abc  "))
        assertNull(ValueConverter.stringOrNullFrom(123))
        assertNull(ValueConverter.stringOrNullFrom(null))
    }

    @Test
    fun `replaceCommaWithDotAsDecimalSeparator covers all patterns`() {
        // Both separators with comma as decimal -> remove dots, replace comma with dot
        assertEquals("1234.56", ValueConverter.replaceCommaWithDotAsDecimalSeparator("1.234,56"))
        // Both separators with dot as decimal -> remove commas
        assertEquals("1234.56", ValueConverter.replaceCommaWithDotAsDecimalSeparator("1,234.56"))
        // Only comma as decimal -> replace comma with dot
        assertEquals("1234.56", ValueConverter.replaceCommaWithDotAsDecimalSeparator("1234,56"))
        // Only dot as decimal -> unchanged
        assertEquals("1234.56", ValueConverter.replaceCommaWithDotAsDecimalSeparator("1234.56"))
        // No decimal separators -> unchanged
        assertEquals("1234", ValueConverter.replaceCommaWithDotAsDecimalSeparator("1234"))
    }
}
