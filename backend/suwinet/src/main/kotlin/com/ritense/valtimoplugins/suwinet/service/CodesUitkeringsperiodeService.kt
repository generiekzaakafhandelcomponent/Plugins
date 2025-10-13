package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimoplugins.suwinet.model.CodesUitkeringsperiodeDto
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.core.io.ClassPathResource

class CodesUitkeringsperiodeService {

    private var codesUitkeringsperiode: List<CodesUitkeringsperiodeDto>

    init {
        val codesUitkeringsperiodeTable = ClassPathResource(BRONDATA_CODES_UITKERINGSPERIODE_TABLE_JSON)
        this.codesUitkeringsperiode = objectMapper.readValue(codesUitkeringsperiodeTable.inputStream)
    }
    fun getCodesUitkeringsperiode(code: String): CodesUitkeringsperiodeDto? {
        return codesUitkeringsperiode.firstOrNull{ it.code == code }
    }

    companion object {
        private val BRONDATA_CODES_UITKERINGSPERIODE_TABLE_JSON = "brondata/codes_uitkeringsperiode_table.json"
        private val objectMapper = jacksonObjectMapper()
        private val logger = KotlinLogging.logger {  }
    }
}
