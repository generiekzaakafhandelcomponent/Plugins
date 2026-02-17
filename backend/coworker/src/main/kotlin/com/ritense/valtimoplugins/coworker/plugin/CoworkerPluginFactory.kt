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

package com.ritense.valtimoplugins.coworker.plugin

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.coworker.client.CoworkerConnectionManager
import com.ritense.valtimoplugins.coworker.client.CoworkerRabbitClient
import com.ritense.valtimoplugins.coworker.listener.CoworkerResponseListener
import org.springframework.stereotype.Component

@Component
@SkipComponentScan
class CoworkerPluginFactory(
    pluginService: PluginService,
    private val rabbitClient: CoworkerRabbitClient,
    private val connectionManager: CoworkerConnectionManager,
    private val responseListener: CoworkerResponseListener,
    private val objectMapper: ObjectMapper,
) : PluginFactory<CoworkerPlugin>(pluginService) {

    override fun create(): CoworkerPlugin {
        return CoworkerPlugin(rabbitClient, connectionManager, responseListener, objectMapper)
    }
}
