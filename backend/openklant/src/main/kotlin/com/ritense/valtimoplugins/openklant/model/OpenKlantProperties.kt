package com.ritense.valtimoplugins.openklant.model

import java.net.URI

open class OpenKlantProperties(
    open val klantinteractiesUrl: URI,
    open val token: String,
)