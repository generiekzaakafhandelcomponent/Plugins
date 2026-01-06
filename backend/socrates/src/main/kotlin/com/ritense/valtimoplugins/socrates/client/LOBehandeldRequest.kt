package com.ritense.valtimoplugins.socrates.client

import com.ritense.valtimoplugins.socrates.model.LoBehandeld

data class LOBehandeldRequest(
    val identificatie: String,
    val loBehandeld: LoBehandeld
)
