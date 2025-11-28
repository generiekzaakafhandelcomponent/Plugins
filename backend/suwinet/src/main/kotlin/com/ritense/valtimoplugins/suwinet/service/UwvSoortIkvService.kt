package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimoplugins.suwinet.model.UwvSoortIkvDto
import org.springframework.core.io.ClassPathResource

class UwvSoortIkvService {

    private var soortInkomstenverhoudingCodes: List<UwvSoortIkvDto>

    init {
        val codesSoortInkomstenverhoudingTable = ClassPathResource(CODES_SOORT_INKOMSTENVERHOUDING_TABLE)
        this.soortInkomstenverhoudingCodes = objectMapper.readValue(codesSoortInkomstenverhoudingTable.inputStream)
    }

    fun getCodesoortInkomstenverhouding(code: String): UwvSoortIkvDto {
        return soortInkomstenverhoudingCodes.firstOrNull{ it.code == code }?:UwvSoortIkvDto(code, "not found")
    }

    companion object {
        private val CODES_SOORT_INKOMSTENVERHOUDING_TABLE = "brondata/codes_soort_inkomstenverhouding.json"
        private val objectMapper = jacksonObjectMapper()
    }
}
