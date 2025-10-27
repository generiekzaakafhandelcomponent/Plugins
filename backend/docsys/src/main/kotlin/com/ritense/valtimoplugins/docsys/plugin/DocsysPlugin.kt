/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.docsys.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginEvent
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.EventType
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.docsys.client.DocsysClient
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KotlinLogging
import java.net.URI
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "Docsys",
    title = "Docsys Plugin",
    description = "Post message with the Docsys plugin"
)
open class DocsysPlugin(
    private val DocsysClient: DocsysClient,
    private val valueResolverService: ValueResolverService,
    private val storageService: TemporaryResourceStorageService,
) {

    @PluginProperty(key = "apiUrl", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "clientId", secret = true)
    lateinit var clientId: String

    @PluginProperty(key = "clientSecret", secret = true)
    lateinit var clientSecret: String

    @PluginProperty(key = "tokenEndpoint", secret = false)
    lateinit var tokenEndpoint: URI

    @PluginEvent(invokedOn = [EventType.CREATE, EventType.UPDATE])
    fun setDocsysClientParams() {
        logger.debug { "set docsys client params" }
        DocsysClient.baseUri = url
        DocsysClient.tokenEndpoint = tokenEndpoint
        DocsysClient.clientId = clientId
        DocsysClient.clientSecret = clientSecret
    }

    @PluginAction(
        key = "generate-document",
        title = "Generate document",
        description = "Generate document using Docsys",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun generateDocument(
        execution: DelegateExecution,
        @PluginActionProperty modelId: String,
        @PluginActionProperty params: List<TemplateProperty>?,
    ) {
        DocsysClient.generateDraftDocument(
            modelId = modelId,
            params = (params?.associate { it.key to it.value }) as Map<String, Any>,
        )
    }

    private fun resolveValue(execution: DelegateExecution, keyValueList: List<TemplateProperty>?): List<TemplateProperty>? {
        return if (keyValueList == null) {
            null
        } else {
            keyValueList.filter { it.value is String }.map {
                var resolvedValues = valueResolverService.resolveValues(
                    execution.processInstanceId,
                    execution,
                    listOf(it.value as String)
                )
                var resolvedValue = resolvedValues[it.value]
                TemplateProperty(it.key, resolvedValue)
            }
        }
    }

    companion object {
        const val RESOURCE_ID_PROCESS_VAR = "resourceId"
        private val logger = KotlinLogging.logger {}
    }
}
