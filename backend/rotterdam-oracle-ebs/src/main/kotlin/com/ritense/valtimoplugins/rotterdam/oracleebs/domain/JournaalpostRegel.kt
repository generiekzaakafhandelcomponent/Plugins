package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class JournaalpostRegel(
    val grootboekSleutel: String?,
    val bronSleutel: String?,
    val boekingType: String,
    val bedrag: String,
    val omschrijving: String? = null,
    val bronspecifiekeWaarden: List<BronspecifiekeWaarde>? = null,
) {

    companion object {
        @Suppress("UNCHECKED_CAST")
        fun from(map: LinkedHashMap<String, Any?>) =
            JournaalpostRegel(
                grootboekSleutel = (map["grootboekSleutel"] as? String),
                bronSleutel = (map["bronSleutel"] as? String),
                boekingType = map["boekingType"] as String,
                bedrag = map["bedrag"] as String,
                omschrijving = map["omschrijving"] as? String,
                bronspecifiekeWaarden = (map["bronspecifiekeWaarden"] as? List<*>)
                    ?.filterIsInstance<LinkedHashMap<String, Any>>()
                    ?.map {
                        BronspecifiekeWaarde(
                            naam = it["naam"] as String,
                            waarde = it["waarde"] as String,
                            volgorde = it["volgorde"] as String,
                        )
                    }
            )
    }
}
