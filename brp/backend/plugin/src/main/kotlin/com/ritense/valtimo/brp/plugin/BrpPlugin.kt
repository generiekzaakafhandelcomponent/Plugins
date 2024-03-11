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
import com.ritense.valtimo.brp.dto.BrpPluginPropertiesDto
import com.ritense.valtimo.brp.dto.FetchBrpDataPluginActionProperties
import com.ritense.valtimo.brp.service.BrpService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails

@Plugin(
    key = "brp",
    title = "BRP Plugin",
    description = "Fetch brp data with the BRP plugin"
)
class BrpPlugin(
    private val brpService: BrpService
) {

    @PluginProperty(key = "url", secret = false)
    lateinit var url: String

    @PluginProperty(key = "apiKeyHeaderName", secret = false)
    lateinit var apiKeyHeaderName: String

    @PluginProperty(key = "apiKey", secret = true)
    lateinit var apiKey: String

    @PluginProperty(key = "applicationId", secret = false)
    lateinit var applicationId: String

    @PluginAction(
        key = "fetch-brp-data",
        title = "Fetch BRP data",
        description = "fetch BRP data from HaalCentraal",
        activityTypes = [ActivityType.SERVICE_TASK_START]
    )
    fun fetchBrpData(
        execution: DelegateExecution,
        @PluginActionProperty requestProcessId: String,
        @PluginActionProperty requestSubjectIdentifier: String,
        @PluginActionProperty filterChildrenOlderThenThirteen: Boolean?,
    ) {

        val brpPluginPropertiesDto = BrpPluginPropertiesDto(
            url = url,
            apiKeyHeaderName = apiKeyHeaderName,
            apiKey = apiKey,
            applicationId = applicationId
        )

        val fetchBrpDataPluginActionProperties = FetchBrpDataPluginActionProperties(
            requestUserId = getLoggedInUser(),
            requestProcessId = requestProcessId, // Inzetten en uitvoeren instrumenten
            requestSubjectIdentifier = requestSubjectIdentifier, // BSN
            filterChildrenOlderThenThirteen = filterChildrenOlderThenThirteen ?: false
        )

        val persoon = brpService.getBrpDataFromHaalCentraal(
            bsn = execution.getVariable("bsn") as String,
            brpPropertiesDto = brpPluginPropertiesDto,
            fetchBrpDataPluginActionProperties = fetchBrpDataPluginActionProperties
        )

        execution.setVariable("brpPersoon", persoon)
    }

    private fun getLoggedInUser():String = (SecurityContextHolder.getContext().authentication.principal as UserDetails).username
}
