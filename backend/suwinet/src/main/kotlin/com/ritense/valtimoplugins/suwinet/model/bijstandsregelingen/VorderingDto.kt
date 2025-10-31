package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen


data class VorderingDto(
    val identificatienrVordering: String?,
    val datBesluitVordering: String?,
    val cdRedenVordering: String?,
    val szWet: SzWetDto?,
    val partnersVordering: MutableList<PartnerDto?>?,
    val bron: BronDto?
)
