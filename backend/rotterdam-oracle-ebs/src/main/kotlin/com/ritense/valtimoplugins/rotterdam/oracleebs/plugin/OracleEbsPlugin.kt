package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import camundajar.impl.scala.annotation.switch
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.mtlssslcontext.MTlsSslContext
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.BoekingType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurKlasse
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.JournaalpostRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NietNatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.RelatieType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.SaldoSoort
import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.ritense.valueresolver.ValueResolverService
import com.rotterdam.esb.opvoeren.models.Factuurregel
import com.rotterdam.esb.opvoeren.models.Grootboekrekening
import com.rotterdam.esb.opvoeren.models.Journaalpost
import com.rotterdam.esb.opvoeren.models.Journaalpostregel
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
import java.util.LinkedHashMap
import kotlin.String

@Plugin(
    key = "rotterdam-oracle-ebs",
    title = "Gemeente Rotterdam - Oracle EBS plugin",
    description = "Deze plugin maakt het mogelijk om Journaalpost en Verkoopfactuur acties uit te voeren in Oracle E-Business Suite via de ESB van de Gemeente Rotterdam"
)
class OracleEbsPlugin(
    private val esbClient: EsbClient,
    private val valueResolverService: ValueResolverService,
    private val objectMapper: ObjectMapper
) {

    @PluginProperty(key = "baseUrl", secret = false, required = true)
    internal lateinit var baseUrl: URI

    @PluginProperty(key = "mTlsSslContextConfiguration", secret = false, required = true)
    internal lateinit var mTlsSslContextConfiguration: MTlsSslContext

    @PluginProperty(key = "authenticationEnabled", secret = false, required = true)
    internal var authenticationEnabled: String = "true"

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
        @PluginActionProperty pvResultVariable: String,
        @PluginActionProperty procesCode: String,
        @PluginActionProperty referentieNummer: String,
        @PluginActionProperty sleutel: String,
        @PluginActionProperty boekdatumTijd: String,
        @PluginActionProperty categorie: String,
        @PluginActionProperty saldoSoort: String,
        @PluginActionProperty omschrijving: String? = null,
        @PluginActionProperty boekjaar: String? = null,
        @PluginActionProperty boekperiode: String? = null,
        @PluginActionProperty regels: List<JournaalpostRegel>? = null,
        @PluginActionProperty regelsViaResolver: Any? = null
    ) {
        logger.info {
            "Journaalpost Opvoeren(" +
                "procesCode: $procesCode, " +
                "referentieNummer: $referentieNummer, " +
                "sleutel: $sleutel, " +
                "boekdatumTijd: $boekdatumTijd, " +
                "categorie: $categorie, " +
                "saldoSoort: $saldoSoort" +
            ")"
        }

        // prepare lines
        if (regels.isNullOrEmpty() && regelsViaResolver == null) {
            throw IllegalArgumentException("Regels are not specified!")
        }
        val journaalpostRegels: List<JournaalpostRegel> = if (!regels.isNullOrEmpty()) {
            regels
        } else {
            @Suppress("UNCHECKED_CAST")
            when (regelsViaResolver) {
                is ArrayList<*> -> regelsViaResolver.map {
                    JournaalpostRegel.from(it as LinkedHashMap<String, String>)
                }
                is ArrayNode -> objectMapper.convertValue<List<JournaalpostRegel>>(regelsViaResolver)
                is String -> objectMapper.readValue<List<JournaalpostRegel>>(regelsViaResolver)
                else -> throw IllegalArgumentException("Unsupported type ${regelsViaResolver!!::class.simpleName}")
            }
        }.also {
            logger.debug { "Regels: $it" }
        }

        OpvoerenJournaalpostVraag(
            procescode = procesCode,
            referentieNummer = referentieNummer,
            journaalpost = Journaalpost(
                journaalpostsleutel = sleutel,
                journaalpostboekdatumTijd = offsetDateTimeFrom(boekdatumTijd),
                journaalpostcategorie = categorie,
                journaalpostsaldosoort = saldoSoortFrom(saldoSoort),
                valutacode = Journaalpost.Valutacode.EUR,
                journaalpostregels = journaalpostRegels.map { regel ->
                    val resolvedLineValues = resolveValuesFor(execution, mapOf(
                        GROOTBOEK_SLEUTEL_KEY to regel.grootboekSleutel,
                        BOEKING_TYPE_KEY to regel.boekingType,
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
                        journaalpostregelboekingtype = boekingTypeFrom(resolvedLineValues[BOEKING_TYPE_KEY]!!),
                        journaalpostregelbedrag = doubleFrom(resolvedLineValues[BEDRAG_KEY]!!),
                        journaalpostregelomschrijving = stringOrNullFrom(resolvedLineValues[OMSCHRIJVING_KEY]!!),
                        bronspecifiekewaarden = null
                    )
                },
                journaalpostomschrijving = omschrijving,
                grootboek = null,
                boekjaar = integerOrNullFrom(boekjaar),
                boekperiode = integerOrNullFrom(boekperiode)
            )
        ).let { request ->
            logger.debug { "Trying to send OpvoerenJournaalpostVraag" }
            logger.trace {
                "OpvoerenJournaalpostVraag: ${objectMapperWithNonAbsentInclusion(objectMapper).writeValueAsString(request)}"
            }
            try {
                esbClient.journaalPostenApi(restClient()).opvoerenJournaalpost(request).let { response ->
                    logger.debug { "Journaalpost Opvoeren response: $response" }
                    execution.setVariable(pvResultVariable, mapOf(
                        "isGeslaagd" to response.isGeslaagd,
                        "melding" to response.melding,
                        "foutcode" to response.foutcode,
                        "foutmelding" to response.foutmelding
                    ))
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
        @PluginActionProperty pvResultVariable: String,
        @PluginActionProperty procesCode: String,
        @PluginActionProperty referentieNummer: String,
        @PluginActionProperty factuurKlasse: String,
        @PluginActionProperty factuurDatum: String,
        @PluginActionProperty factuurVervaldatum: String? = null,
        @PluginActionProperty inkoopOrderReferentie: String,
        @PluginActionProperty relatieType: String,
        @PluginActionProperty natuurlijkPersoon: NatuurlijkPersoon? = null,
        @PluginActionProperty nietNatuurlijkPersoon: NietNatuurlijkPersoon? = null,
        @PluginActionProperty regels: List<FactuurRegel>? = null,
        @PluginActionProperty regelsViaResolver: Any? = null
    ) {
        logger.info {
            "Verkoopfactuur Opvoeren(" +
                "procesCode: $procesCode, " +
                "referentieNummer: $referentieNummer, " +
                "factuurKlasse: $factuurKlasse, " +
                "factuurDatum: $factuurDatum, " +
                "inkoopOrderReferentie: $inkoopOrderReferentie, " +
                "relatieType: $relatieType" +
            ")"
        }
        val relatieTypeEnum = RelatieType.valueOf(relatieType.replace(" ", "_").uppercase())
        if (relatieTypeEnum == RelatieType.NATUURLIJK_PERSOON) {
            require(natuurlijkPersoon != null) {
                "When relatieType is NATUURLIJK, natuurlijkPersoon should not be NULL"
            }
        } else {
            require(nietNatuurlijkPersoon != null) {
                "When relatieType is NIET_NATUURLIJK, nietNatuurlijkPersoon should not be NULL"
            }
        }

        // prepare lines
        if (regels.isNullOrEmpty() && regelsViaResolver == null) {
            throw IllegalArgumentException("Regels are not specified!")
        }
        val factuurRegels: List<FactuurRegel> = if (!regels.isNullOrEmpty()) {
            regels
        } else {
            @Suppress("UNCHECKED_CAST")
            when (regelsViaResolver) {
                is ArrayList<*> -> regelsViaResolver.map {
                    FactuurRegel.from(it as LinkedHashMap<String, String>)
                }
                is ArrayNode -> objectMapper.convertValue<List<FactuurRegel>>(regelsViaResolver)
                is String -> objectMapper.readValue<List<FactuurRegel>>(regelsViaResolver)
                else -> throw IllegalArgumentException("Unsupported type ${regelsViaResolver!!::class.simpleName}")
            }
        }.also {
            logger.debug { "Regels: $it" }
        }

        OpvoerenVerkoopfactuurVraag(
            procescode = procesCode,
            referentieNummer = referentieNummer,
            factuur = Verkoopfactuur(
                factuurtype = Verkoopfactuur.Factuurtype.Verkoopfactuur,
                factuurklasse= factuurKlasseFrom(factuurKlasse),
                factuurdatum = localDateFrom(factuurDatum),
                factuurvervaldatum =
                    if (factuurVervaldatum.isNullOrBlank()) { null } else { localDateFrom(factuurVervaldatum) },
                inkooporderreferentie = inkoopOrderReferentie,
                koper = RelatieRotterdam(
                    relatienummerRotterdam = null,
                    natuurlijkPersoon =
                        if (relatieTypeEnum == RelatieType.NATUURLIJK_PERSOON) {
                            val resolvedNatuurlijkPersoonValues = resolveValuesFor(execution, mapOf(
                                ACHTERNAAM_KEY to natuurlijkPersoon!!.achternaam,
                                VOORNAMEN_KEY to natuurlijkPersoon.voornamen
                            )).also {
                                logger.debug { "Resolved natuurlijk persoon values: $it" }
                            }
                            com.rotterdam.esb.opvoeren.models.NatuurlijkPersoon(
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
                            )
                        } else null
                    ,
                    nietNatuurlijkPersoon =
                        if (relatieTypeEnum == RelatieType.NIET_NATUURLIJK_PERSOON) {
                            val resolvedNietNatuurlijkPersoonValues = resolveValuesFor(execution, mapOf(
                                STATUTAIRE_NAAM_KEY to nietNatuurlijkPersoon!!.statutaireNaam
                            )).also {
                                logger.debug { "Resolved niet natuurlijk persoon values: $it" }
                            }
                            com.rotterdam.esb.opvoeren.models.NietNatuurlijkPersoon(
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
                            )
                        } else null
                ),
                factuurregels = factuurRegels.map { factuurRegel ->
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
            logger.debug { "Trying to send OpvoerenVerkoopfactuurVraag" }
            logger.trace {
                "OpvoerenVerkoopfactuurVraag: ${objectMapperWithNonAbsentInclusion(objectMapper).writeValueAsString(request)}"
            }
            try {
                esbClient.verkoopFacturenApi(restClient()).opvoerenVerkoopfactuur(request).let { response ->
                    logger.debug { "Verkoopfactuur Opvoeren response: $response" }

                    execution.setVariable(pvResultVariable, mapOf(
                        "isGeslaagd" to response.isGeslaagd,
                        "melding" to response.melding,
                        "factuurID" to response.factuurID,
                        "foutcode" to response.foutcode,
                        "foutmelding" to response.foutmelding
                    ))
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
            this.toMap()
        }
    }

    private fun saldoSoortFrom(value: Any): Journaalpost.Journaalpostsaldosoort =
        SaldoSoort.valueOf(stringFrom(value).uppercase()).let {
            Journaalpost.Journaalpostsaldosoort.valueOf(it.title)
        }

    private fun boekingTypeFrom(value: Any): Journaalpostregel.Journaalpostregelboekingtype =
        BoekingType.valueOf(stringFrom(value).uppercase()).let {
            Journaalpostregel.Journaalpostregelboekingtype.valueOf(it.title)
        }

    private fun factuurKlasseFrom(value: Any): Verkoopfactuur.Factuurklasse =
        FactuurKlasse.valueOf(stringFrom(value).uppercase()).let {
            Verkoopfactuur.Factuurklasse.valueOf(it.title)
        }

    private fun isResolvableValue(value: String): Boolean =
        value.isNotBlank() &&
        (
            value.startsWith("case:") ||
            value.startsWith("doc:") ||
            value.startsWith("pv:")
        )

    private fun localDateFrom(value: Any): LocalDate =
        when (value) {
            is LocalDate -> value
            is String -> LocalDate.parse(value.trim())
            else -> throw IllegalArgumentException("Unsupported type ${value::class}")
        }

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
            objectMapper = objectMapperWithNonAbsentInclusion(objectMapper),
            baseUrl = baseUrl.toString(),
            authenticationEnabled = authenticationEnabled.toBoolean(),
            mTlsSslContext = mTlsSslContextConfiguration
        )

    private fun objectMapperWithNonAbsentInclusion(objectMapper: ObjectMapper): ObjectMapper =
        objectMapper.copy().setSerializationInclusion(JsonInclude.Include.NON_ABSENT)

    companion object {
        private val logger = KotlinLogging.logger {}

        private const val VALUTACODE_EURO = "EUR"

        private const val OMSCHRIJVING_KEY = "omschrijving"
        private const val GROOTBOEK_SLEUTEL_KEY = "grootboeksleutel"
        private const val BOEKING_TYPE_KEY = "boekingType"
        private const val BEDRAG_KEY = "bedrag"
        private const val ACHTERNAAM_KEY = "achternaam"
        private const val VOORNAMEN_KEY = "voornamen"
        private const val STATUTAIRE_NAAM_KEY = "statutaireNaam"
        private const val HOEVEELHEID_KEY = "hoeveelheid"
        private const val TARIEF_KEY = "tarief"
        private const val BTW_PERCENTAGE_KEY = "btwPercentage"

    }
}
