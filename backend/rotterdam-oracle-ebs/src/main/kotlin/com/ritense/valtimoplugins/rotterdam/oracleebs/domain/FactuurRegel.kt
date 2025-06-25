package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class FactuurRegel(
    val hoeveelheid: String,
    val tarief: String,
    val btwPercentage: String,
    val grootboekSleutel: String,
    val bronSleutel: String,
    val omschrijving: String
) {

    companion object {
        fun from(map: LinkedHashMap<String, String>) =
            FactuurRegel(
                hoeveelheid = map["hoeveelheid"] as String,
                tarief = map["tarief"] as String,
                btwPercentage = map["btwPercentage"] as String,
                grootboekSleutel = map["grootboekSleutel"] as String,
                bronSleutel = map["bronSleutel"] as String,
                omschrijving = map["omschrijving"] as String
            )
    }
}
