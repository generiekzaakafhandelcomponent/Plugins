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

package com.ritense.valtimoplugins.xential.service

import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.xential.domain.HttpClientProperties
import com.ritense.valtimoplugins.xential.domain.DocumentCreatedMessage
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.valtimoplugins.xential.domain.XentialToken
import com.ritense.valtimoplugins.xential.plugin.TemplateDataEntry
import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import com.ritense.valueresolver.ValueResolverService
import com.rotterdam.xential.model.Sjabloondata
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.io.ByteArrayInputStream
import java.util.UUID
import java.util.Base64

class DocumentGenerationService(
    private val xentialTokenRepository: XentialTokenRepository,
    private val temporaryResourceStorageService: TemporaryResourceStorageService,
    private val runtimeService: RuntimeService,
    private val valueResolverService: ValueResolverService,
    private val httpClientConfig: HttpClientConfig
) {
    fun generateContent(
        documentDetailsData: Array<TemplateDataEntry>,
        colofonData: Array<TemplateDataEntry>,
        verzendAdresData: Array<TemplateDataEntry>,
        execution: DelegateExecution,
    ) = mutableMapOf(
        "documentDetails" to resolveTemplateData(documentDetailsData, execution),
        "colofon" to resolveTemplateData(colofonData, execution),
        "verzendAdres" to resolveTemplateData(verzendAdresData, execution)
    ) as MutableMap<String, Any>

    fun generateDocument(
        httpClientProperties: HttpClientProperties,
        processId: UUID,
        xentialDocumentProperties: XentialDocumentProperties,
        execution: DelegateExecution,
    ) {
        logger.info { "generating xential document with gebruikersId: ${httpClientProperties.applicationName}" }

        val api = httpClientConfig.configureClient(httpClientProperties)
        val sjabloonVulData = generateXml(xentialDocumentProperties.content)
        val result = api.creeerDocument(
            gebruikersId = xentialDocumentProperties.gebruikersId,
            accepteerOnbekend = false,
            sjabloondata = Sjabloondata(
                sjabloonId = xentialDocumentProperties.templateId.toString(),
                bestandsFormaat = Sjabloondata.BestandsFormaat.valueOf(xentialDocumentProperties.fileFormat.name),
                documentkenmerk = xentialDocumentProperties.documentId,
                sjabloonVulData = sjabloonVulData
            )
        )
        logger.info { "found something: $result" }
        val xentialToken = XentialToken(
            token = UUID.fromString(result.documentCreatieSessieId),
            processId = processId,
            messageName = xentialDocumentProperties.messageName,
            resumeUrl = result.resumeUrl.toString()
        )

        logger.info { "token: ${xentialToken.token}" }
        xentialTokenRepository.save(xentialToken)

        val toWizard = if (execution.hasVariable("testWizard")) {
            execution.getVariable("testWizard")
        } else null

        if (toWizard?.equals("JA") == true) {
            execution.setVariable("xentialStatus", "ONVOLTOOID")
        } else {
            execution.setVariable("xentialStatus", result.status)
        }
        result.resumeUrl?.let {
            execution.setVariable("resumeUrl", it)
        }
        logger.info { "ready" }
    }

    private fun generateXml(
        map: MutableMap<String, Any>
    ): String {
        val verzendadres = map["verzendAdres"] as Map<*, *>
        val colofon = map["verzendAdres"] as Map<*, *>
        val documentDetails = map["verzendAdres"] as Map<*, *>

        return """
                <root>
                    <verzendAdres>
                        ${verzendadres.map { "<${it.key}>${it.value}</${it.key}>" }.joinToString()}
                    </verzendAdres>
                    <colofon>
                        ${colofon.map { "<${it.key}>${it.value}</${it.key}>" }.joinToString()}
                    </colofon>
                    <documentDetails>
                        ${documentDetails.map { "<${it.key}>${it.value}</${it.key}>" }.joinToString()}
                    </documentDetails>
                </root>
                """
    }

    fun onDocumentGenerated(message: DocumentCreatedMessage) {

        val bytes = Base64.getDecoder().decode(message.data)

        val xentialToken = xentialTokenRepository.findById(UUID.fromString(message.documentCreatieSessieId))
            .orElseThrow { NoSuchElementException("Could not find Xential Token ${message.documentCreatieSessieId}") }

        logger.info { "Retrieved content from Xential Callback, token: ${xentialToken.token}" }

        ByteArrayInputStream(bytes).use { inputStream ->
            val metadata =
                mapOf(MetadataType.FILE_NAME.key to "${xentialToken.processId}-${xentialToken.messageName}.tmp")
            val resourceId = temporaryResourceStorageService.store(inputStream, metadata)
            runtimeService.createMessageCorrelation(xentialToken.messageName)
                .processInstanceId(xentialToken.processId.toString())
                .setVariable("xentialResourceId", resourceId)
                .correlate()
        }
    }

    private fun resolveTemplateData(
        templateData: Array<TemplateDataEntry>,
        execution: DelegateExecution
    ): Map<String, Any?> {
        val placeHolderValueMap = valueResolverService.resolveValues(
            execution.processInstanceId,
            execution,
            templateData.map { it.value }.toList()
        )
        return templateData.associate { it.key to placeHolderValueMap.getOrDefault(it.value, null) }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
