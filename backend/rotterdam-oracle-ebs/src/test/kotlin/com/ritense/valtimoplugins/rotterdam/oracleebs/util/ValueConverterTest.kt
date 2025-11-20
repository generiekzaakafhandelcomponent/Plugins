package com.ritense.valtimoplugins.rotterdam.oracleebs.util

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.within
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

class ValueConverterTest {

    @Test
    fun `localDateFrom returns LocalDate when input is LocalDate`() {
        val date = LocalDate.of(2023, 5, 17)
        val result = ValueConverter.localDateFrom(date)
        assertThat(result).isEqualTo(date)
    }

    @Test
    fun `localDateFrom parses LocalDate from trimmed String`() {
        val result = ValueConverter.localDateFrom(" 2023-05-17 ")
        assertThat(result).isEqualTo(LocalDate.of(2023, 5, 17))
    }

    @Test
    fun `localDateFrom throws on unsupported type`() {
        assertThrows<IllegalArgumentException> {
            ValueConverter.localDateFrom(true)
        }
    }

    @Test
    fun `offsetDateTimeFrom returns OffsetDateTime when input is OffsetDateTime`() {
        val odt = OffsetDateTime.parse("2023-01-02T03:04:05+02:00")
        val result = ValueConverter.offsetDateTimeFrom(odt)
        assertThat(result).isEqualTo(odt)
    }

    @Test
    fun `offsetDateTimeFrom parses OffsetDateTime from trimmed String`() {
        val result = ValueConverter.offsetDateTimeFrom(" 2023-01-02T03:04:05+02:00 ")
        assertThat(result).isEqualTo(OffsetDateTime.parse("2023-01-02T03:04:05+02:00"))
    }

    @Test
    fun `offsetDateTimeFrom throws on unsupported type`() {
        assertThrows<IllegalArgumentException> {
            ValueConverter.offsetDateTimeFrom(123L)
        }
    }

    @Test
    fun `doubleFrom handles numeric types`() {
        assertThat(ValueConverter.doubleFrom(12.34)).isCloseTo(12.34, within(0.000001))
        assertThat(ValueConverter.doubleFrom(12.34f)).isCloseTo(12.34, within(0.000001))
        assertThat(ValueConverter.doubleFrom(12)).isCloseTo(12.0, within(0.000001))
    }

    @Test
    fun `doubleFrom parses String with various decimal separators`() {
        // European style with thousand separator dot and decimal comma
        assertThat(ValueConverter.doubleFrom("1.234,56")).isCloseTo(1234.56, within(0.000001))
        // US style with thousand separator comma and decimal dot
        assertThat(ValueConverter.doubleFrom("1,234.56")).isCloseTo(1234.56, within(0.000001))
        // Only comma as decimal
        assertThat(ValueConverter.doubleFrom("1234,56")).isCloseTo(1234.56, within(0.000001))
        // Only dot as decimal
        assertThat(ValueConverter.doubleFrom("1234.56")).isCloseTo(1234.56, within(0.000001))
        // Trimmed string
        assertThat(ValueConverter.doubleFrom(" 42 ")).isCloseTo(42.0, within(0.000001))
    }

    @Test
    fun `doubleFrom returns 0_0 on unsupported type`() {
        assertThat(ValueConverter.doubleFrom(listOf(1, 2, 3))).isCloseTo(0.0, within(0.000001))
    }

    @Test
    fun `bigDecimalFrom handles numeric types`() {
        assertThat(ValueConverter.bigDecimalFrom(BigDecimal("12.34"))).isEqualTo(BigDecimal("12.34"))
        assertThat(ValueConverter.bigDecimalFrom(12.34)).isEqualTo(BigDecimal("12.34"))
        assertThat(ValueConverter.bigDecimalFrom(12.34f)).isEqualTo(BigDecimal("12.34"))
        assertThat(ValueConverter.bigDecimalFrom(12)).isEqualTo(BigDecimal("12"))
    }

    @Test
    fun `bigDecimalFrom parses String with various decimal separators`() {
        assertThat(ValueConverter.bigDecimalFrom("1.234,56")).isEqualTo(BigDecimal("1234.56"))
        assertThat(ValueConverter.bigDecimalFrom("1,234.56")).isEqualTo(BigDecimal("1234.56"))
        assertThat(ValueConverter.bigDecimalFrom("1234,56")).isEqualTo(BigDecimal("1234.56"))
        assertThat(ValueConverter.bigDecimalFrom("1234.56")).isEqualTo(BigDecimal("1234.56"))
        assertThat(ValueConverter.bigDecimalFrom(" 42 ")).isEqualTo(BigDecimal("42"))
    }

    @Test
    fun `bigDecimalFrom returns ZERO on unsupported type`() {
        assertThat(ValueConverter.bigDecimalFrom(mapOf("a" to 1))).isEqualTo(BigDecimal.ZERO)
    }

    @Test
    fun `integerOrNullFrom handles Int and numeric String`() {
        assertThat(ValueConverter.integerOrNullFrom(42)).isEqualTo(42)
        assertThat(ValueConverter.integerOrNullFrom("42")).isEqualTo(42)
    }

    @Test
    fun `integerOrNullFrom returns null for null or unsupported`() {
        assertNull(ValueConverter.integerOrNullFrom(null))
        assertNull(ValueConverter.integerOrNullFrom(42.0))
    }

    @Test
    fun `stringFrom returns trimmed String or empty for non-string`() {
        assertThat(ValueConverter.stringFrom("  abc  ")).isEqualTo("abc")
        assertThat(ValueConverter.stringFrom(123)).isEqualTo("")
    }

    @Test
    fun `stringOrNullFrom returns trimmed String or null for non-string`() {
        assertThat(ValueConverter.stringOrNullFrom("  abc  ")).isEqualTo("abc")
        assertNull(ValueConverter.stringOrNullFrom(123))
        assertNull(ValueConverter.stringOrNullFrom(null))
    }

    @Test
    fun `replaceCommaWithDotAsDecimalSeparator covers all patterns`() {
        // Both separators with comma as decimal -> remove dots, replace comma with dot
        assertThat(ValueConverter.replaceCommaWithDotAsDecimalSeparator("1.234,56")).isEqualTo("1234.56")
        // Both separators with dot as decimal -> remove commas
        assertThat(ValueConverter.replaceCommaWithDotAsDecimalSeparator("1,234.56")).isEqualTo("1234.56")
        // Only comma as decimal -> replace comma with dot
        assertThat(ValueConverter.replaceCommaWithDotAsDecimalSeparator("1234,56")).isEqualTo("1234.56")
        // Only dot as decimal -> unchanged
        assertThat(ValueConverter.replaceCommaWithDotAsDecimalSeparator("1234.56")).isEqualTo("1234.56")
        // No decimal separators -> unchanged
        assertThat(ValueConverter.replaceCommaWithDotAsDecimalSeparator("1234")).isEqualTo("1234")
    }
}
