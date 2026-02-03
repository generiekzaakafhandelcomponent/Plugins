package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.time.LocalDate


data class VorderingDto(
    val identificatienrVordering: String?,
    val datBesluitVordering: LocalDate?,
    val cdRedenVordering: String?,
    val szWet: SzWetDto?,
    val partnersVordering: MutableList<PartnerDto>,
    val bron: BronDto?
)
