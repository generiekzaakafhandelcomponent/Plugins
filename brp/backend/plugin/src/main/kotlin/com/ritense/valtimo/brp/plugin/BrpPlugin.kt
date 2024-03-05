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

package com.ritense.valtimo.brp.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.ActivityType
import java.net.URI
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "brp",
    title = "BRP Plugin",
    description = "Fetch brp data with the BRP plugin"
)
class BrpPlugin {

    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "token", secret = true)
    lateinit var token: String

    @PluginAction(
        key = "fetch-brp-data",
        title = "Fetch BRP data",
        description = "fetch BRP data from HaalCentraal",
        activityTypes = [ActivityType.SERVICE_TASK_START]
    )
    fun fetchBrpData(
        execution: DelegateExecution,
        @PluginActionProperty channel: String,
        @PluginActionProperty message: String
    ) {
    }


    companion object {
        const val RESOURCE_ID_PROCESS_VAR = "resourceId"
    }
}
