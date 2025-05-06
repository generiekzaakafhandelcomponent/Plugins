package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Links(
    val self: Link,
    val openbareRuimte: Link?,
    val nummeraanduiding: Link?,
    val woonplaats: Link?,
    val adresseerbaarObject: Link?,
    val panden: List<Link>?
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Link(
    val href: String?,
    val templated: Boolean?,
    val title: String?
)
