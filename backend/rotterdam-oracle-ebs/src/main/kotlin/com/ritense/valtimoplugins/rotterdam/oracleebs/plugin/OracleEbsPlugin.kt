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
import com.ritense.valueresolver.ValueResolverService
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
import java.math.BigDecimal
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
    private val valueResolverService: ValueResolverService
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
        @PluginActionProperty boekdatumTijd: String,
        @PluginActionProperty categorie: String,
        @PluginActionProperty saldoSoort: SaldoSoort,
        @PluginActionProperty omschrijving: String? = null,
        @PluginActionProperty boekjaar: String? = null,
        @PluginActionProperty boekperiode: String? = null,
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
        val resolvedValues = resolveValuesFor(execution, mapOf(
            "processCode" to procesCode,
            "referentieNummer" to referentieNummer,
            "sleutel" to sleutel,
            "boekdatumTijd" to boekdatumTijd,
            "categorie" to categorie,
            "omschrijving" to omschrijving,
            "boekjaar" to boekjaar,
            "boekperiode" to boekperiode
        ))
        logger.debug { "Resolved values: $resolvedValues" }
        OpvoerenJournaalpostVraag(
            procescode = stringFrom(resolvedValues["procesCode"]!!),
            referentieNummer = stringFrom(resolvedValues["referentieNummer"]!!),
            journaalpost = Journaalpost(
                journaalpostsleutel = stringFrom(resolvedValues["sleutel"]!!),
                journaalpostboekdatumTijd = offsetDateTimeFrom(resolvedValues["boekdatumTijd"]!!),
                journaalpostcategorie = stringFrom(resolvedValues["categorie"]!!),
                journaalpostsaldosoort = Journaalpost.Journaalpostsaldosoort.valueOf(saldoSoort.name),
                valutacode = Journaalpost.Valutacode.EUR,
                journaalpostregels = regels.map { regel ->
                    val resolvedLineValues = resolveValuesFor(execution, mapOf(
                        "grootboeksleutel" to regel.grootboekSleutel,
                        "bedrag" to regel.bedrag,
                        "omschrijving" to regel.omschrijving
                    ))
                    logger.debug { "Resolved line values: $resolvedLineValues" }
                    Journaalpostregel(
                        grootboekrekening = Grootboekrekening(
                            grootboeksleutel = stringFrom(resolvedLineValues["grootboekSleutel"]!!),
                            bronsleutel = null
                        ),
                        journaalpostregelboekingtype = Journaalpostregel.Journaalpostregelboekingtype.valueOf(regel.boekingType.name),
                        journaalpostregelbedrag = doubleFrom(resolvedLineValues["bedrag"]!!),
                        journaalpostregelomschrijving = stringOrNullFrom(resolvedLineValues["omschrijving"]!!),
                        bronspecifiekewaarden = null
                    )
                },
                journaalpostomschrijving = stringOrNullFrom(resolvedValues["omschrijving"]!!),
                grootboek = null,
                boekjaar = integerOrNullFrom(resolvedValues["boekjaar"]!!),
                boekperiode = integerOrNullFrom(resolvedValues["boekperiode"]!!)
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
        @PluginActionProperty regels: List<FactuurRegel>
    ) {
        logger.info {
            "Verkoopfactuur Opvoeren(" +
                "processCode: $procesCode, " +
                "referentieNummer: $referentieNummer" +
            ")"
        }
        val resolvedValues = resolveValuesFor(execution, mapOf(
            "processCode" to procesCode,
            "referentieNummer" to referentieNummer,
            "inkoopOrderReferentie" to inkoopOrderReferentie
        ))
        logger.debug { "Resolved values: $resolvedValues" }
        val resolvedNatuurlijkPersoonValues = resolveValuesFor(execution, mapOf(
            "achternaam" to natuurlijkPersoon.achternaam,
            "voornamen" to natuurlijkPersoon.voornamen
        ))
        logger.debug { "Resolved natuurlijk persoon values: $resolvedNatuurlijkPersoonValues" }
        val resolvedNietNatuurlijkPersoonValues = resolveValuesFor(execution, mapOf(
            "statutaireNaam" to nietNatuurlijkPersoon.statutaireNaam
        ))
        logger.debug { "Resolved niet natuurlijk persoon values: $resolvedNietNatuurlijkPersoonValues" }

        OpvoerenVerkoopfactuurVraag(
            procescode = stringFrom(resolvedValues["procesCode"]!!),
            referentieNummer = stringFrom(resolvedValues["referentieNummer"]!!),
            factuur = Verkoopfactuur(
                factuurtype = Verkoopfactuur.Factuurtype.Verkoopfactuur,
                factuurklasse= Verkoopfactuur.Factuurklasse.valueOf(factuurKlasse.name),
                factuurdatum = LocalDate.now(),
                inkooporderreferentie = stringFrom(resolvedValues["inkoopOrderReferentie"]!!),
                koper = RelatieRotterdam(
                    natuurlijkPersoon = NatuurlijkPersoon(
                        achternaam = stringFrom(resolvedNatuurlijkPersoonValues["achternaam"]!!),
                        voornamen = stringFrom(resolvedNatuurlijkPersoonValues["voornamen"]!!),
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
                        statutaireNaam = stringFrom(resolvedNietNatuurlijkPersoonValues["statutaireNaam"]!!),
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
                    val resolvedLineValues = resolveValuesFor(execution, mapOf(
                        "hoeveelheid" to factuurRegel.hoeveelheid,
                        "tarief" to factuurRegel.tarief,
                        "btwPercentage" to factuurRegel.btwPercentage,
                        "grootboekSleutel" to factuurRegel.grootboekSleutel,
                        "omschrijving" to factuurRegel.omschrijving
                    ))
                    logger.debug { "Resolved line values: $resolvedLineValues" }
                    Factuurregel(
                        factuurregelFacturatieHoeveelheid = valueAsBigDecimal(resolvedLineValues["hoeveelheid"]!!),
                        factuurregelFacturatieTarief = valueAsBigDecimal(resolvedLineValues["tarief"]!!),
                        btwPercentage = stringFrom(resolvedLineValues["btwPercentage"]!!),
                        grootboekrekening = Grootboekrekening(
                            grootboeksleutel = stringFrom(resolvedLineValues["grootboekSleutel"]!!),
                            bronsleutel = null,
                        ),
                        factuurregelomschrijving = stringOrNullFrom(resolvedLineValues["omschrijving"]),
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

    fun resolveValuesFor(
        execution: DelegateExecution,
        params: Map<String, Any?>
    ): Map<String, Any?> {
        val resolvedValues = params.filter {
            if (it.value is String) {
                isResolvableValue(it.value as String)
            } else false
        }
        .let { filteredParams ->
            logger.debug { "Trying to resolve values for: $filteredParams" }
            valueResolverService.resolveValues(
                execution.processInstanceId,
                execution,
                filteredParams.map { it.value as String }
            ).let { resolvedValues ->
                logger.debug { "Resolved values: $resolvedValues" }
                filteredParams.toMutableMap().apply {
                    this.entries.forEach { (key, value) ->
                        this.put(key, resolvedValues[value])
                    }
                }
            }
        }
        return params.toMutableMap().apply {
            this.putAll(resolvedValues)
            return this
        }.toMap()
    }

    private fun isResolvableValue(value: String): Boolean =
        value.isNotBlank() &&
        (
            value.startsWith("case:") ||
            value.startsWith("doc:") ||
            value.startsWith("pv:")
        )

    private fun offsetDateTimeFrom(value: Any): OffsetDateTime =
        when (value) {
            is OffsetDateTime -> value
            is String -> OffsetDateTime.parse(value)
            else -> throw IllegalArgumentException("Unsupported type ${value::class}")
        }

    private fun doubleFrom(value: Any): Double =
        when (value) {
            is Double -> value
            is String -> value.toDouble()
            else -> 0.0
        }

    private fun valueAsBigDecimal(value: Any): BigDecimal =
        when (value) {
            is BigDecimal -> value
            is String -> value.toBigDecimal()
            else -> BigDecimal.ZERO
        }

    private fun integerOrNullFrom(value: Any?): Int? =
        when (value) {
            is Int -> value
            is String -> value.toInt()
            else -> null
        }

    private fun stringFrom(value: Any): String =
        when (value) {
            is String -> value
            else -> ""
        }

    private fun stringOrNullFrom(value: Any?): String? =
        when (value) {
            is String -> value
            else -> null
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
