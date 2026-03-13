package com.ritense.valtimoplugins.socrates.model

import jakarta.validation.constraints.Pattern

data class UitbetalingUitkering(
    /**
     * De reden waarom er aan een derde uitbetaald moet worden.
     * Een derde is een bewindvoerder of een gemachtigde zoals een curator,
     * een organisatie voor maatschappelijke opvang of een familielid.
     */
    val aanDerdeReden: String? = null,

    @field:Pattern(
        regexp = "^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$",
        message = "bankrekening must be a valid IBAN"
    )
    val bankrekening: String? = null,

    /**
     * IBAN nummer van derde.
     * Een derde is een bewindvoerder of een gemachtigde zoals een curator,
     * een organisatie voor maatschappelijke opvang of een familielid.
     */
    @field:Pattern(
        regexp = "^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$",
        message = "bankrekeningDerde must be a valid IBAN"
    )
    val bankrekeningDerde: String? = null,

    /**
     * IBAN nummer van partner aanvrager.
     */
    @field:Pattern(
        regexp = "^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$",
        message = "bankrekeningPartner must be a valid IBAN"
    )
    val bankrekeningPartner: String? = null,

    /**
     * Naam rekeninghouder.
     */
    val rekeninghouder: String? = null,

    /**
     * Naam rekeninghouder derde.
     * Een derde is een bewindvoerder of een gemachtigde zoals een curator,
     * een organisatie voor maatschappelijke opvang of een familielid.
     */
    val rekeninghouderDerde: String? = null,

    /**
     * Naam rekeninghouder van partner aanvrager.
     */
    val rekeninghouderPartner: String? = null,

    /**
     * 01 = Klant
     * 02 = Partner
     * 03 = Gesplitst
     * 04 = Gemachtigde
     * 05 = Bewindvoerder
     */
    val soortUitbetaling: String,
)
