package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen


data class BijstandsRegelingenDto(

    val aanvraagUitkeringen: List<AanvraagUitkeringDto>,

    val specifiekeGegevensBijzBijstandList: List<SpecifiekeGegevensBijzBijstandDto>,

    val vorderingen: List<VorderingDto>,

    val burgerservicenr: String?,

    val propertiesMap: Map<String, Any?>,

    val properties: List<String>,

)
