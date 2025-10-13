package com.ritense.valtimo.suwinet.model

import com.ritense.valtimoplugins.suwinet.model.InkomstenType

data class UwvSoortIkvDto(
    val code: String = "",
    val name: String = "",
    val type: InkomstenType = InkomstenType.ONBEKEND
)
