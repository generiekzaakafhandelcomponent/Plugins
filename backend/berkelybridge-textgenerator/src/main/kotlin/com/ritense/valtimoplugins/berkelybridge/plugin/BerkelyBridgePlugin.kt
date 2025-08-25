/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


package com.ritense.valtimoplugins.berkelybridge.plugin

import com.ritense.documentenapi.client.DocumentStatusType
import com.ritense.plugin.annotation.*
import com.ritense.plugin.domain.EventType
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.resource.domain.MetadataType
import com.ritense.resource.domain.TemporaryResourceUploadedEvent
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.berkelybridge.client.BerkelyBridgeClient
import com.ritense.valueresolver.ValueResolverService
import java.net.URL
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.variable.Variables
import org.camunda.bpm.engine.variable.value.SerializationDataFormat
import org.springframework.context.ApplicationEventPublisher
import kotlin.math.log

private val logger = KotlinLogging.logger {}

@Plugin(
    key = "bbtextgenerator",
    title = "Berkely Bridge tekst en PDF generator",
    description = "Berkely Bridge genereert text of PDF documenten"
)
class BerkelyBridgePlugin(
    private val bbClient: BerkelyBridgeClient,
    private val valueResolverService: ValueResolverService,
    private val resourceService: TemporaryResourceStorageService,
    private val applicationEventPublisher: ApplicationEventPublisher,
) {

    @PluginProperty(key = "berkelybridgeBaseUrl", secret = false, required = true)
    lateinit var berkelybridgeBaseUrl: String

    @PluginProperty(key = "subscriptionKey", secret = true, required = true)
    lateinit var subscriptionKey: String

    @PluginEvent(invokedOn = [EventType.CREATE, EventType.UPDATE])
    fun setSubscriptionKey() {
        logger.debug { "zet subscription key" }
        this.bbClient.subscriptionKey = subscriptionKey
    }

    @PluginAction(
        key = "genereer-tekst",
        title = "Genereer tekst",
        description = "Genereer tekst met template en parameters. Specifeer met format parameter of de output html of text moet zijn",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun generateText(
        execution: DelegateExecution,
        @PluginActionProperty modelId: String,
        @PluginActionProperty templateId: String,
        @PluginActionProperty parameters: List<TemplateProperty>?,
        @PluginActionProperty format: String,
        @PluginActionProperty naam: String,
        @PluginActionProperty variabeleNaam: String
    ) {
        val text = bbClient.generate(bbUrl = berkelybridgeBaseUrl, modelId = modelId, templateId = templateId,
            parameters = resolveValue(execution, parameters),
            naam = naam,
            format = format)

            execution.setVariable(
                variabeleNaam,
                Variables.objectValue(text).serializationDataFormat(
                    Variables.SerializationDataFormats.JAVA
                ).create()
            )
    }

    @PluginAction(
        key = "genereer-file-documenten-api",
        title = "Genereer een file",
        description = "Genereer een file die wordt opgeslagen in de documenten API",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun generateFile(
        execution: DelegateExecution,
        @PluginActionProperty modelId: String,
        @PluginActionProperty templateId: String,
        @PluginActionProperty parameters: List<TemplateProperty>?,
        @PluginActionProperty format: String,
        @PluginActionProperty naam: String,
        @PluginActionProperty taal: String,
        @PluginActionProperty beschrijving: String,
        @PluginActionProperty informatieObjectType: String,
        @PluginActionProperty variabeleNaam: String
    ) {
        val downloadLink = bbClient.generateFile(bbUrl = berkelybridgeBaseUrl, modelId = modelId, templateId = templateId,
            parameters = resolveValue(execution, parameters),
            naam = naam,
            format = format)

        var bytes = getFileAsByteArray(downloadLink)
        val mutableMetaData = mutableMapOf<String, Any>()
        mutableMetaData.put(MetadataType.DOCUMENT_ID.key, execution.processBusinessKey)
        mutableMetaData.put(MetadataType.FILE_NAME.key, naam)
        mutableMetaData.put(MetadataType.CONTENT_TYPE.key, format)
        mutableMetaData.put("title", naam)
        mutableMetaData.put("status", DocumentStatusType.DEFINITIEF.name)
        mutableMetaData.put("bestandsomvang", bytes.size)
        mutableMetaData.put("description", beschrijving)
        mutableMetaData.put("confidentialityLevel", "zaakvertrouwelijk")
        mutableMetaData.put("language", taal)
        mutableMetaData.put("informatieobjecttype", informatieObjectType)
        mutableMetaData.put("author", "Gegenereerd door BerkelyBridge")

        val resourceId = resourceService.store( getFileAsByteArray(downloadLink).inputStream(), mutableMetaData)
        applicationEventPublisher.publishEvent(TemporaryResourceUploadedEvent(resourceId))

        execution.setVariable(variabeleNaam, berkelybridgeBaseUrl.plus("/").plus(downloadLink));
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

    private fun getFileAsByteArray(fileUrl: String): ByteArray {
        try {
            logger.debug { "getting file for fileUrl: $fileUrl " }

            val getFileUrl = URL(berkelybridgeBaseUrl.plus("/$fileUrl"))
            val fileData = getFileUrl.readBytes();
            return fileData;
        } catch (e: Exception) {
            logger.error { "error berkely bridge retrieving file for $fileUrl \n" + e.message }
            throw e
        }
    }
}
