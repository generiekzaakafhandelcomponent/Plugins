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

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.mtlssslcontext.MTlsSslContext
import com.ritense.valtimoplugins.xential.domain.FileFormat
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin.Companion.PLUGIN_KEY
import com.ritense.valtimoplugins.xential.service.DocumentGenerationService
import com.ritense.valtimoplugins.xential.service.OpentunnelEsbClient
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.web.client.RestClient
import java.net.URI
import java.util.UUID

@Plugin(
    key = PLUGIN_KEY,
    title = "Xential Plugin",
    description = "handle xentail requests"
)
@Suppress("UNUSED")
class XentialPlugin(
    private val esbClient: OpentunnelEsbClient,
    private val documentGenerationService: DocumentGenerationService,
    private val valueResolverService: ValueResolverService
) {
    @PluginProperty(key = "applicationName", secret = false, required = true)
    lateinit var applicationName: String

    @PluginProperty(key = "applicationPassword", secret = true, required = true)
    lateinit var applicationPassword: String

    @PluginProperty(key = "baseUrl", secret = false, required = true)
    lateinit var baseUrl: URI

    @PluginProperty(key = "mTlsSslContextAutoConfigurationId", secret = false, required = true)
    private lateinit var mTlsSslContextAutoConfigurationId: MTlsSslContext

    private fun isResolvableValue(value: String): Boolean =
        value.isNotBlank() && (
                value.startsWith("case:") ||
                value.startsWith("doc:") ||
                value.startsWith("template:") ||
                value.startsWith("pv:")
        )

    private fun resolveValuesFor(
        execution: DelegateExecution,
        params: Map<String, Any?>
    ): Map<String, Any?> {
        val resolvedValues = params.filter {
            if (it.value is String) {
                isResolvableValue(it.value as String)
            } else false
        }
            .let { filteredParams ->
                logger.debug { "Trying to resolve values for: $filteredParams" }
                valueResolverService.resolveValues(
                    execution.processInstanceId,
                    execution,
                    filteredParams.map { it.value as String }
                ).let { resolvedValues ->
                    logger.debug { "Resolved values: $resolvedValues" }
                    filteredParams.toMutableMap().apply {
                        this.entries.forEach { (key, value) ->
                            this.put(key, resolvedValues[value])
                        }
                    }
                }
            }
        return params.toMutableMap().apply {
            this.putAll(resolvedValues)
        }.toMap()
    }

    @PluginAction(
        key = "generate-document",
        title = "Generate document",
        description = "Generate a document using xential.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun generateDocument(
        @PluginActionProperty xentialContent: Map<String, Any>,
        @PluginActionProperty xentialData: String,
        @PluginActionProperty xentialSjabloonId: String,
        @PluginActionProperty xentialGebruikersId: String,
        execution: DelegateExecution
    ) {

        logger.info { "generating document with XentialContent: $xentialContent" }

        val props = objectMapper.convertValue(xentialContent) as XentialDocumentProperties

        props.content = xentialData

        val resolvedValues = resolveValuesFor(execution, mapOf(
            "content" to props.content,
        ))

        props.content = resolvedValues["content"] as String
        documentGenerationService.generateDocument(
            esbClient.documentApi(restClient(mTlsSslContextAutoConfigurationId)),
            UUID.fromString(execution.processInstanceId),
            xentialGebruikersId,
            xentialSjabloonId,
            props,
            execution
        )
    }

    @PluginAction(
        key = "prepare-content",
        title = "Prepare content",
        description = "Prepare content for xential.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun prepareContent(
        @PluginActionProperty fileFormat: FileFormat,
        @PluginActionProperty documentId: String,
        @PluginActionProperty eventMessageName: String,
        @PluginActionProperty xentialContent: String,
        @PluginActionProperty verzendAdresData: Array<TemplateDataEntry>,
        @PluginActionProperty colofonData: Array<TemplateDataEntry>,
        @PluginActionProperty documentDetailsData: Array<TemplateDataEntry>,
        @PluginActionProperty firstTemplateGroupId: UUID,
        @PluginActionProperty secondTemplateGroupId: UUID?,
        @PluginActionProperty thirdTemplateGroupId: UUID?,

        execution: DelegateExecution
    ) {
        try {
            documentGenerationService.generateContent(
                documentDetailsData,
                colofonData,
                verzendAdresData,
                execution
            ).let {
                val xentialDocumentProperties = XentialDocumentProperties(
                    thirdTemplateGroupId ?: secondTemplateGroupId ?: firstTemplateGroupId,
                    fileFormat,
                    documentId,
                    eventMessageName,
                    it as String
                )
                execution.processInstance.setVariable(
                    xentialContent, objectMapper.convertValue(xentialDocumentProperties)
                )
            }
        } catch (e: Exception) {
            logger.error { "Exiting scope due to nested error. $e" }
            return
        }
    }

    @PluginAction(
        key = "prepare-content-with-template",
        title = "Prepare content with template",
        description = "Prepare content for xential with template.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun prepareContentWithTemplate(
        @PluginActionProperty fileFormat: FileFormat,
        @PluginActionProperty eventMessageName: String,
        @PluginActionProperty xentialContentId: String,
        @PluginActionProperty firstTemplateGroupId: UUID,
        @PluginActionProperty secondTemplateGroupId: UUID?,
        @PluginActionProperty thirdTemplateGroupId: UUID?,
        execution: DelegateExecution
    ) {
        try {
            val xentialDocumentProperties = XentialDocumentProperties(
                thirdTemplateGroupId ?: secondTemplateGroupId ?: firstTemplateGroupId,
                fileFormat,
                "documentId",
                eventMessageName,
                null
            )

            execution.processInstance.setVariable(
                xentialContentId, objectMapper.convertValue(xentialDocumentProperties)
            )
        } catch (e: Exception) {
            logger.error { "Exiting scope due to nested error. $e" }
            return
        }
    }

    private fun restClient(mTlsSslContextAutoConfiguration: MTlsSslContext?): RestClient {

        return esbClient.createRestClient(
            baseUrl = baseUrl.toString(),
            applicationName = applicationName,
            applicationPassword = applicationPassword,
            mTlsSslContextAutoConfiguration?.createSslContext()
        )
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val objectMapper = jacksonObjectMapper().findAndRegisterModules()
        const val PLUGIN_KEY = "xential"
    }

}
