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

import com.ritense.externeklanttaak.domain.SpecVersion
import com.ritense.externeklanttaak.domain.DataBindingConfig
import com.ritense.externeklanttaak.model.FormulierSoort
import com.ritense.externeklanttaak.model.IPluginActionConfig
import com.ritense.externeklanttaak.model.TaakKoppelingRegistratie
import com.ritense.externeklanttaak.model.TaakReceiver
import com.ritense.externeklanttaak.model.TaakReceiver.OTHER
import com.ritense.externeklanttaak.model.TaakSoort
import com.ritense.externeklanttaak.model.TaakSoort.OGONEBETALING
import com.ritense.externeklanttaak.model.TaakSoort.PORTAALFORMULIER
import com.ritense.externeklanttaak.model.TaakSoort.URL

@SpecVersion(min = "1.1.0")
data class CreateTaakActionV1x1x0(
    override val resultingKlanttaakObjectUrlVariable: String? = null,
    val taakTitel: String? = null,
    val taakSoort: TaakSoort,
    val taakReceiver: TaakReceiver,
    val url: String? = null,
    val portaalformulierSoort: FormulierSoort? = null,
    val portaalformulierValue: String? = null,
    val portaalformulierData: List<DataBindingConfig> = emptyList(),
    val portaalformulierVerzondenData: List<DataBindingConfig> = emptyList(),
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