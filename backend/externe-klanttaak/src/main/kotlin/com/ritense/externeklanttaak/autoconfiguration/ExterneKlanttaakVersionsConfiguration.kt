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

package com.ritense.externeklanttaak.autoconfiguration

import com.ritense.externeklanttaak.domain.ExterneKlanttaakVersion
import com.ritense.externeklanttaak.version.v1x1x0.CompleteExterneKlanttaakActionV1x1x0
import com.ritense.externeklanttaak.version.v1x1x0.CreateExterneKlanttaakActionV1x1x0
import com.ritense.plugin.service.PluginService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.context.annotation.Bean

@AutoConfiguration
class ExterneKlanttaakVersionsConfiguration {

    @Bean
    fun v1x1x0(
        pluginService: PluginService,
        valueResolverService: ValueResolverService,
        zaakUrlProvider: ZaakUrlProvider
    ): ExterneKlanttaakVersion {
        return ExterneKlanttaakVersion(
            version = "1.1.0",
            create = CreateExterneKlanttaakActionV1x1x0(
                pluginService,
                valueResolverService,
                zaakUrlProvider,
            ).create(),
            complete = CompleteExterneKlanttaakActionV1x1x0(
                pluginService,
                valueResolverService,
                zaakUrlProvider,
            ).complete()
        )
    }

    @Bean
    fun v1x1x1(
        pluginService: PluginService,
        valueResolverService: ValueResolverService,
        zaakUrlProvider: ZaakUrlProvider,
    ): ExterneKlanttaakVersion {
        return ExterneKlanttaakVersion(
            version = "1.1.1",
            create = CreateExterneKlanttaakActionV1x1x0(
                pluginService,
                valueResolverService,
                zaakUrlProvider,
            ).create(),
            complete = CompleteExterneKlanttaakActionV1x1x0(
                pluginService,
                valueResolverService,
                zaakUrlProvider
            ).complete()
        )
    }
}