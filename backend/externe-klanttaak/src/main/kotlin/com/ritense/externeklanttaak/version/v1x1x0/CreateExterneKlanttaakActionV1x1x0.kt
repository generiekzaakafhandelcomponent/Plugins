package com.ritense.externeklanttaak.version.v1x1x0

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.document.domain.patch.JsonPatchService
import com.ritense.externeklanttaak.domain.IExterneKlanttaak
import com.ritense.externeklanttaak.domain.IPluginAction
import com.ritense.externeklanttaak.domain.IPluginActionConfig
import com.ritense.externeklanttaak.domain.SpecVersion
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.DataBindingConfig
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.ExterneTaakUrl
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.FormulierSoort
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.OgoneBetaling
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.PortaalFormulier
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakFormulier
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakIdentificatie
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakIdentificatie.Companion.TYPE_BSN
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakIdentificatie.Companion.TYPE_KVK
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakKoppeling
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakKoppelingRegistratie
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakReceiver
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakReceiver.OTHER
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakReceiver.ZAAK_INITIATOR
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.OGONEBETALING
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.PORTAALFORMULIER
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.URL
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakStatus.OPEN
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.contract.json.patch.JsonPatchBuilder
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import com.ritense.zakenapi.ZakenApiPlugin
import com.ritense.zakenapi.domain.rol.RolNatuurlijkPersoon
import com.ritense.zakenapi.domain.rol.RolNietNatuurlijkPersoon
import com.ritense.zakenapi.domain.rol.RolType
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.UUID

