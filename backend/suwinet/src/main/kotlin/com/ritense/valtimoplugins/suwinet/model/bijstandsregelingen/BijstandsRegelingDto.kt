package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen


data class BijstandsRegelingDto(

    val aanvraagUitkering: List<AanvraagUitkeringDto>,

    val partnerBijstand: PartnerBijstandDto,

    val burgerservicenr: String?,


)
