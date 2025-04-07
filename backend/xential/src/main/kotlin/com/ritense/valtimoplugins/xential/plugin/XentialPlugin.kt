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
    private val documentGenerationService: DocumentGenerationService
) {
    @PluginProperty(key = "applicationName", secret = false, required = true)
    lateinit var applicationName: String

    @PluginProperty(key = "applicationPassword", secret = true, required = true)
    lateinit var applicationPassword: String

    @PluginProperty(key = "gebruikersId", secret = false, required = true)
    lateinit var gebruikersId: String

    @PluginProperty(key = "baseUrl", secret = false, required = true)
    lateinit var baseUrl: URI

    @PluginProperty(key = "mTlsSslContextAutoConfigurationId", secret = false, required = true)
    private lateinit var mTlsSslContextAutoConfigurationId: MTlsSslContext

    @PluginAction(
        key = "generate-document",
        title = "Generate document",
        description = "Generate a document using xential.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun generateDocument(
        @PluginActionProperty xentialContentId: Map<String, Any>,
        @PluginActionProperty xentialSjabloonId: String,
        execution: DelegateExecution
    ) {

        logger.info { "generating document with XentialContent: $xentialContentId" }

        documentGenerationService.generateDocument(
            esbClient.documentApi(restClient(mTlsSslContextAutoConfigurationId)),
            UUID.fromString(execution.processInstanceId),
            gebruikersId,
            xentialSjabloonId,
            objectMapper.convertValue(xentialContentId) as XentialDocumentProperties,
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
        @PluginActionProperty xentialContentId: String,
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
                    thirdTemplateGroupId?: secondTemplateGroupId ?: firstTemplateGroupId,
                    fileFormat,
                    documentId,
                    eventMessageName,
                    it
                )
                execution.processInstance.setVariable(
                    xentialContentId, objectMapper.convertValue(xentialDocumentProperties)
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
        @PluginActionProperty documentId: String,
        @PluginActionProperty eventMessageName: String,
        @PluginActionProperty xentialContentId: String,
        @PluginActionProperty textTemplateId: String,
        @PluginActionProperty firstTemplateGroupId: UUID,
        @PluginActionProperty secondTemplateGroupId: UUID?,
        @PluginActionProperty thirdTemplateGroupId: UUID?,
        execution: DelegateExecution
    ) {
        try {
            val xentialDocumentProperties = XentialDocumentProperties(
                thirdTemplateGroupId?: secondTemplateGroupId ?: firstTemplateGroupId,
                fileFormat,
                documentId,
                eventMessageName,
                textTemplateId
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
