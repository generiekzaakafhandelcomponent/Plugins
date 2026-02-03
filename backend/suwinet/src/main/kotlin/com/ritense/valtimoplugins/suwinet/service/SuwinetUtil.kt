package com.ritense.valtimoplugins.suwinet.service

import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * Harbours generic Suwinet concepts.
 */
object SuwinetUtil {

    val n8Formatter = DateTimeFormatter.ofPattern("yyyyMMdd")

    /**
     * Expects dates as String conforming to Suwinet N8 notation, EEJJMMDD.
     */
    fun parseSuwinetN8Date(string: String): LocalDate {
       return LocalDate.parse(string, n8Formatter)
    }
}
