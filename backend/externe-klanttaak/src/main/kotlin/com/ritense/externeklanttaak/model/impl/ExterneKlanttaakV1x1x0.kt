/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.externeklanttaak.model.impl

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.ritense.externeklanttaak.domain.DataBindingConfig
import com.ritense.externeklanttaak.domain.FinalizerProcessVariables.EXTERNE_KLANTTAAK_OBJECT_URL
import com.ritense.externeklanttaak.domain.SpecVersion
import com.ritense.externeklanttaak.model.ExterneTaakUrl
import com.ritense.externeklanttaak.model.FormulierSoort
import com.ritense.externeklanttaak.model.IExterneKlanttaak
import com.ritense.externeklanttaak.model.IPluginActionConfig
import com.ritense.externeklanttaak.model.OgoneBetaling
import com.ritense.externeklanttaak.model.PortaalFormulier
import com.ritense.externeklanttaak.model.TaakFormulier
import com.ritense.externeklanttaak.model.TaakIdentificatie
import com.ritense.externeklanttaak.model.TaakKoppeling
import com.ritense.externeklanttaak.model.TaakKoppelingRegistratie
import com.ritense.externeklanttaak.model.TaakReceiver
import com.ritense.externeklanttaak.model.TaakReceiver.OTHER
import com.ritense.externeklanttaak.model.TaakReceiver.ZAAK_INITIATOR
import com.ritense.externeklanttaak.model.TaakSoort
import com.ritense.externeklanttaak.model.TaakSoort.OGONEBETALING
import com.ritense.externeklanttaak.model.TaakSoort.PORTAALFORMULIER
import com.ritense.externeklanttaak.model.TaakSoort.URL
import com.ritense.externeklanttaak.model.TaakStatus
import com.ritense.externeklanttaak.model.TaakStatus.AFGEROND
import com.ritense.externeklanttaak.model.TaakStatus.OPEN
import com.ritense.externeklanttaak.model.TaakStatus.VERWERKT
import com.ritense.externeklanttaak.service.UtilityService
import com.ritense.externeklanttaak.service.impl.DefaultUtilityService
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.delegate.DelegateTask
import java.time.LocalDate
import java.time.ZoneOffset

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ExterneKlanttaakV1x1x0(
    @JsonProperty("verwerker_taak_id")
    override val verwerkerTaakId: String,
    val titel: String,
    val status: TaakStatus,
    val soort: TaakSoort,
    val url: ExterneTaakUrl? = null,
    val ogonebetaling: OgoneBetaling? = null,
    val portaalformulier: PortaalFormulier? = null,
    val identificatie: TaakIdentificatie,
    val koppeling: TaakKoppeling? = null,
    val verloopdatum: LocalDate? = null,
    val eigenaar: String? = DEFAULT_EIGENAAR,
) : IExterneKlanttaak {
    companion object {
        private const val DEFAULT_EIGENAAR = "GZAC"
        private val logger = KotlinLogging.logger {}

        fun complete(externeKlanttaak: IExterneKlanttaak): (IPluginActionConfig, DelegateExecution, UtilityService) -> IExterneKlanttaak? =
            { config, execution, utilService ->
                require(externeKlanttaak is ExterneKlanttaakV1x1x0)
                require(config is CompleteTaakActionV1x1x0)
                require(utilService is DefaultUtilityService)
                when (externeKlanttaak.status == AFGEROND) {
                    true -> {
                        if (externeKlanttaak.soort == PORTAALFORMULIER) {
                            val verzondenData = requireNotNull(externeKlanttaak.portaalformulier?.verzondenData) {
                                "Property [portaalformulier] is required when [taakSoort] is ${externeKlanttaak.soort}"
                            }
                            if (config.koppelDocumenten) {
                                utilService.linkDocumentsToZaak(
                                    documentPathsPath = config.documentPadenPad,
                                    verzondenData = verzondenData,
                                    delegateExecution = execution,
                                )
                            }

                            if (config.storeSubmission) {
                                utilService.handleFormulierTaakSubmission(
                                    submission = verzondenData,
                                    submissionMapping = config.verzondenDataMapping,
                                    verwerkerTaakId = externeKlanttaak.verwerkerTaakId,
                                    delegateExecution = execution,
                                )
                            }
                        }
                        externeKlanttaak.copy(status = VERWERKT)
                    }

                    false -> {
                        logger.debug { "Task not completed due to unmatched criteria." }
                        null
                    }
                }
            }

        fun create(): (IPluginActionConfig, DelegateTask, UtilityService) -> IExterneKlanttaak =
            { config, delegateTask, utilService ->
                require(utilService is DefaultUtilityService)
                require(config is CreateTaakActionV1x1x0)

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
                            utilService.resolveFormulierTaakData(
                                delegateTask = delegateTask,
                                sendData = config.portaalformulierData,
                                documentId = delegateTask.execution.processInstanceId
                            )
                        )
                    } else null,
                    identificatie = when (config.taakReceiver) {
                        ZAAK_INITIATOR -> utilService.getZaakinitiatorByDocumentId(delegateTask.execution.processBusinessKey)
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
                    verloopdatum = utilService.stringAsInstantOrNull(config.verloopdatum)
                        ?.let {
                            LocalDate.ofInstant(it, ZoneOffset.UTC)
                        }
                        ?: delegateTask.dueDate?.let {
                            LocalDate.ofInstant(it.toInstant(), ZoneOffset.UTC)
                        },
                    verwerkerTaakId = delegateTask.id
                )
            }
    }
}

@SpecVersion(min = "1.1.0")
data class CreateTaakActionV1x1x0(
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

@SpecVersion(min = "1.1.0")
data class CompleteTaakActionV1x1x0(
    override val resultingKlanttaakObjectUrlVariable: String? = null,
    override val klanttaakObjectUrl: String = "pv:$EXTERNE_KLANTTAAK_OBJECT_URL",
    val storeSubmission: Boolean,
    val verzondenDataMapping: List<DataBindingConfig> = emptyList(),
    val koppelDocumenten: Boolean,
    val documentPadenPad: String? = "/documenten",
) : IPluginActionConfig