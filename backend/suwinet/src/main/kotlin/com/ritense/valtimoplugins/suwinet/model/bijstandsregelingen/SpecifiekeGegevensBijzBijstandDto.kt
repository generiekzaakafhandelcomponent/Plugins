package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

data class SpecifiekeGegevensBijzBijstandDto(

    val cdClusterBijzBijstand: String?,
    val omsSrtKostenBijzBijstand: String?,
    val datBetaalbaarBijzBijstand: String?,
    val partnerBijzBijstand: PartnerBijstandDto

)
