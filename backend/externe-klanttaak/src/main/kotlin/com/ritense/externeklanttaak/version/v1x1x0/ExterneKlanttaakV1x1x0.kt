/*
 * Copyright 2025 Ritense BV, the Netherlands.
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

package com.ritense.externeklanttaak.version.v1x1x0

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonValue
import com.ritense.externeklanttaak.domain.IExterneKlanttaak
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakStatus.AFGEROND
import java.time.LocalDate

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
    override fun canBeHandled(): Boolean = status == AFGEROND

    enum class FormulierSoort(@JsonValue val value: String) {
        ID("id"),
        URL("url"),
        ;

        override fun toString(): String = value
    }

    data class DataBindingConfig(
        val key: String,
        val value: String
    )

    data class ExterneTaakUrl(
        val uri: String
    )

    data class OgoneBetaling(
        val bedrag: Double,
        val betaalkenmerk: String,
        val pspid: String,
    )

    data class PortaalFormulier(
        val formulier: TaakFormulier,
        val data: Map<String, Any>? = emptyMap(),
        @JsonProperty("verzonden_data")
        var verzondenData: Map<String, Any> = emptyMap(),
    )

    data class TaakFormulier(
        val soort: FormulierSoort,
        val value: String
    )

    data class TaakIdentificatie(
        val type: String,
        val value: String
    ) {
        companion object {
            const val TYPE_BSN = "bsn"
            const val TYPE_KVK = "kvk"
        }
    }

    data class TaakKoppeling(
        val registratie: TaakKoppelingRegistratie,
        val uuid: String?,
    )

    enum class TaakKoppelingRegistratie(
        @JsonValue val value: String,
    ) {
        ZAAK("zaak"),
        PRODUCT("product"),
    }

    enum class TaakReceiver(@JsonValue val key: String) {
        ZAAK_INITIATOR("zaakInitiator"),
        OTHER("other")
    }

    enum class TaakSoort(
        @JsonValue val value: String,
    ) {
        URL("url"),
        PORTAALFORMULIER("portaalformulier"),
        OGONEBETALING("ogonebetaling"),
        ;

        override fun toString(): String = value
    }

    enum class TaakStatus(@JsonValue val value: String) {
        OPEN("open"),
        AFGEROND("afgerond"),
        VERWERKT("verwerkt"),
        GESLOTEN("gesloten"),
        ;

        override fun toString(): String = value
    }

    companion object {
        private const val DEFAULT_EIGENAAR = "GZAC"
    }
}