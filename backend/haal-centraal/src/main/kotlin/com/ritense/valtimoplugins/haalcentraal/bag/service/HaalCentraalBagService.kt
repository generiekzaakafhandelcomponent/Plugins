package com.ritense.valtimoplugins.haalcentraal.bag.service

import com.ritense.valtimoplugins.haalcentraal.bag.client.HaalCentraalBagClient
import com.ritense.valtimoplugins.haalcentraal.bag.model.Address
import com.ritense.valtimoplugins.haalcentraal.bag.model.AddressDto
import com.ritense.valtimoplugins.haalcentraal.bag.model.AddressRequest
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import java.net.URI

class HaalCentraalBagService(
    private val haalCentraalBagClient: HaalCentraalBagClient
) {

    fun getAdresseerbaarObjectIdentificatie(
        baseUrl: URI,
        addressRequest: AddressRequest,
        haalCentraalAuthentication: HaalCentraalAuthentication
    ): List<AddressDto> {
        logger.info("Fetching address for postcode: ${addressRequest.postcode}, huisnummer: ${addressRequest.huisnummer}")

        val cleanAddressRequest = AddressRequest(
            postcode = addressRequest.postcode,
            huisnummer = addressRequest.huisnummer,
            huisnummertoevoeging = addressRequest.huisnummertoevoeging?.takeIf { it.isNotBlank() },
            huisletter = addressRequest.huisletter?.takeIf { it.isNotBlank() },
            exacteMatch = addressRequest.exacteMatch
        )

        val response = haalCentraalBagClient.getAdresseerbaarObjectIdentificatie(
            baseUrl = baseUrl,
            addressRequest = cleanAddressRequest,
            authentication = haalCentraalAuthentication
        )

        return response?.embedded?.adressen?.map { address -> address.toDto() } ?: emptyList()
    }

    private fun Address.toDto(): AddressDto = AddressDto(
        openbareRuimteNaam = this.openbareRuimteNaam,
        korteNaam = this.korteNaam,
        huisnummer = this.huisnummer,
        huisletter = this.huisletter,
        huisnummertoevoeging = this.huisnummertoevoeging,
        postcode = this.postcode,
        woonplaatsNaam = this.woonplaatsNaam,
        nummeraanduidingIdentificatie = this.nummeraanduidingIdentificatie,
        openbareRuimteIdentificatie = this.openbareRuimteIdentificatie,
        woonplaatsIdentificatie = this.woonplaatsIdentificatie,
        adresseerbaarObjectIdentificatie = this.adresseerbaarObjectIdentificatie,
        pandIdentificaties = this.pandIdentificaties,
        indicatieNevenadres = this.indicatieNevenadres,
        adresregel5 = this.adresregel5,
        adresregel6 = this.adresregel6,
        geconstateerd = this.geconstateerd,
        inonderzoek = this.inonderzoek,
        links = this.links,
        embeddedObject = this.embeddedObject
    )

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
