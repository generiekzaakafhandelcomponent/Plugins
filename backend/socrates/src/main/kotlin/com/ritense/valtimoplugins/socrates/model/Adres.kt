package com.ritense.valtimoplugins.socrates.model

sealed interface Adres {
    /**
     * 1 = NederlandsStraatadres
     * 2 = NederlandsPostbusadres
     * 3 = StraatadresBuitenland
     */
    val soortAdres: String
}
