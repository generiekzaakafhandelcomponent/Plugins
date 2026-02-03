package com.ritense.valtimoplugins.suwinet.service

import org.junit.jupiter.api.Test
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class SuwinetUtilTest {

    @Test
    fun `parseSuwinetN8Date should parse valid N8 date string`() {
        val result = SuwinetUtil.parseSuwinetN8Date("20231215")

        assertEquals(LocalDate.of(2023, 12, 15), result)
    }

    @Test
    fun `parseSuwinetN8Date should parse first day of year`() {
        val result = SuwinetUtil.parseSuwinetN8Date("20240101")

        assertEquals(LocalDate.of(2024, 1, 1), result)
    }

    @Test
    fun `parseSuwinetN8Date should parse last day of year`() {
        val result = SuwinetUtil.parseSuwinetN8Date("20231231")

        assertEquals(LocalDate.of(2023, 12, 31), result)
    }

    @Test
    fun `parseSuwinetN8Date should parse leap day`() {
        val result = SuwinetUtil.parseSuwinetN8Date("20240229")

        assertEquals(LocalDate.of(2024, 2, 29), result)
    }

    @Test
    fun `parseSuwinetN8Date should throw on empty string`() {
        assertFailsWith<java.time.format.DateTimeParseException> {
            SuwinetUtil.parseSuwinetN8Date("")
        }
    }

    @Test
    fun `parseSuwinetN8Date should throw on incorrect format`() {
        assertFailsWith<java.time.format.DateTimeParseException> {
            SuwinetUtil.parseSuwinetN8Date("2023-12-15")
        }
    }

    @Test
    fun `parseSuwinetN8Date should throw on invalid month`() {
        assertFailsWith<java.time.format.DateTimeParseException> {
            SuwinetUtil.parseSuwinetN8Date("20231301")
        }
    }

    @Test
    fun `parseSuwinetN8Date should throw on invalid day`() {
        assertFailsWith<java.time.format.DateTimeParseException> {
            SuwinetUtil.parseSuwinetN8Date("20231232")
        }
    }

    @Test
    fun `n8Formatter should format LocalDate back to N8 string`() {
        val date = LocalDate.of(2023, 3, 5)

        assertEquals("20230305", date.format(SuwinetUtil.n8Formatter))
    }
}
