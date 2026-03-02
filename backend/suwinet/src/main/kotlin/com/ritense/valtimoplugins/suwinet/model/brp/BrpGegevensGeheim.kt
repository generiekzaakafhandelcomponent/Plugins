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
    );

    companion object {
        fun fromCode(code: String): BrpGegevensGeheim? =
            entries.firstOrNull { it.code == code }
    }
}
