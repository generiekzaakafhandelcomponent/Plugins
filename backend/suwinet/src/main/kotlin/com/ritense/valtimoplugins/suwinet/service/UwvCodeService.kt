package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimoplugins.suwinet.model.UwvCodesDto
import org.springframework.core.io.ClassPathResource

class UwvCodeService {

    private var arbeidsverhoudingCodes: List<UwvCodesDto>
    private var typeArbeidscontractCodes: List<UwvCodesDto>
    private var jaNeeCodes: List<UwvCodesDto>

    init {
        val codeAardArbeidsverhoudingTable = ClassPathResource(CODE_AARD_ARBEIDSVERHOUDING_TABLE)
        this.arbeidsverhoudingCodes = objectMapper.readValue(codeAardArbeidsverhoudingTable.inputStream)
        val codesTypeArbeidscontractTable = ClassPathResource(CODES_TYPE_ARBEIDSCONTRACT_TABLE)
        this.typeArbeidscontractCodes = objectMapper.readValue(codesTypeArbeidscontractTable.inputStream)
        val codesJaNeeTable = ClassPathResource(CODES_JA_NEE_TABLE)
        this.jaNeeCodes = objectMapper.readValue(codesJaNeeTable.inputStream)
    }

    fun getCodeArbeidsverhouding(code: String): UwvCodesDto {
        return arbeidsverhoudingCodes.firstOrNull{ it.code == code }?:UwvCodesDto(code, "not found")
    }

    fun getTypeArbeidscontract(code: String): UwvCodesDto {
        return typeArbeidscontractCodes.firstOrNull{ it.code == code }?:UwvCodesDto(code, "not found")
    }

    fun getCodeJaNee(code: String): UwvCodesDto {
        return jaNeeCodes.firstOrNull{ it.code == code }?:UwvCodesDto(code, "not found")
    }

    companion object {
        private val CODE_AARD_ARBEIDSVERHOUDING_TABLE = "brondata/codes_aard_arbeidsverhouding.json"
        private val CODES_TYPE_ARBEIDSCONTRACT_TABLE = "brondata/codes_type_arbeidscontract.json"
        private val CODES_JA_NEE_TABLE = "brondata/codes_ja_nee.json"
        private val objectMapper = jacksonObjectMapper()
    }
}
