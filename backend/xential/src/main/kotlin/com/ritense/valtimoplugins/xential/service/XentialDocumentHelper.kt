/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.zakenapi.service.ZaakDocumentService
import org.operaton.bpm.engine.delegate.DelegateExecution
import com.ritense.documentenapi.web.rest.dto.DocumentSearchRequest
import com.ritense.valtimoplugins.xential.domain.FileFormat
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin.Companion
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import java.util.UUID

@Suppress("UNUSED")
class XentialDocumentHelper(
    private val zaakDocumentService: ZaakDocumentService,
    private val objectMapper: ObjectMapper
) {
    fun nextDocument(
        execution: DelegateExecution,
        documentPropertiesMap: MutableMap<String, Any>,
    ) {
        val documentProperties: XentialDocumentProperties = objectMapper.convertValue(documentPropertiesMap)

        val docs = zaakDocumentService.getInformatieObjectenAsRelatedFilesPage(
            UUID.fromString(execution.processBusinessKey),
            DocumentSearchRequest(),
            PageRequest.of(0, 1000)
        )

        val over = docs.filter {
            it.bestandsnaam == documentProperties.informationObjectType
        }.toList()

        val extention = if (documentProperties.fileFormat.equals(FileFormat.WORD)) {
            "docx"
        } else {
            "pdf"
        }
        documentPropertiesMap["documentFilename"] = "${documentProperties.documentFilename}-${over.size + 1}.$extention"
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
