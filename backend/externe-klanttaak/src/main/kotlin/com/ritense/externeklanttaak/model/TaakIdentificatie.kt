package com.ritense.externeklanttaak.model

data class TaakIdentificatie(
    val type: String,
    val value: String
) {
    companion object {
        const val TYPE_BSN = "bsn"
        const val TYPE_KVK = "kvk"
    }
}