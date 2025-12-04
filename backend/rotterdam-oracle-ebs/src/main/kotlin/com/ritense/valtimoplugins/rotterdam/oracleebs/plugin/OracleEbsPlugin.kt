package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import com.fasterxml.jackson.annotation.JsonInclude
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
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.AdresLocatie
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.AdresPostbus
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.AdresType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.BoekingType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurKlasse
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.JournaalpostRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NietNatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.RelatieType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.SaldoSoort
import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.ritense.valtimoplugins.rotterdam.oracleebs.util.ValueConverter
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
import org.operaton.bpm.engine.delegate.DelegateExecution
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientResponseException
import java.net.URI
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
        @PluginActionProperty grootboek: String? = null,
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
                "omschrijving: $omschrijving" +
                "grootboek: $grootboek" +
                "boekjaar: $boekjaar" +
                "boekperiode: $boekperiode" +
            ")"
        }

        // prepare lines
        val journaalpostRegels = prepareJournaalpostRegels(regels, regelsViaResolver)

        OpvoerenJournaalpostVraag(
            procescode = procesCode,
            referentieNummer = referentieNummer,
            journaalpost = Journaalpost(
                journaalpostsleutel = sleutel,
                journaalpostboekdatumTijd = ValueConverter.offsetDateTimeFrom(boekdatumTijd),
                journaalpostcategorie = categorie,
                journaalpostsaldosoort = saldoSoortFrom(saldoSoort),
                valutacode = Journaalpost.Valutacode.EUR,
                journaalpostregels = journaalpostRegelsFrom(
                    execution = execution,
                    journaalpostRegels = journaalpostRegels
                ),
                journaalpostomschrijving = omschrijving,
                grootboek = if (grootboek.isNullOrBlank()) { null } else { grootboekFrom(grootboek) },
                boekjaar = ValueConverter.integerOrNullFrom(boekjaar),
                boekperiode = ValueConverter.integerOrNullFrom(boekperiode)
            )
        ).let { request ->
            logger.info { "Trying to send OpvoerenJournaalpostVraag" }
            logger.debug {
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

    private fun prepareJournaalpostRegels(
        regels: List<JournaalpostRegel>? = null,
        regelsViaResolver: Any? = null
    ): List<JournaalpostRegel> {
        if (regels.isNullOrEmpty() && regelsViaResolver == null) {
            throw IllegalArgumentException("Regels are not specified!")
        }
        return if (!regels.isNullOrEmpty()) {
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
            logger.info { "Regels: $it" }
        }
    }

    private fun journaalpostRegelsFrom(
        execution: DelegateExecution,
        journaalpostRegels: List<JournaalpostRegel>
    ) =
        journaalpostRegels.map { regel ->
            val resolvedLineValues = resolveValuesFor(execution, mapOf(
                GROOTBOEK_SLEUTEL_KEY to regel.grootboekSleutel,
                BRON_SLEUTEL_KEY to regel.bronSleutel,
                BOEKING_TYPE_KEY to regel.boekingType,
                BEDRAG_KEY to regel.bedrag,
                OMSCHRIJVING_KEY to regel.omschrijving
            )).also {
                logger.debug { "Resolved line values: $it" }
            }
            Journaalpostregel(
                grootboekrekening = grootboekRekening(resolvedLineValues),
                journaalpostregelboekingtype = boekingTypeFrom(resolvedLineValues[BOEKING_TYPE_KEY]!!),
                journaalpostregelbedrag = ValueConverter.doubleFrom(resolvedLineValues[BEDRAG_KEY]!!),
                journaalpostregelomschrijving = ValueConverter.stringOrNullFrom(resolvedLineValues[OMSCHRIJVING_KEY]!!),
                bronspecifiekewaarden = null
            )
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
        @PluginActionProperty factuurKenmerk: String? = null,
        @PluginActionProperty factuurAdresType: String,
        @PluginActionProperty factuurAdresLocatie: AdresLocatie? = null,
        @PluginActionProperty factuurAdresPostbus: AdresPostbus? = null,
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
                "factuurVervaldatum: $factuurVervaldatum, " +
                "factuurKenmerk: $factuurKenmerk, " +
                "factuurAdresType: $factuurAdresType, " +
                "inkoopOrderReferentie: $inkoopOrderReferentie, " +
                "relatieType: $relatieType" +
            ")"
        }

        val factuurAdresTypeEnum = AdresType.valueOf(factuurAdresType.replace(" ", "_").uppercase())
        requireAdres(
            adresType = factuurAdresTypeEnum,
            adresLocatie = factuurAdresLocatie,
            adresPostbus = factuurAdresPostbus
        )

        val relatieTypeEnum = RelatieType.valueOf(relatieType.replace(" ", "_").uppercase())
        requireRelatie(
            relatieType = relatieTypeEnum,
            natuurlijkPersoon = natuurlijkPersoon,
            nietNatuurlijkPersoon = nietNatuurlijkPersoon
        )

        // prepare lines
        val factuurRegels: List<FactuurRegel> = prepareFactuurRegels(regels, regelsViaResolver)

        OpvoerenVerkoopfactuurVraag(
            procescode = procesCode,
            referentieNummer = referentieNummer,
            factuur = Verkoopfactuur(
                factuurtype = Verkoopfactuur.Factuurtype.Verkoopfactuur,
                factuurklasse= factuurKlasseFrom(factuurKlasse),
                factuurdatum = ValueConverter.localDateFrom(factuurDatum),
                factuurvervaldatum =
                    if (factuurVervaldatum.isNullOrBlank()) { null } else { ValueConverter.localDateFrom(factuurVervaldatum) },
                inkooporderreferentie = inkoopOrderReferentie,
                koper = relatieRotterdamFrom(
                    execution = execution,
                    relatieType = relatieTypeEnum,
                    natuurlijkPersoon = natuurlijkPersoon,
                    nietNatuurlijkPersoon = nietNatuurlijkPersoon
                ),
                factuuradres = factuurAdresFrom(
                    execution = execution,
                    adresType = factuurAdresTypeEnum,
                    adresLocatie = factuurAdresLocatie,
                    adresPostbus = factuurAdresPostbus
                ),
                factuurregels = factuurRegelsFrom(
                    execution = execution,
                    factuurRegels = factuurRegels
                ),
                transactiesoort = null,
                factuurnummer = null,
                factureerregel = null,
                factuurkenmerk = factuurKenmerk,
                factuurtoelichting = null,
                gerelateerdFactuurnummer = null,
                valutacode = VALUTACODE_EURO, // Alleen EUR wordt ondersteund
                grootboekdatum = null,
                grootboekjaar = null,
                bronspecifiekewaarden = null
            ),
            bijlage = null
        ).let { request ->
            logger.info { "Trying to send OpvoerenVerkoopfactuurVraag" }
            logger.debug {
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

    private fun requireAdres(
        adresType: AdresType,
        adresLocatie: AdresLocatie? = null,
        adresPostbus: AdresPostbus? = null
    ) {
        if (adresType == AdresType.LOCATIE) {
            require(adresLocatie != null) {
                "When AdresType is LOCATIE, AdresLocatie should not be NULL"
            }
        } else {
            require(adresPostbus != null) {
                "When AdresType is POSTBUS, AdresPostbus should not be NULL"
            }
        }
    }

    private fun factuurAdresFrom(
        execution: DelegateExecution,
        adresType: AdresType,
        adresLocatie: AdresLocatie? = null,
        adresPostbus: AdresPostbus? = null
    ) =
        com.rotterdam.esb.opvoeren.models.Adres(
            locatieadres = if (adresType == AdresType.LOCATIE) {
                requireNotNull(adresLocatie)
                val resolvedValues = resolveValuesFor(execution, mapOf(
                    NAAM_CONTACTPERSOON_KEY to adresLocatie.naamContactpersoon,
                    VESTIGINGNUMMER_ROTTERDAM_KEY to adresLocatie.vestigingsnummerRotterdam,
                    STRAATNAAM_KEY to adresLocatie.straatnaam,
                    HUISNUMMER_KEY to adresLocatie.huisnummer,
                    HUISNUMMER_TOEVOEGING_KEY to adresLocatie.huisnummertoevoeging,
                    PLAATSNAAM_KEY to adresLocatie.plaatsnaam,
                    POSTCODE_KEY to adresLocatie.postcode,
                    LANDCODE_KEY to adresLocatie.landcode
                )).also {
                    logger.debug { "Resolved locatie adres values: $it" }
                }
                com.rotterdam.esb.opvoeren.models.LocatieAdres(
                    naamContactpersoon = ValueConverter.stringOrNullFrom(resolvedValues[NAAM_CONTACTPERSOON_KEY]),
                    vestigingsnummerRotterdam = ValueConverter.stringOrNullFrom(resolvedValues[VESTIGINGNUMMER_ROTTERDAM_KEY]),
                    straatnaam = ValueConverter.stringFrom(resolvedValues[STRAATNAAM_KEY]!!),
                    huisnummer = ValueConverter.bigDecimalFrom(resolvedValues[HUISNUMMER_KEY]!!),
                    huisnummertoevoeging = ValueConverter.stringOrNullFrom(resolvedValues[HUISNUMMER_TOEVOEGING_KEY]),
                    plaatsnaam = ValueConverter.stringFrom(resolvedValues[PLAATSNAAM_KEY]!!),
                    postcode = ValueConverter.stringFrom(resolvedValues[POSTCODE_KEY]!!),
                    landcode = ValueConverter.stringFrom(resolvedValues[LANDCODE_KEY]!!),
                )
            } else null,
            postbusadres = if (adresType == AdresType.POSTBUS) {
                requireNotNull(adresPostbus)
                val resolvedValues = resolveValuesFor(execution, mapOf(
                    NAAM_CONTACTPERSOON_KEY to adresPostbus.naamContactpersoon,
                    VESTIGINGNUMMER_ROTTERDAM_KEY to adresPostbus.vestigingsnummerRotterdam,
                    POSTBUS_KEY to adresPostbus.postbus,
                    PLAATSNAAM_KEY to adresPostbus.plaatsnaam,
                    POSTCODE_KEY to adresPostbus.postcode,
                    LANDCODE_KEY to adresPostbus.landcode
                )).also {
                    logger.debug { "Resolved postbus adres values: $it" }
                }
                com.rotterdam.esb.opvoeren.models.PostbusAdres(
                    naamContactpersoon = ValueConverter.stringOrNullFrom(resolvedValues[NAAM_CONTACTPERSOON_KEY]),
                    vestigingsnummerRotterdam = ValueConverter.stringOrNullFrom(resolvedValues[VESTIGINGNUMMER_ROTTERDAM_KEY]),
                    postbus = ValueConverter.bigDecimalFrom(resolvedValues[POSTBUS_KEY]!!),
                    plaatsnaam = ValueConverter.stringFrom(resolvedValues[PLAATSNAAM_KEY]!!),
                    postcode = ValueConverter.stringFrom(resolvedValues[POSTCODE_KEY]!!),
                    landcode = ValueConverter.stringFrom(resolvedValues[LANDCODE_KEY]!!)
                )
            } else null
        )

    private fun requireRelatie(
        relatieType: RelatieType,
        natuurlijkPersoon: NatuurlijkPersoon? = null,
        nietNatuurlijkPersoon: NietNatuurlijkPersoon? = null
    ) {
        if (relatieType == RelatieType.NATUURLIJK_PERSOON) {
            require(natuurlijkPersoon != null) {
                "When RelatieType is NATUURLIJK, NatuurlijkPersoon should not be NULL"
            }
        } else {
            require(nietNatuurlijkPersoon != null) {
                "When RelatieType is NIET_NATUURLIJK, NietNatuurlijkPersoon should not be NULL"
            }
        }
    }

    private fun relatieRotterdamFrom(
        execution: DelegateExecution,
        relatieType: RelatieType,
        natuurlijkPersoon: NatuurlijkPersoon? = null,
        nietNatuurlijkPersoon: NietNatuurlijkPersoon? = null
    ) =
        RelatieRotterdam(
            relatienummerRotterdam = null,
            natuurlijkPersoon =
                if (relatieType == RelatieType.NATUURLIJK_PERSOON) {
                    val resolvedValues = resolveValuesFor(execution, mapOf(
                        BSN_KEY to natuurlijkPersoon!!.bsn,
                        ACHTERNAAM_KEY to natuurlijkPersoon.achternaam,
                        VOORNAMEN_KEY to natuurlijkPersoon.voornamen
                    )).also {
                        logger.debug { "Resolved natuurlijk persoon values: $it" }
                    }
                    com.rotterdam.esb.opvoeren.models.NatuurlijkPersoon(
                        bsn = ValueConverter.stringFrom(resolvedValues[BSN_KEY]!!),
                        achternaam = ValueConverter.stringFrom(resolvedValues[ACHTERNAAM_KEY]!!),
                        voornamen = ValueConverter.stringFrom(resolvedValues[VOORNAMEN_KEY]!!),
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
                if (relatieType == RelatieType.NIET_NATUURLIJK_PERSOON) {
                    val resolvedValues = resolveValuesFor(execution, mapOf(
                        KVK_NUMMER_KEY to nietNatuurlijkPersoon!!.kvkNummer,
                        KVK_VESTIGINGNUMMER_KEY to nietNatuurlijkPersoon.kvkVestigingsnummer,
                        STATUTAIRE_NAAM_KEY to nietNatuurlijkPersoon.statutaireNaam
                    )).also {
                        logger.debug { "Resolved niet natuurlijk persoon values: $it" }
                    }
                    com.rotterdam.esb.opvoeren.models.NietNatuurlijkPersoon(
                        kvknummer = ValueConverter.stringFrom(resolvedValues[KVK_NUMMER_KEY]!!),
                        kvkvestigingsnummer = ValueConverter.stringFrom(resolvedValues[KVK_VESTIGINGNUMMER_KEY]!!),
                        statutaireNaam = ValueConverter.stringFrom(resolvedValues[STATUTAIRE_NAAM_KEY]!!),
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
        )

    private fun prepareFactuurRegels(
        regels: List<FactuurRegel>? = null,
        regelsViaResolver: Any? = null
    ): List<FactuurRegel> {
        if (regels.isNullOrEmpty() && regelsViaResolver == null) {
            throw IllegalArgumentException("Regels are not specified!")
        }
        return if (!regels.isNullOrEmpty()) {
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
            logger.info { "Regels: $it" }
        }
    }

    private fun factuurRegelsFrom(
        execution: DelegateExecution,
        factuurRegels: List<FactuurRegel>
    ) = factuurRegels.map { factuurRegel ->
            val resolvedValues = resolveValuesFor(execution, mapOf(
                HOEVEELHEID_KEY to factuurRegel.hoeveelheid,
                TARIEF_KEY to factuurRegel.tarief,
                BTW_PERCENTAGE_KEY to factuurRegel.btwPercentage,
                GROOTBOEK_SLEUTEL_KEY to factuurRegel.grootboekSleutel,
                BRON_SLEUTEL_KEY to factuurRegel.bronSleutel,
                OMSCHRIJVING_KEY to factuurRegel.omschrijving
            )).also {
                logger.debug { "Resolved line values: $it" }
            }
            Factuurregel(
                factuurregelFacturatieHoeveelheid = ValueConverter.bigDecimalFrom(resolvedValues[HOEVEELHEID_KEY]!!),
                factuurregelFacturatieTarief = ValueConverter.bigDecimalFrom(resolvedValues[TARIEF_KEY]!!),
                btwPercentage = ValueConverter.stringFrom(resolvedValues[BTW_PERCENTAGE_KEY]!!),
                grootboekrekening = grootboekRekening(resolvedValues),
                factuurregelomschrijving = ValueConverter.stringOrNullFrom(resolvedValues[OMSCHRIJVING_KEY]),
                factuurregelFacturatieEenheid = null,
                boekingsregel = null,
                boekingsregelStartdatum = null,
                ontvangstenGrootboekrekening = null,
                factuurregelToeslagKortingen = null,
                bronspecifiekewaarden = null,
                artikel = null,
                regelnummer = null
            )
        }

    private fun grootboekRekening(resolvedLineValues: Map<String, Any?>) =
        Grootboekrekening(
            grootboeksleutel = resolvedLineValues[GROOTBOEK_SLEUTEL_KEY]?.let{ grootboekSleutel ->
                ValueConverter.stringFrom(grootboekSleutel).takeIf { it.isNotBlank() }
            },
            bronsleutel = resolvedLineValues[BRON_SLEUTEL_KEY]?.let{ bronSleutel ->
                ValueConverter.stringFrom(bronSleutel).takeIf { it.isNotBlank() }
            }
        )

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
        SaldoSoort.valueOf(ValueConverter.stringFrom(value).uppercase()).let {
            Journaalpost.Journaalpostsaldosoort.valueOf(it.title)
        }

    private fun grootboekFrom(value: Any): Journaalpost.Grootboek =
        ValueConverter.stringFrom(value).let { grootboek ->
            Journaalpost.Grootboek.entries.first { it.value == grootboek.uppercase() }
        }

    private fun boekingTypeFrom(value: Any): Journaalpostregel.Journaalpostregelboekingtype =
        BoekingType.valueOf(ValueConverter.stringFrom(value).uppercase()).let {
            Journaalpostregel.Journaalpostregelboekingtype.valueOf(it.title)
        }

    private fun factuurKlasseFrom(value: Any): Verkoopfactuur.Factuurklasse =
        FactuurKlasse.valueOf(ValueConverter.stringFrom(value).uppercase()).let {
            Verkoopfactuur.Factuurklasse.valueOf(it.title)
        }

    private fun isResolvableValue(value: String): Boolean =
        value.isNotBlank() &&
        (
            value.startsWith("case:") ||
            value.startsWith("doc:") ||
            value.startsWith("pv:")
        )

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
        private const val BRON_SLEUTEL_KEY = "bronSleutel"
        private const val BOEKING_TYPE_KEY = "boekingType"
        private const val BEDRAG_KEY = "bedrag"
        private const val BSN_KEY = "bsn"
        private const val ACHTERNAAM_KEY = "achternaam"
        private const val VOORNAMEN_KEY = "voornamen"
        private const val KVK_NUMMER_KEY = "kvkNummer"
        private const val KVK_VESTIGINGNUMMER_KEY = "kvkVestigingnummer"
        private const val STATUTAIRE_NAAM_KEY = "statutaireNaam"
        private const val HOEVEELHEID_KEY = "hoeveelheid"
        private const val TARIEF_KEY = "tarief"
        private const val BTW_PERCENTAGE_KEY = "btwPercentage"
        private const val NAAM_CONTACTPERSOON_KEY = "naamContactpersoon"
        private const val VESTIGINGNUMMER_ROTTERDAM_KEY = "vestigingsnummerRotterdam"
        private const val STRAATNAAM_KEY = "straatnaam"
        private const val HUISNUMMER_KEY = "huisnummer"
        private const val HUISNUMMER_TOEVOEGING_KEY = "huisnummerToevoeging"
        private const val POSTBUS_KEY = "postbus"
        private const val PLAATSNAAM_KEY = "plaatsnaam"
        private const val POSTCODE_KEY = "postcode"
        private const val LANDCODE_KEY = "landcode"
    }
}
