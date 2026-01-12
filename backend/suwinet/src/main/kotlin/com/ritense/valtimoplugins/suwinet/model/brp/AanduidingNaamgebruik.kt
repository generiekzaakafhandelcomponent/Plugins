package com.ritense.valtimoplugins.suwinet.model.brp

enum class AanduidingNaamgebruik(
    val code: String,
    val description: String
) {
    EIGEN(
        code = "E",
        description = "Eigen geslachtsnaam"
    ),
    PARTNER(
        code = "P",
        description = "Geslachtsnaam van de partner"
    ),
    EIGEN_VOOR_PARTNER(
        code = "V",
        description = "Eigen geslachtsnaam voor die van de partner"
    ),
    PARTNER_VOOR_EIGEN(
        code = "N",
        description = "Eigen geslachtsnaam na die van de partner"
    );

    companion object {
        fun fromCode(code: String): AanduidingNaamgebruik? =
            entries.firstOrNull { it.code == code }
    }
}
