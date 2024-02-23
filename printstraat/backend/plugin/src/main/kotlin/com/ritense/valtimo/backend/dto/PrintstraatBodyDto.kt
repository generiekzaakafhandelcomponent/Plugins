package com.ritense.valtimo.implementation.commutr.printstraat.dto

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

data class PrintstraatBodyDto(
    val zaaknummer: String,
    val fileName: String,
    val file: String
    )
