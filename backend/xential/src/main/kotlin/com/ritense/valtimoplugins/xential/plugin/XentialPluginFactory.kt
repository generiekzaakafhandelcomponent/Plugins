/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.xential.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.xential.service.DocumentGenerationService
import com.ritense.valtimoplugins.xential.service.OpentunnelEsbClient
import com.ritense.valueresolver.ValueResolverService

class XentialPluginFactory(
    pluginService: PluginService,
    private val esbClient: OpentunnelEsbClient,
    private val documentGenerationService: DocumentGenerationService,
    private val valueResolverService: ValueResolverService
) : PluginFactory<XentialPlugin>(pluginService) {

    override fun create(): XentialPlugin {
        return XentialPlugin(
            esbClient,
            documentGenerationService,
            valueResolverService
        )
    }
}
