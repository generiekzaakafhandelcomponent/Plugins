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
package com.ritense.valtimo.printstraat.store.document

import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.annotation.ProcessBean
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.stereotype.Service
import org.springframework.core.io.ResourceLoader
import org.springframework.core.io.support.ResourcePatternUtils


@Service
@ProcessBean
class StoreDocumentService(
    private val temporaryResourceStorageService: TemporaryResourceStorageService, val resourceLoader: ResourceLoader
) {

    fun storeDocumentInTempStorage(execution: DelegateExecution) {
        val resource = ResourcePatternUtils.getResourcePatternResolver(resourceLoader)
            .getResource("classpath:dummy.pdf")
        resource.file.readBytes().inputStream()
        val tempStorageResourceId = temporaryResourceStorageService.store(
            resource.file.readBytes().inputStream(), mapOf(
                MetadataType.FILE_NAME.key to "dummy.pdf"
            )
        )
        execution.setVariable("printstraatTemporaryFileId", tempStorageResourceId)
        execution.setVariable("printstraatZaaknummer", "nummer 1")
    }
}