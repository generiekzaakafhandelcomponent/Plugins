package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.mtlssslcontext.MTlsSslContext
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
    description = "Deze plugin maakt het mogelijk om Journaalpost en Verkoopfactuur acties uit te voeren in Oracle E-Business Suite via de ESB van de Gemeente Rotterdam"
)
class OracleEbsPlugin(
    private val esbClient: EsbClient,
    private val valueResolverService: ValueResolverService
) {

    @PluginProperty(key = "baseUrl", secret = false, required = true)
    internal lateinit var baseUrl: URI

    @PluginProperty(key = "mTlsSslContextConfiguration", secret = false, required = true)
    internal lateinit var mTlsSslContextConfiguration: MTlsSslContext

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
                "procesCode: $procesCode, " +
                "referentieNummer: $referentieNummer, " +
                "sleutel: $sleutel, " +
                "categorie: $categorie" +
            ")"
        }
        val resolvedValues = resolveValuesFor(execution, mapOf(
            PROCES_CODE_KEY to procesCode,
            REFERENTIE_NUMMER_KEY to referentieNummer,
            SLEUTEL_KEY to sleutel,
            BOEKDATUM_TIJD_KEY to boekdatumTijd,
            CATEGORIE_KEY to categorie,
            OMSCHRIJVING_KEY to omschrijving,
            BOEKJAAR_KEY to boekjaar,
            BOEKPERIODE_KEY to boekperiode
        )).also {
            logger.debug { "Resolved values: $it" }
        }
        OpvoerenJournaalpostVraag(
            procescode = stringFrom(resolvedValues[PROCES_CODE_KEY]!!),
            referentieNummer = stringFrom(resolvedValues[REFERENTIE_NUMMER_KEY]!!),
            journaalpost = Journaalpost(
                journaalpostsleutel = stringFrom(resolvedValues[SLEUTEL_KEY]!!),
                journaalpostboekdatumTijd = offsetDateTimeFrom(resolvedValues[BOEKDATUM_TIJD_KEY]!!),
                journaalpostcategorie = stringFrom(resolvedValues[CATEGORIE_KEY]!!),
                journaalpostsaldosoort = Journaalpost.Journaalpostsaldosoort.valueOf(saldoSoort.name),
                valutacode = Journaalpost.Valutacode.EUR,
                journaalpostregels = regels.map { regel ->
                    val resolvedLineValues = resolveValuesFor(execution, mapOf(
                        GROOTBOEK_SLEUTEL_KEY to regel.grootboekSleutel,
                        BEDRAG_KEY to regel.bedrag,
                        OMSCHRIJVING_KEY to regel.omschrijving
                    )).also {
                        logger.debug { "Resolved line values: $it" }
                    }
                    Journaalpostregel(
                        grootboekrekening = Grootboekrekening(
                            grootboeksleutel = stringFrom(resolvedLineValues[GROOTBOEK_SLEUTEL_KEY]!!),
                            bronsleutel = null
                        ),
                        journaalpostregelboekingtype = Journaalpostregel.Journaalpostregelboekingtype.valueOf(regel.boekingType.name),
                        journaalpostregelbedrag = doubleFrom(resolvedLineValues[BEDRAG_KEY]!!),
                        journaalpostregelomschrijving = stringOrNullFrom(resolvedLineValues[OMSCHRIJVING_KEY]!!),
                        bronspecifiekewaarden = null
                    )
                },
                journaalpostomschrijving = stringOrNullFrom(resolvedValues[OMSCHRIJVING_KEY]!!),
                grootboek = null,
                boekjaar = integerOrNullFrom(resolvedValues[BOEKJAAR_KEY]!!),
                boekperiode = integerOrNullFrom(resolvedValues[BOEKPERIODE_KEY]!!)
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
                "procesCode: $procesCode, " +
                "referentieNummer: $referentieNummer" +
            ")"
        }
        val resolvedValues = resolveValuesFor(execution, mapOf(
            PROCES_CODE_KEY to procesCode,
            REFERENTIE_NUMMER_KEY to referentieNummer,
            INKOOP_ORDER_REFERENTIE_KEY to inkoopOrderReferentie
        )).also {
            logger.debug { "Resolved values: $it" }
        }
        val resolvedNatuurlijkPersoonValues = resolveValuesFor(execution, mapOf(
            ACHTERNAAM_KEY to natuurlijkPersoon.achternaam,
            VOORNAMEN_KEY to natuurlijkPersoon.voornamen
        )).also {
            logger.debug { "Resolved natuurlijk persoon values: $it" }
        }
        val resolvedNietNatuurlijkPersoonValues = resolveValuesFor(execution, mapOf(
            STATUTAIRE_NAAM_KEY to nietNatuurlijkPersoon.statutaireNaam
        )).also {
            logger.debug { "Resolved niet natuurlijk persoon values: $it" }
        }
        OpvoerenVerkoopfactuurVraag(
            procescode = stringFrom(resolvedValues[PROCES_CODE_KEY]!!),
            referentieNummer = stringFrom(resolvedValues[REFERENTIE_NUMMER_KEY]!!),
            factuur = Verkoopfactuur(
                factuurtype = Verkoopfactuur.Factuurtype.Verkoopfactuur,
                factuurklasse= Verkoopfactuur.Factuurklasse.valueOf(factuurKlasse.name),
                factuurdatum = LocalDate.now(),
                inkooporderreferentie = stringFrom(resolvedValues[INKOOP_ORDER_REFERENTIE_KEY]!!),
                koper = RelatieRotterdam(
                    natuurlijkPersoon = NatuurlijkPersoon(
                        achternaam = stringFrom(resolvedNatuurlijkPersoonValues[ACHTERNAAM_KEY]!!),
                        voornamen = stringFrom(resolvedNatuurlijkPersoonValues[VOORNAMEN_KEY]!!),
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
                        statutaireNaam = stringFrom(resolvedNietNatuurlijkPersoonValues[STATUTAIRE_NAAM_KEY]!!),
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
                        HOEVEELHEID_KEY to factuurRegel.hoeveelheid,
                        TARIEF_KEY to factuurRegel.tarief,
                        BTW_PERCENTAGE_KEY to factuurRegel.btwPercentage,
                        GROOTBOEK_SLEUTEL_KEY to factuurRegel.grootboekSleutel,
                        OMSCHRIJVING_KEY to factuurRegel.omschrijving
                    )).also {
                        logger.debug { "Resolved line values: $it" }
                    }
                    Factuurregel(
                        factuurregelFacturatieHoeveelheid = valueAsBigDecimal(resolvedLineValues[HOEVEELHEID_KEY]!!),
                        factuurregelFacturatieTarief = valueAsBigDecimal(resolvedLineValues[TARIEF_KEY]!!),
                        btwPercentage = stringFrom(resolvedLineValues[BTW_PERCENTAGE_KEY]!!),
                        grootboekrekening = Grootboekrekening(
                            grootboeksleutel = stringFrom(resolvedLineValues[GROOTBOEK_SLEUTEL_KEY]!!),
                            bronsleutel = null,
                        ),
                        factuurregelomschrijving = stringOrNullFrom(resolvedLineValues[OMSCHRIJVING_KEY]),
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
                valutacode = VALUTACODE_EURO, // Alleen EUR wordt ondersteund
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
            is String -> OffsetDateTime.parse(value.trim())
            else -> throw IllegalArgumentException("Unsupported type ${value::class}")
        }

    private fun doubleFrom(value: Any): Double =
        when (value) {
            is Double -> value
            is String -> replaceCommaWithDotAsDecimalSeparator(value.trim()).toDouble()
            else -> 0.0
        }

    private fun valueAsBigDecimal(value: Any): BigDecimal =
        when (value) {
            is BigDecimal -> value
            is String -> replaceCommaWithDotAsDecimalSeparator(value.trim()).toBigDecimal()
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
            is String -> value.trim()
            else -> ""
        }

    private fun stringOrNullFrom(value: Any?): String? =
        when (value) {
            is String -> value.trim()
            else -> null
        }

    private fun replaceCommaWithDotAsDecimalSeparator(value: String): String =
        when {
            value.contains(",") && value.contains(".") -> {
                // Based on the index, determine the decimal separator
                if (value.indexOf(",") > value.indexOf(".")) {
                    // Assume comma is the separator ("1.234,56")
                    value.replace(".", "").replace(",", ".")
                } else {
                    // Assume dot is the separator ("1,234.56")
                    value.replace(",", "")
                }
            }
            value.contains(",") -> {
                // Assume comma is separator ("1234,56")
                value.replace(",", ".")
            }
            else -> value // Assume dot is separator or no decimal ("1234.56", "1234")
        }

    private fun restClient(): RestClient =
        esbClient.createRestClient(
            baseUrl = baseUrl.toString(),
            authenticationEnabled = true,
            mTlsSslContext = mTlsSslContextConfiguration
        )

    companion object {
        private val logger = KotlinLogging.logger {}

        private const val VALUTACODE_EURO = "EUR"

        private const val PROCES_CODE_KEY = "procesCode"
        private const val REFERENTIE_NUMMER_KEY = "referentieNummer"
        private const val SLEUTEL_KEY = "sleutel"
        private const val BOEKDATUM_TIJD_KEY = "boekdatumTijd"
        private const val CATEGORIE_KEY = "categorie"
        private const val OMSCHRIJVING_KEY = "omschrijving"
        private const val BOEKJAAR_KEY = "boekjaar"
        private const val BOEKPERIODE_KEY = "boekperiode"
        private const val GROOTBOEK_SLEUTEL_KEY = "grootboeksleutel"
        private const val BEDRAG_KEY = "bedrag"
        private const val INKOOP_ORDER_REFERENTIE_KEY = "inkoopOrderReferentie"
        private const val ACHTERNAAM_KEY = "achternaam"
        private const val VOORNAMEN_KEY = "voornamen"
        private const val STATUTAIRE_NAAM_KEY = "statutaireNaam"
        private const val HOEVEELHEID_KEY = "hoeveelheid"
        private const val TARIEF_KEY = "tarief"
        private const val BTW_PERCENTAGE_KEY = "btwPercentage"
    }
}
