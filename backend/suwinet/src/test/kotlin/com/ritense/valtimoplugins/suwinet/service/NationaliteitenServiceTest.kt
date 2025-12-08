package com.ritense.valtimoplugins.suwinet.service

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class NationaliteitenServiceTest {

    lateinit var nationaliteitenService: NationaliteitenService

    @BeforeEach
    fun SetUp() {
        nationaliteitenService = NationaliteitenService()
    }

    @Test
    fun `get a nationaliteit`() {

        // given
        val code = "67"
        // when
        val nationaliteit = nationaliteitenService.getNationaliteit(code)?.name
        // then
        Assertions.assertEquals(nationaliteit, "Luxemburgse")
    }

    @Test
    fun `non existing should be null`(){
        // given
        val code = "175"
        // when
        val nationaliteit = nationaliteitenService.getNationaliteit(code)?.name
        // then
        Assertions.assertNull(nationaliteit)
    }

}
