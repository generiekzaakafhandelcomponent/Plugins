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