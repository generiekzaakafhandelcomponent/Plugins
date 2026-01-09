package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Onderwerpobject(
    @JsonProperty("uuid")
    override val uuid: String,
    @JsonProperty("url")
    override val url: String,
    @JsonProperty("klantcontact")
    val klantContact: UuidAndUrlReference,
    @JsonProperty("wasKlantcontact")
    val wasKlantcontact: UuidAndUrlReference? = null,
    @JsonProperty("onderwerpobjectidentificator")
    val onderwerpobjectidentificator: Onderwerpobjectidentificator? = null,
) : Referable
