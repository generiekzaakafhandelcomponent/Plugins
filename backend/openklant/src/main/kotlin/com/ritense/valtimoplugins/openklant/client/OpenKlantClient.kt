package com.ritense.valtimoplugins.openklant.client

import com.ritense.valtimoplugins.openklant.dto.*
import com.ritense.valtimoplugins.openklant.model.KlantContactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.zgw.Page
import jakarta.validation.Valid
import mu.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.server.ResponseStatusException

class OpenKlantClient(
    private val openKlantWebClientBuilder: WebClient.Builder,
) {
    suspend fun getPartijByBsn(
        bsn: String,
        properties: OpenKlantProperties,
    ): Partij? =
        try {
            webClient(properties)
                .get()
                .uri { uriBuilder ->
                    uriBuilder
                        .path(OK_PARTIJEN_PATH)
                        .queryParam(OK_SOORT_PARTIJ_IDENTIFICATOR_PARAM, "bsn")
                        .queryParam(OK_PARTIJ_IDENTIFICATOR_PARAM, bsn)
                        .queryParam(OK_SOORT_PARTIJ_PARAM, "persoon")
                        .build()
                }.retrieve()
                .awaitBody<Page<Partij>>()
                .results
                .firstOrNull()
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error fetching Partij")
        }

    suspend fun createPartij(
        request: CreatePartijRequest,
        properties: OpenKlantProperties,
    ): Partij =
        try {
            webClient(properties)
                .post()
                .uri(OK_PARTIJEN_PATH)
                .bodyValue(request)
                .retrieve()
                .awaitBody<Partij>()
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error creating Partij")
        }

    suspend fun patchPartij(
        id: String,
        patchData: Map<String, Any>,
        properties: OpenKlantProperties,
    ): Partij =
        try {
            webClient(properties)
                .patch()
                .uri("$OK_PARTIJEN_PATH/$id")
                .bodyValue(patchData)
                .retrieve()
                .awaitBody<Partij>()
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error patching Partij")
        }

    suspend fun getDigitaleAdressenByPartijByUuid(
        uuid: String,
        properties: OpenKlantProperties,
    ): List<DigitaalAdres> =
        try {
            webClient(properties)
                .get()
                .uri { uriBuilder ->
                    uriBuilder
                        .path(OK_DIGITALE_ADRESSEN_PATH)
                        .queryParam(OK_VERSTREKT_DOOR_PARTIJ_ID_PARAM, uuid)
                        .build()
                }.retrieve()
                .awaitBody<Page<DigitaalAdres>>()
                .results
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error fetching DigitaalAdres(by partij, by uuid)")
        }

    suspend fun getDigitaalAdresByUuid(
        uuid: String,
        properties: OpenKlantProperties,
    ): DigitaalAdres =
        try {
            webClient(properties)
                .get()
                .uri("$OK_DIGITALE_ADRESSEN_PATH/$uuid")
                .retrieve()
                .awaitBody<DigitaalAdres>()
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error fetching DigitaalAdres(by uuid)")
        }

    suspend fun createDigitaalAdres(
        request: CreateDigitaalAdresRequest,
        properties: OpenKlantProperties,
    ): DigitaalAdres =
        try {
            webClient(properties)
                .post()
                .uri(OK_DIGITALE_ADRESSEN_PATH)
                .bodyValue(request)
                .retrieve()
                .awaitBody<DigitaalAdres>()
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error creating DigitaalAdres")
        }

    suspend fun getKlantContacten(klantContactOptions: KlantContactOptions): Page<KlantContact> =
        try {
            webClient(klantContactOptions)
                .get()
                .uri { uriBuilder ->
                    klantContactOptions.objectTypeId?.let {
                        uriBuilder.queryParam(OK_OBJECTTYPE_PARAM, it)
                    }
                    klantContactOptions.objectUuid?.let {
                        uriBuilder.queryParam(OK_OBJECT_ID_PARAM, it)
                    }
                    uriBuilder.path(OK_KLANTCONTACTEN_PATH).build()
                }.retrieve()
                .awaitBody<Page<KlantContact>>()
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error fetching KlantContacts")
        }

    suspend fun postKlantContact(
        @Valid @RequestBody request: CreateKlantContactRequest,
        properties: OpenKlantProperties
    ) {
        try {
            webClient(properties)
                .post()
                .uri(OK_CREATE_KLANTCONTACT_PATH)
                .bodyValue(request)
                .retrieve()
                .awaitBody<CreateKlantContact>()
        } catch (e: WebClientResponseException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: WebClientResponseException) {
            handleResponseException(e, "Error creating Klantcontact")
        }
    }

    private fun webClient(properties: OpenKlantProperties): WebClient =
        openKlantWebClientBuilder
            .clone()
            .baseUrl(properties.klantinteractiesUrl.toASCIIString())
            .defaultHeader("Authorization", "Token ${properties.token}")
            .build()

    private fun handleInternalServerError(e: WebClientResponseException.InternalServerError): Nothing {
        logger.warn { "Response body:  ${e.responseBodyAsString}" }
        logger.error(e) { "Internal Server Error calling OpenKlant" }
        throw ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Internal Server Error calling OpenKlant",
            e,
        )
    }

    private fun handleResponseException(
        e: WebClientResponseException,
        reason: String,
    ): Nothing {
        logger.warn(e) { "Client error calling OpenKlant" }
        logger.warn { "Response body:  ${e.responseBodyAsString}" }
        throw ResponseStatusException(
            e.statusCode,
            reason,
            e,
        )
    }

    companion object {
        private const val OK_PARTIJEN_PATH = "partijen"
        private const val OK_KLANTCONTACTEN_PATH = "klantcontacten"
        private const val OK_DIGITALE_ADRESSEN_PATH = "digitaleadressen"
        private const val OK_CREATE_KLANTCONTACT_PATH = "maak-klantcontact"

        private const val OK_VERSTREKT_DOOR_PARTIJ_ID_PARAM = "verstrektDoorPartij__uuid"
        private const val OK_SOORT_PARTIJ_IDENTIFICATOR_PARAM = "partijIdentificator__codeSoortObjectId"
        private const val OK_PARTIJ_IDENTIFICATOR_PARAM = "partijIdentificator__objectId"
        private const val OK_SOORT_PARTIJ_PARAM = "soortPartij"
        private const val OK_OBJECTTYPE_PARAM = "onderwerpobject__onderwerpobjectidentificatorCodeObjecttype"
        private const val OK_OBJECT_ID_PARAM = "onderwerpobject__onderwerpobjectidentificatorObjectId"

        private val logger = KotlinLogging.logger { }
    }
}