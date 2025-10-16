package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen


data class BijstandsRegelingenDto(

    val aanvraagUitkeringen: List<AanvraagUitkeringDto>,

    val specifiekeGegevensBijzBijstandList: List<SpecifiekeGegevensBijzBijstandDto>,

    val burgerservicenr: String?,

)
