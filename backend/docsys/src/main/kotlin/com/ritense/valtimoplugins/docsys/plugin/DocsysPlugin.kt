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
import com.ritense.resource.domain.MetadataType
import com.ritense.documentenapi.client.DocumentStatusType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.docsys.client.DocsysClient
import com.ritense.valtimoplugins.docsys.client.DownloadResponse
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KotlinLogging
import java.net.URI
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.util.Base64

@Plugin(
    key = "docsys",
    title = "Docsys Plugin",
    description = "Generate documents with the Docsys plugin"
)
open class DocsysPlugin(
    private val DocsysClient: DocsysClient,
    private val valueResolverService: ValueResolverService,
    private val storageService: TemporaryResourceStorageService,
) {

    /**
     *  DAM  API is a specialized API for a particular client decreasing the complexity
     *  of using parameters in templates
     */
    @PluginProperty(key = "damApiUrl", secret = false)
    lateinit var damApiUrl: URI

    @PluginProperty(key = "docsysApiUrl", secret = false)
    lateinit var docsysApiUrl: URI

    @PluginProperty(key = "clientId", secret = true)
    lateinit var clientId: String

    @PluginProperty(key = "clientSecret", secret = true)
    lateinit var clientSecret: String

    @PluginProperty(key = "tokenEndpoint", secret = false)
    lateinit var tokenEndpoint: URI

    @PluginProperty(key = "scope", secret = false)
    var scope: String = ""

    @PluginEvent(invokedOn = [EventType.CREATE, EventType.UPDATE])
    fun setDocsysClientParams() {
        logger.debug { "set docsys client params" }
        DocsysClient.damBaseUri = damApiUrl
        DocsysClient.docsysBaseUri = docsysApiUrl
        DocsysClient.tokenEndpoint = tokenEndpoint
        DocsysClient.clientId = clientId
        DocsysClient.clientSecret = clientSecret
        DocsysClient.scope = scope
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
        @PluginActionProperty format: String,
        @PluginActionProperty processVariableName: String
    ) {
        setDocsysClientParams()
        var resolvedParams = resolveValue(execution, params)

        // step 1
        val fileResponse = DocsysClient.generateDocument(
            modelId = modelId,
            params = (resolvedParams?.associate { it.key to it.value as Any }) as Map<String, Any>,
        )

        val resourceId = storeDocument(fileResponse, format)
        execution.setVariable(processVariableName, resourceId)
    }

    private fun storeDocument(fileResponse: DownloadResponse, format: String): String {
        val content = Base64.getDecoder().decode(fileResponse.Content)
        val mutableMetaData = mutableMapOf<String, Any>()
        mutableMetaData.put("bestandsomvang", content.size)
        mutableMetaData.put(MetadataType.CONTENT_TYPE.key, format)
        mutableMetaData.put("author", "Gegenereerd door Docsys")

        val resourceId = storageService.store(content.inputStream(), mutableMetaData)

        return resourceId;
    }

    private fun resolveValue(
        execution: DelegateExecution,
        keyValueList: List<TemplateProperty>?
    ): List<TemplateProperty>? {
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
        private val logger = KotlinLogging.logger {}
    }
}
