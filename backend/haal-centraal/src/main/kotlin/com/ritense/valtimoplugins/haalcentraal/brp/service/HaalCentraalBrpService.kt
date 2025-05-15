package com.ritense.valtimoplugins.haalcentraal.brp.service

import com.ritense.valtimoplugins.haalcentraal.brp.client.HcBrpClient
import com.ritense.valtimoplugins.haalcentraal.brp.model.BewoningDto
import com.ritense.valtimoplugins.haalcentraal.brp.model.BewoningenRequest
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import java.net.URI

class HaalCentraalBrpService(
    private val haalCentraalBrpClient: HcBrpClient
) {

    fun getBewoningen(
        baseUrl: URI,
        bewoningenRequest: BewoningenRequest,
        authentication: HaalCentraalAuthentication
    ): List<BewoningDto>? {
        logger.info("Retrieving bewoningen for adresseerbaarObjectIdentificatie: ${bewoningenRequest.adresseerbaarObjectIdentificatie}")

        return haalCentraalBrpClient.getBewoningen(
            baseUrl = baseUrl,
            bewoningenRequest = bewoningenRequest,
            authentication = authentication
        )?.bewoningen?.map { bewoning ->
            BewoningDto(
                adresseerbaarObjectIdentificatie = bewoning.adresseerbaarObjectIdentificatie,
                bewoners = bewoning.bewoners,
                mogelijkeBewoners = bewoning.mogelijkeBewoners,
                indicatieVeelBewoners = bewoning.indicatieVeelBewoners
            )
        }
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
