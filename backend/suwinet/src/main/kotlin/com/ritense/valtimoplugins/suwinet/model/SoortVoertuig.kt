package com.ritense.valtimoplugins.suwinet.model

enum class SoortVoertuig(val code: String, val naam: String) {
    A("A", "Aanhangwagen"),
    B("B", "Bedrijfsauto"),
    C("C", "Bromfiets"),
    D("D", "Driewielig motorrijtuig"),
    M("M", "Motorfiets"),
    P("P", "Personenauto"),
    O("O", "Onbekend");

    companion object {
        fun findByCode(code: String): SoortVoertuig? {
            return values().filter { s -> s.code == code }.firstOrNull()
        }
    }
}
