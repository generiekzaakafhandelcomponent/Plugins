package com.ritense.valtimoplugins.suwinet.model.brp

enum class GeslachtsAanduiding(
    val code: String,
    val description: String
) {
    MAN(
        code = "M",
        description = "Man"
    ),
    VROUW(
        code = "V",
        description = "Vrouw"
    ),
    ONBEKEND(
        code = "O",
        description = "Onbekend"
    );

    companion object {
        fun fromCode(code: String): GeslachtsAanduiding? =
            entries.firstOrNull { it.code == code }
    }
}

