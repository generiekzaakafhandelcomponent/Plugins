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


package com.ritense.externeklanttaak.plugin

import com.ritense.externeklanttaak.domain.IExterneKlanttaakVersion
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService

open class ExterneKlanttaakPluginFactory(
    pluginService: PluginService,
    private val externeKlanttaakService: ExterneKlanttaakService,
    private val externeKlanttaakVersions: List<IExterneKlanttaakVersion>
) : PluginFactory<ExterneKlanttaakPlugin>(pluginService) {

    override fun create(): ExterneKlanttaakPlugin {
        return ExterneKlanttaakPlugin(
            externeKlanttaakService,
            externeKlanttaakVersions
        )
    }
}