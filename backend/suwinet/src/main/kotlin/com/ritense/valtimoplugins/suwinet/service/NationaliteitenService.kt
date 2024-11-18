package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimoplugins.suwinet.model.NationaliteitDto
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Service

@Extension
@Service
class NationaliteitenService : ExtensionPoint {

    private var nationaliteiten: List<NationaliteitDto>? = null

    init {
        val nationaliteitenTable = ClassPathResource(BRONDATA_NATIONALITEITEN_TABLE_JSON)
        if (nationaliteitenTable.exists()) {
            this.nationaliteiten = objectMapper.readValue(nationaliteitenTable.inputStream)
        }
    }

    fun getNationaliteit(code: String): NationaliteitDto? {
        return nationaliteiten?.firstOrNull { it.code == code }
    }

    companion object {
        private val BRONDATA_NATIONALITEITEN_TABLE_JSON = "brondata/nationaliteiten_table.json"
        private val objectMapper = jacksonObjectMapper()
    }
}