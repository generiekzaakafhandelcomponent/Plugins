package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurKlasse
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.JournaalpostRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.SaldoSoort
import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.rotterdam.esb.opvoeren.models.Factuurregel
import com.rotterdam.esb.opvoeren.models.Grootboekrekening
import com.rotterdam.esb.opvoeren.models.Journaalpost
import com.rotterdam.esb.opvoeren.models.Journaalpostregel
import com.rotterdam.esb.opvoeren.models.NatuurlijkPersoon
import com.rotterdam.esb.opvoeren.models.NietNatuurlijkPersoon
import com.rotterdam.esb.opvoeren.models.OpvoerenJournaalpostVraag
import com.rotterdam.esb.opvoeren.models.OpvoerenVerkoopfactuurVraag
import com.rotterdam.esb.opvoeren.models.RelatieRotterdam
import com.rotterdam.esb.opvoeren.models.Verkoopfactuur
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientResponseException
import java.net.URI
import java.time.LocalDate
import java.time.OffsetDateTime

@Plugin(
    key = "rotterdam-oracle-ebs",
    title = "Gemeente Rotterdam - Oracle EBS plugin",
    description = "Deze plugin maakt het mogelijk om Journaalpost acties uit te voeren in Oracle E-Business Suite via de ESB van de Gemeente Rotterdam"
)
class OracleEbsPlugin(
    private val esbClient: EsbClient,
) {

    @PluginProperty(key = "baseUrl", secret = false, required = true)
    lateinit var baseUrl: URI

    @PluginProperty(key = "authenticationEnabled", secret = false, required = true)
    var authenticationEnabled: String = "false"

    @PluginProperty(key = "base64ServerCertificate", secret = true, required = false)
    var base64ServerCertificate: String? = null

    @PluginProperty(key = "base64ClientPrivateKey", secret = true, required = false)
    var base64ClientPrivateKey: String? = null

    @PluginProperty(key = "base64ClientCertificate", secret = true, required = false)
    var base64ClientCertificate: String? = null

    @PluginAction(
        key = "journaalpost-opvoeren",
        title = "Journaalpost Opvoeren",
        description = "Het opvoeren van een Journaalpost in Oracle EBS",
        activityTypes = [
            ActivityTypeWithEventName.SERVICE_TASK_START
        ]
    )
    fun journaalpostOpvoeren(
        execution: DelegateExecution,
        @PluginActionProperty procesCode: String,
        @PluginActionProperty referentieNummer: String,
        @PluginActionProperty sleutel: String,
        @PluginActionProperty boekdatumTijd: OffsetDateTime,
        @PluginActionProperty categorie: String,
        @PluginActionProperty saldoSoort: SaldoSoort,
        @PluginActionProperty omschrijving: String? = null,
        @PluginActionProperty boekjaar: Int? = null,
        @PluginActionProperty boekperiode: Int? = null,
        @PluginActionProperty regels: List<JournaalpostRegel>
    ) {
        logger.info {
            "Journaalpost Opvoeren(" +
                "processCode: $procesCode, " +
                "referentieNummer: $referentieNummer, " +
                "sleutel: $sleutel, " +
                "categorie: $categorie" +
            ")"
        }
        OpvoerenJournaalpostVraag(
            procescode = procesCode,
            referentieNummer = referentieNummer,
            journaalpost = Journaalpost(
                journaalpostsleutel = sleutel,
                journaalpostboekdatumTijd = boekdatumTijd,
                journaalpostcategorie = categorie,
                journaalpostsaldosoort = Journaalpost.Journaalpostsaldosoort.valueOf(saldoSoort.name),
                valutacode = Journaalpost.Valutacode.EUR,
                journaalpostregels = regels.map { regel ->
                    Journaalpostregel(
                        grootboekrekening = Grootboekrekening(
                            grootboeksleutel = regel.grootboekSleutel,
                            bronsleutel = null
                        ),
                        journaalpostregelboekingtype = Journaalpostregel.Journaalpostregelboekingtype.valueOf(regel.boekingType.name),
                        journaalpostregelbedrag = regel.bedrag,
                        journaalpostregelomschrijving = regel.omschrijving,
                        bronspecifiekewaarden = null
                    )
                },
                journaalpostomschrijving = omschrijving,
                grootboek = null,
                boekjaar = boekjaar,
                boekperiode = boekperiode
            )
        ).let { request ->
            try {
                esbClient.journaalPostenApi(restClient()).opvoerenJournaalpost(request).let { response ->
                    logger.debug { "Journaalpost Opvoeren response: $response" }
                    if (!response.isGeslaagd) {
                        throw RuntimeException("Journaalpost Opvoeren response: $response")
                    }
                }
            } catch (ex: RestClientResponseException) {
                logger.error(ex) { "Something went wrong. ${ex.message}" }
                throw ex
            }
        }
    }

    @PluginAction(
        key = "verkoopfactuur-opvoeren",
        title = "Verkoopfactuur Opvoeren",
        description = "Het opvoeren van een Journaalpost in Oracle EBS",
        activityTypes = [
            ActivityTypeWithEventName.SERVICE_TASK_START
        ]
    )
    fun verkoopfactuurOpvoeren(
        execution: DelegateExecution,
        @PluginActionProperty procesCode: String,
        @PluginActionProperty referentieNummer: String,
        @PluginActionProperty factuurKlasse: FactuurKlasse,
        @PluginActionProperty inkoopOrderReferentie: String,
        @PluginActionProperty natuurlijkPersoon: com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NatuurlijkPersoon,
        @PluginActionProperty nietNatuurlijkPersoon: com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NietNatuurlijkPersoon,
        @PluginActionProperty regels: List<FactuurRegel>,
    ) {
        logger.info {
            "Verkoopfactuur Opvoeren(" +
                "processCode: $procesCode, " +
                "referentieNummer: $referentieNummer" +
            ")"
        }
        OpvoerenVerkoopfactuurVraag(
            procescode = procesCode,
            referentieNummer = referentieNummer,
            factuur = Verkoopfactuur(
                factuurtype = Verkoopfactuur.Factuurtype.Verkoopfactuur,
                factuurklasse= Verkoopfactuur.Factuurklasse.valueOf(factuurKlasse.name),
                factuurdatum = LocalDate.now(),
                inkooporderreferentie = inkoopOrderReferentie,
                koper = RelatieRotterdam(
                    natuurlijkPersoon = NatuurlijkPersoon(
                        achternaam = natuurlijkPersoon.achternaam,
                        voornamen = natuurlijkPersoon.voornamen,
                        bsn = null,
                        relatienaam = null,
                        tussenvoegsel = null,
                        titel = null,
                        telefoonnummer = null,
                        mobielnummer = null,
                        email = null,
                        vestigingsadres = null
                    ),
                    nietNatuurlijkPersoon = NietNatuurlijkPersoon(
                        statutaireNaam = nietNatuurlijkPersoon.statutaireNaam,
                        kvknummer = null,
                        kvkvestigingsnummer = null,
                        rsin = null,
                        ion = null,
                        rechtsvorm = null,
                        datumAanvang = null,
                        datumEinde = null,
                        telefoonnummer = null,
                        email = null,
                        website = null,
                        tijdstipRegistratie = null,
                        btwnummer = null,
                        vestigingsadres = null
                    ),
                    relatienummerRotterdam = null
                ),
                factuurregels = regels.map { factuurRegel ->
                    Factuurregel(
                        factuurregelFacturatieHoeveelheid = factuurRegel.hoeveelheid,
                        factuurregelFacturatieTarief = factuurRegel.tarief,
                        btwPercentage = factuurRegel.btwPercentage,
                        grootboekrekening = Grootboekrekening(
                            grootboeksleutel = factuurRegel.grootboekSleutel,
                            bronsleutel = null,
                        ),
                        factuurregelomschrijving = factuurRegel.omschrijving,
                        factuurregelFacturatieEenheid = null,
                        boekingsregel = null,
                        boekingsregelStartdatum = null,
                        ontvangstenGrootboekrekening = null,
                        factuurregelToeslagKortingen = null,
                        bronspecifiekewaarden = null,
                        artikel = null,
                        regelnummer = null
                    )
                },
                transactiesoort = null,
                factuurnummer = null,
                factuurvervaldatum = null,
                factureerregel = null,
                factuurkenmerk = null,
                factuurtoelichting = null,
                gerelateerdFactuurnummer = null,
                factuuradres = null,
                // Alleen EUR wordt ondersteund
                valutacode = "EUR",
                grootboekdatum = null,
                grootboekjaar = null,
                bronspecifiekewaarden = null
            ),
            bijlage = null
        ).let { request ->
            try {
                esbClient.verkoopFacturenApi(restClient()).opvoerenVerkoopfactuur(request).let { response ->
                    logger.debug { "Verkoopfactuur Opvoeren response: $response" }
                    if (!response.isGeslaagd) {
                        throw RuntimeException("Verkoopfactuur Opvoeren response: $response")
                    }
                }
            } catch (ex: RestClientResponseException) {
                logger.error(ex) { "Something went wrong. ${ex.message}" }
                throw ex
            }
        }
    }

    private fun restClient(): RestClient =
        esbClient.createRestClient(
            baseUrl = baseUrl.toString(),
            authenticationEnabled = authenticationEnabled.toBoolean(),
            base64PrivateKey = base64ClientPrivateKey,
            base64ClientCert = base64ClientCertificate,
            base64ServerCert = base64ServerCertificate
        )

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
