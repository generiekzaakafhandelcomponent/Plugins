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

import com.ritense.externeklanttaak.domain.IExterneKlanttaakVersion
import com.ritense.externeklanttaak.domain.IExterneKlanttaak
import com.ritense.externeklanttaak.domain.IPluginActionConfig
import com.ritense.externeklanttaak.version.v1x1x0.CompleteExterneKlanttaakActionV1x1x0.CompleteExterneKlanttaakActionConfigV1x1x0
import com.ritense.externeklanttaak.version.v1x1x0.CreateExterneKlanttaakActionV1x1x0.CreateExterneKlanttaakActionConfigV1x1x0
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.delegate.DelegateTask

class ExterneKlanttaakVersionV1x1x0(
    private val pluginService: PluginService,
    private val valueResolverService: ValueResolverService,
    private val taskService: CamundaTaskService,
    private val zaakUrlProvider: ZaakUrlProvider,
) : IExterneKlanttaakVersion {
    override val version: String = "1.1.0"

    override fun create(pluginActionConfig: IPluginActionConfig, delegateTask: DelegateTask): IExterneKlanttaak {
        require(pluginActionConfig is CreateExterneKlanttaakActionConfigV1x1x0)
        return CreateExterneKlanttaakActionV1x1x0(
            pluginService,
            valueResolverService,
            zaakUrlProvider,
        )
            .create(pluginActionConfig, delegateTask)
    }

    override fun complete(
        externeKlanttaak: IExterneKlanttaak,
        pluginActionConfig: IPluginActionConfig,
        delegateExecution: DelegateExecution
    ): IExterneKlanttaak? {
        require(externeKlanttaak is ExterneKlanttaakV1x1x0)
        require(pluginActionConfig is CompleteExterneKlanttaakActionConfigV1x1x0)
        return CompleteExterneKlanttaakActionV1x1x0(
            pluginService,
            valueResolverService,
            taskService,
            zaakUrlProvider,
        )
            .complete(
                externeKlanttaak = externeKlanttaak,
                pluginActionConfig = pluginActionConfig,
                delegateExecution = delegateExecution
            )
    }
}