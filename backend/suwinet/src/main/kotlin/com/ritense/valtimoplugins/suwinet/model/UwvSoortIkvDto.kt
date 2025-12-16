package com.ritense.valtimoplugins.suwinet.model

data class UwvSoortIkvDto(
    val code: String = "",
    val name: String = "",
    val type: InkomstenType = InkomstenType.ONBEKEND
)
