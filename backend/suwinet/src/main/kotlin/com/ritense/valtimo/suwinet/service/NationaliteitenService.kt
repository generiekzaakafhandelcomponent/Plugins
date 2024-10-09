package com.ritense.valtimo.suwinet.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimo.suwinet.model.NationaliteitDto
import org.springframework.core.io.ClassPathResource

class NationaliteitenService {

    private var nationaliteiten: List<NationaliteitDto>

    init {
        val nationaliteitenTable = ClassPathResource(BRONDATA_NATIONALITEITEN_TABLE_JSON)
        this.nationaliteiten = objectMapper.readValue(nationaliteitenTable.inputStream)
    }

    fun getNationaliteit(code: String): NationaliteitDto? {
        return nationaliteiten.firstOrNull { it.code == code }
    }

    companion object {
        private val BRONDATA_NATIONALITEITEN_TABLE_JSON = "brondata/nationaliteiten_table.json"
        private val objectMapper = jacksonObjectMapper()
    }
}