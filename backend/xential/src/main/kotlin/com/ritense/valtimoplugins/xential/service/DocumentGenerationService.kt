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
import com.ritense.valtimoplugins.xential.domain.DocumentCreatedMessage
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.valtimoplugins.xential.domain.XentialToken
import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import com.rotterdam.esb.xential.api.DefaultApi
import com.rotterdam.esb.xential.model.Sjabloondata
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.io.ByteArrayInputStream
import java.util.Base64
import java.util.UUID

class DocumentGenerationService(
    private val xentialTokenRepository: XentialTokenRepository,
    private val temporaryResourceStorageService: TemporaryResourceStorageService,
    private val runtimeService: RuntimeService,
) {
    fun generateDocument(
        api: DefaultApi,
        processId: UUID,
        xentialGebruikersId: String,
        sjabloonId: String,
        xentialDocumentProperties: XentialDocumentProperties,
        execution: DelegateExecution,
    ) {
        logger.info { "generating xential document" }

        val result =
            api.creeerDocument(
                gebruikersId = xentialGebruikersId,
                accepteerOnbekend = false,
                sjabloondata =
                    Sjabloondata(
                        sjabloonId = sjabloonId,
                        bestandsFormaat = Sjabloondata.BestandsFormaat.valueOf(xentialDocumentProperties.fileFormat.name),
                        documentkenmerk = xentialDocumentProperties.documentId,
                        sjabloonVulData = xentialDocumentProperties.content.toString(),
                    ),
            )
        logger.info { "found something: $result" }
        val xentialToken =
            XentialToken(
                token = UUID.fromString(result.documentCreatieSessieId),
                processId = processId,
                messageName = xentialDocumentProperties.messageName,
                resumeUrl = result.resumeUrl.toString(),
            )

        logger.info { "token: ${xentialToken.token}" }
        xentialTokenRepository.save(xentialToken)

        execution.setVariable("xentialStatus", result.status)

        result.resumeUrl?.let {
            execution.setVariable("resumeUrl", it)
        }
        logger.info { "ready" }
    }

    fun onDocumentGenerated(message: DocumentCreatedMessage) {
        val bytes = Base64.getDecoder().decode(message.data)

        val xentialToken =
            xentialTokenRepository.findById(UUID.fromString(message.documentCreatieSessieId))
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

//    private fun resolveTemplateData(
//        templateData: Array<TemplateDataEntry>,
//        execution: DelegateExecution
//    ): Map<String, Any?> {
//        val placeHolderValueMap = valueResolverService.resolveValues(
//            execution.processInstanceId,
//            execution,
//            templateData.map { it.value }.toList()
//        )
//        return templateData.associate { it.key to placeHolderValueMap.getOrDefault(it.value, null) }
//    }
//
    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