class CreateExterneKlanttaakActionV1x1x0(

    private val pluginService: PluginService,
    private val valueResolverService: ValueResolverService,
    private val zaakUrlProvider: ZaakUrlProvider,
) : IPluginAction {
    fun <C : IPluginActionConfig> create(): (C, DelegateTask) -> IExterneKlanttaak =
        { config, delegateTask ->
            require(config is CreateExterneKlanttaakActionConfigV1x1x0)
            ExterneKlanttaakV1x1x0(
                titel = requireNotNull(config.taakTitel ?: delegateTask.name) {
                    "Required property [taakTitel] was not provided and fallback DelegateTask::name is null"
                },
                status = OPEN,
                soort = config.taakSoort,
                url = if (config.taakSoort == URL && !config.url.isNullOrBlank()) {
                    ExterneTaakUrl(config.url)
                } else null,
                ogonebetaling = if (config.taakSoort == OGONEBETALING) {
                    OgoneBetaling(
                        bedrag =
                        requireNotNull(config.ogoneBedrag) {
                            "Property [ogoneBedrag] is required when [taakSoort] is ${config.taakSoort}"
                        }
                            .toDouble(),
                        betaalkenmerk = requireNotNull(config.ogoneBetaalkenmerk) {
                            "Property [ogoneBetaalkenmerk] is required when [taakSoort] is ${config.taakSoort}"
                        },
                        pspid = requireNotNull(config.ogonePspid) {
                            "Property [ogonePspid] is required when [taakSoort] is ${config.taakSoort}"
                        },
                    )
                } else null,
                portaalformulier = if (config.taakSoort == PORTAALFORMULIER) {
                    PortaalFormulier(
                        formulier = TaakFormulier(
                            soort = requireNotNull(config.portaalformulierSoort) {
                                "Property [portaalformulierSoort] is required when [taakSoort] is ${config.taakSoort}"
                            },
                            value = requireNotNull(config.portaalformulierValue) {
                                "Property [portaalformulierValue] is required when [taakSoort] is ${config.taakSoort}"
                            },
                        ),
                        data =
                        resolveFormulierTaakData(
                            delegateTask = delegateTask,
                            sendData = config.portaalformulierData,
                            documentId = delegateTask.execution.processInstanceId
                        )
                    )
                } else null,
                identificatie = when (config.taakReceiver) {
                    ZAAK_INITIATOR -> getZaakinitiatorByDocumentId(delegateTask.execution.processBusinessKey)
                    OTHER -> TaakIdentificatie(
                        type = requireNotNull(config.identificationKey) {
                            "Property [identificationKey] is required when [taakReceiver] is ${config.taakReceiver}"
                        },
                        value = requireNotNull(config.identificationValue) {
                            "Property [identificationValue] is required when [taakReceiver] is ${config.taakReceiver}"
                        },
                    )
                },
                koppeling = config.koppelingRegistratie?.let {
                    TaakKoppeling(
                        registratie = it,
                        uuid = requireNotNull(config.koppelingUuid) {
                            "Property [portaalformulierValue] is required when [koppelingRegistratie] is ${config.koppelingRegistratie}"
                        },
                    )
                },
                verloopdatum = stringAsInstantOrNull(config.verloopdatum)
                    ?.let {
                        LocalDate.ofInstant(it, ZoneOffset.UTC)
                    }
                    ?: delegateTask.dueDate?.let {
                        LocalDate.ofInstant(it.toInstant(), ZoneOffset.UTC)
                    },
                verwerkerTaakId = delegateTask.id
            )
        }

    private fun stringAsInstantOrNull(input: String?): Instant? {
        val commonGzacDateTimeFormats = listOf(
            DateTimeFormatter.BASIC_ISO_DATE,
            DateTimeFormatter.ofPattern("d-MM-uuuu"), // mm-DD-yyyy
            DateTimeFormatter.ISO_LOCAL_DATE,
            DateTimeFormatter.ISO_LOCAL_DATE_TIME,
            DateTimeFormatter.ISO_ZONED_DATE_TIME,
            DateTimeFormatter.ISO_INSTANT,
        )

        return input?.let {
            commonGzacDateTimeFormats.firstNotNullOfOrNull {
                try {
                    LocalDate.parse(input, it).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()
                } catch (ex: RuntimeException) {
                    logger.debug { "Input string [$input] didn't match DateTimeFormatter [$it]" }
                    null
                }
            }
        }
    }

    private fun getZaakinitiatorByDocumentId(businessKey: String): TaakIdentificatie {
        val (zaakUrl, zakenApiPlugin) = getZaakUrlAndPluginByDocumentId(businessKey)

        val initiator = requireNotNull(
            zakenApiPlugin.getZaakRollen(zaakUrl, RolType.INITIATOR).firstOrNull()
        ) { "No initiator role found for zaak with URL $zaakUrl" }

        return requireNotNull(
            initiator.betrokkeneIdentificatie.let {
                when (it) {
                    is RolNatuurlijkPersoon -> TaakIdentificatie(
                        TYPE_BSN,
                        requireNotNull(it.inpBsn) {
                            "Zaak initiator did not have valid inpBsn BSN"
                        }
                    )

                    is RolNietNatuurlijkPersoon -> TaakIdentificatie(
                        TYPE_KVK,
                        requireNotNull(it.annIdentificatie) {
                            "Zaak initiator did not have valid annIdentificatie KVK"
                        }
                    )

                    else -> null
                }
            }
        ) { "Could not map initiator identificatie (value=${initiator.betrokkeneIdentificatie}) for zaak with URL $zaakUrl to TaakIdentificatie" }
    }

    private fun getZaakUrlAndPluginByDocumentId(businessKey: String): Pair<URI, ZakenApiPlugin> {
        val documentId = UUID.fromString(businessKey)
        val zaakUrl = zaakUrlProvider.getZaakUrl(documentId)
        val zakenApiPlugin = requireNotNull(
            pluginService.createInstance(ZakenApiPlugin::class.java, ZakenApiPlugin.findConfigurationByUrl(zaakUrl))
        ) { "No plugin configuration was found for zaak with URL $zaakUrl" }
        return Pair(zaakUrl, zakenApiPlugin)
    }

    private fun resolveFormulierTaakData(
        delegateTask: DelegateTask,
        sendData: List<DataBindingConfig>,
        documentId: String
    ): Map<String, Any> {
        val sendDataValuesResolvedMap = valueResolverService.resolveValues(documentId, sendData.map { it.key })

        if (sendData.size != sendDataValuesResolvedMap.size) {
            val failedValues = sendData
                .filter { !sendDataValuesResolvedMap.containsKey(it.key) }
                .joinToString(", ") { "'${it.key}' = '${it.value}'" }
            throw IllegalArgumentException(
                "Error in sendData for task: '${delegateTask.taskDefinitionKey}' and documentId: '${documentId}'. Failed to resolve values: $failedValues".trimMargin()
            )
        }

        val sendDataResolvedMap = sendData.associate { it.value to sendDataValuesResolvedMap[it.key] }
        val jsonPatchBuilder = JsonPatchBuilder()
        val taakData = objectMapper.createObjectNode()

        sendDataResolvedMap.forEach {
            val path = JsonPointer.valueOf(it.key)
            val valueNode = objectMapper.valueToTree<JsonNode>(it.value)
            jsonPatchBuilder.addJsonNodeValue(taakData, path, valueNode)
        }

        JsonPatchService.apply(jsonPatchBuilder.build(), taakData)

        return objectMapper.convertValue(taakData)
    }

    @SpecVersion(min = "1.1.0")
    data class CreateExterneKlanttaakActionConfigV1x1x0(
        override val resultingKlanttaakObjectUrlVariable: String? = null,
        override val klanttaakObjectUrl: String? = null,
        val taakTitel: String? = null,
        val taakSoort: TaakSoort,
        val taakReceiver: TaakReceiver,
        val url: String? = null,
        val portaalformulierSoort: FormulierSoort? = null,
        val portaalformulierValue: String? = null,
        val portaalformulierData: List<DataBindingConfig> = emptyList(),
        val ogoneBedrag: String? = null,
        val ogoneBetaalkenmerk: String? = null,
        val ogonePspid: String? = null,
        val identificationKey: String? = null,
        val identificationValue: String? = null,
        val verloopdatum: String? = null,
        val koppelingRegistratie: TaakKoppelingRegistratie? = null,
        val koppelingUuid: String? = null,
    ) : IPluginActionConfig {
        init {
            if (taakReceiver == OTHER) {
                requireNotNull(identificationKey)
                requireNotNull(identificationValue)
            }
            when (taakSoort) {
                URL -> {
                    requireNotNull(url)
                }

                OGONEBETALING -> {
                    requireNotNull(ogoneBedrag)
                    requireNotNull(ogoneBetaalkenmerk)
                    requireNotNull(ogonePspid)
                }

                PORTAALFORMULIER -> {
                    requireNotNull(portaalformulierSoort)
                    requireNotNull(portaalformulierValue)
                }
            }
        }
    }

    companion object {
        private val objectMapper = MapperSingleton.get()
        private val logger = KotlinLogging.logger {}
    }
}