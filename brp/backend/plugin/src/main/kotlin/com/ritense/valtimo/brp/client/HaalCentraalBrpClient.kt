package com.ritense.valtimo.brp.client

import com.ritense.valtimo.implementation.haalcentraal.brp.client.HaalCentraalBrpResponse
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.bodyToMono
import reactor.core.publisher.Mono

class HaalCentraalBrpClient(
    private val haalCentraalBrpClient: WebClient
) {
    fun getPersonByBsn(
        burgerservicenummer: String,
        haalCentraalBrpProperties: HaalCentraalBrpProperties,
        requestUserId: String = "-",
        requestSubjectIdentifier: String  = "-",
        requestProcessId: String = "-"
    ): Mono<HaalCentraalBrpResponse> {
        val bodyProperties = mapOf(
            "type" to BRP_REQUEST_TYPE,
            "burgerservicenummer" to listOf(burgerservicenummer),
            "fields" to BRP_REQUESTED_FIELDS.joinToString(",")
        )
        return buildWebClient(haalCentraalBrpProperties)
            .post().uri("/personen")
            // see also the default headers in buildWebClient()
            .header(NLX_HEADER_REQUEST_USER_ID, requestUserId)
            .header(NLX_HEADER_REQUEST_SUBJECT_IDENTIFIER, requestSubjectIdentifier)
            .header(NLX_HEADER_REQUEST_DATA_SUBJECT, "$BSN=$burgerservicenummer")
            .header(NLX_HEADER_REQUEST_PROCESS_ID, requestProcessId)
            .bodyValue(bodyProperties)
            .retrieve()
            .bodyToMono()
    }

    private fun buildWebClient(haalCentraalBrpProperties: HaalCentraalBrpProperties): WebClient {
        return haalCentraalBrpClient
            .mutate()
            .baseUrl(haalCentraalBrpProperties.url.orEmpty())
            .defaultHeader(haalCentraalBrpProperties.apiKeyHeaderName, haalCentraalBrpProperties.apiKey)
            .defaultHeader(NLX_HEADER_REQUEST_APPLICATION_ID, haalCentraalBrpProperties.applicationId)
            .defaultHeader(NLX_HEADER_REQUEST_DATA_ELEMENTS, DATA_ELEMENTS)
            .build()
    }

    companion object {
        val BRP_REQUESTED_FIELDS = arrayListOf(
            "burgerservicenummer",
            "naam.voornamen",
            "naam.voorletters",
            "naam.voorvoegsel",
            "naam.geslachtsnaam",
            "geslachtsaanduiding",
            "geboorte.datum",
            "nationaliteiten",
            "geheimhoudingPersoonsgegevens",
            "verblijfplaats",
            "kinderen"
        )
        const val BRP_REQUEST_TYPE = "RaadpleegMetBurgerservicenummer"

        const val NLX_HEADER_REQUEST_USER_ID = "X-NLX-Request-User-Id"
        const val NLX_HEADER_REQUEST_APPLICATION_ID = "X-NLX-Request-Application-Id"
        const val NLX_HEADER_REQUEST_SUBJECT_IDENTIFIER = "X-NLX-Request-Subject-Identifier"
        const val NLX_HEADER_REQUEST_DATA_ELEMENTS = "X-NLX-Request-Data-Elements"
        const val NLX_HEADER_REQUEST_DATA_SUBJECT = "X-NLX-Request-Data-Subject"
        const val NLX_HEADER_REQUEST_PROCESS_ID = "X-NLX-Request-Process-Id"

        const val BSN = "bsn"
//        TODO YS: this truly can not be right but the customer INSISTS that this is correct
        val DATA_ELEMENTS = """Persoon: Voornamen, Voorvoegsel, Geslachtsnaam, Voorletters, Geslachtsaanduiding, Aanhef, Geboortedatum, Burgelijke staat, Code nationaliteit, Indicatie geheimhouding  persoonsgegevens, Straatnaam, Huisnummer, Huisletter, Huisnummertoevoeging, Postcode, Woonplaatsnaam, Kinderen: Burgerservicenummer, Voornamen, Voorvoegsel, Geslachtsnaam, Geboortedatum""".trimIndent()
    }
}