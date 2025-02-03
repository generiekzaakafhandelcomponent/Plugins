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

package com.ritense.externeklanttaak.autoconfiguration

import com.ritense.externeklanttaak.domain.IExterneKlanttaakVersion
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakVersionV1x1x0
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order

@AutoConfiguration
class ExterneKlanttaakVersionsConfiguration {

    @Bean
    @Order(Ordered.LOWEST_PRECEDENCE)
    fun ensureUniqueExterneKlanttaakVersions(
        externeKlanttaakVersions: List<IExterneKlanttaakVersion>
    ): Nothing? {
        if (externeKlanttaakVersions.distinctBy { it.version }.size != externeKlanttaakVersions.size) {
            throw IllegalStateException("Externe Klanttaak Versions must be unique.")
        }
        return null
    }

    @Bean
    fun externeKlanttaakVersionV1x1x0(
        pluginService: PluginService,
        valueResolverService: ValueResolverService,
        taskService: CamundaTaskService,
        zaakUrlProvider: ZaakUrlProvider
    ): IExterneKlanttaakVersion {
        return ExterneKlanttaakVersionV1x1x0(
            pluginService,
            valueResolverService,
            taskService,
            zaakUrlProvider
        )
    }
}