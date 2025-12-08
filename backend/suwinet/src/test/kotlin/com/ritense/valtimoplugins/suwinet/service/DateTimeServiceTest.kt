package com.ritense.valtimoplugins.suwinet.service

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import java.time.LocalDate

class DateTimeServiceTest {

    @Test
    fun `calculateAge - birthday already happened this year`() {
        val birthDatePassed = LocalDate.now().minusYears(25).minusDays(1).toString()
        val expectedAgePassed = 25
        Assertions.assertEquals(expectedAgePassed, DateTimeService().calculateAge(birthDatePassed))
    }

    @Test
    fun `calculateAge - birthday not yet happened this year`() {
        val birthDateComing = LocalDate.now().minusYears(30).plusDays(1).toString()
        val expectedAgeComing = 29
        Assertions.assertEquals(expectedAgeComing, DateTimeService().calculateAge(birthDateComing))
    }

    @Test
    fun `calculateAge - birthday today`() {
        val birthDateToday = LocalDate.now().minusYears(54).toString()
        val expectedAgeToday = 54
        Assertions.assertEquals(expectedAgeToday, DateTimeService().calculateAge(birthDateToday))
    }

}
