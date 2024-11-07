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

package com.ritense.externeklanttaak.domain

import com.fasterxml.jackson.annotation.JsonValue
import com.ritense.externeklanttaak.model.IExterneKlanttaak
import com.ritense.externeklanttaak.model.IPluginActionConfig
import com.ritense.externeklanttaak.model.impl.ExterneKlanttaakV1x1x0
import com.ritense.externeklanttaak.service.UtilityService
import com.ritense.externeklanttaak.service.impl.DefaultUtilityService
import org.camunda.bpm.engine.delegate.DelegateTask
import kotlin.reflect.KClass
import kotlin.reflect.KFunction1

enum class KlanttaakVersion(
    @JsonValue val taakVersion: String,
    private val creator: (IPluginActionConfig, DelegateTask, UtilityService) -> IExterneKlanttaak,
    private val completer: KFunction1<ExterneKlanttaakV1x1x0, (UtilityService) -> IExterneKlanttaak>
) {
    V1_1_0(
        taakVersion = "1.1.0",
        creator = ExterneKlanttaakV1x1x0.create(),
        completer = ExterneKlanttaakV1x1x0::complete
    ),
    ;

    fun create(config: IPluginActionConfig, delegateTask: DelegateTask, utilService: UtilityService) =
        creator.invoke(config, delegateTask, utilService)

    fun complete(externeTaak: IExterneKlanttaak, utilService: UtilityService) =
        completer.call(externeTaak).invoke(utilService)

    val version = Version.fromString(taakVersion)
    infix fun supports(kClass: KClass<*>): Boolean = version supports kClass
}