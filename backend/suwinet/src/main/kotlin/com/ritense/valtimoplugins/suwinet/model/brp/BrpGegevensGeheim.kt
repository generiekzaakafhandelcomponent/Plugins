package com.ritense.valtimoplugins.suwinet.model.brp

enum class BrpGegevensGeheim(
    val code: String,
    val description: String
) {
    GEEN_GEHEIMHOUDING(
        code = "0",
        description = "Geen geheimhouding (gegevens mogen worden verstrekt)"
    ),
    GEGEVENS_GEHEIM(
        code = "1",
        description = "Gegevens geheim (verstrekkingsbeperking van toepassing)"
    ),
    NIET_KERKEN(
    code = "2",
    description = "niet aan kerken,"
    ),
    NIET_VRIJE_DERDEN(
        code = "3",
        description = "niet aan vrije derden"
    ),
    NIET_KERKEN_DERDEN(
        code = "4",
        description = "niet zonder toestemming aan derden ter uitvoering van een algemeen verbindend voorschrift en niet aan kerken"
    ),
    NIET_DERDEN_ALGEMEEN(
        code = "5",
        description = "niet zonder toestemming aan derden ter uitvoering van een algemeen verbindend voorschrift en niet aan vrije derden"
    ),
    NIET_KERKEN_VRIJE_DERDEN(
        code = "6",
        description = "niet aan kerken en niet aan vrije derden"
    ),
    NIET_KERKEN_VRIJE_DERDEN_ALGEMEEN_DERDEN(
        code = "7",
        description = "niet zonder toestemming aan derden ter uitvoering van een algemeen verbindend voorschrift en niet aan vrije derden en niet aan kerken"
    );

    companion object {
        fun fromCode(code: String): BrpGegevensGeheim? =
            entries.firstOrNull { it.code == code }
    }
}
