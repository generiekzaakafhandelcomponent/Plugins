package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class JournaalpostRegel(
    val grootboekSleutel: String,
    val boekingType: String,
    val bedrag: String,
    val omschrijving: String? = null,
) {

    companion object {
        fun from(map: LinkedHashMap<String, String>) =
            JournaalpostRegel(
                grootboekSleutel = map["grootboekSleutel"] as String,
                boekingType = map["boekingType"] as String,
                bedrag = map["bedrag"] as String,
                omschrijving = map["omschrijving"] as String
            )
    }
}
