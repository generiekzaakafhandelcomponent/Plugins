package com.ritense.valtimoplugins.printstraat.client

import com.ritense.valtimoplugins.printstraat.dto.PrintstraatBodyDto
import io.github.oshai.kotlinlogging.KotlinLogging

class NoopPrintstraatClient : PrintstraatClient {
    override fun postDocumentToPrintstraat(printstraatBodyDto: PrintstraatBodyDto) {
        log.info { "No-op action on PrintstraatClient.postDocumentToPrintstraat" }
    }

    companion object {
        private val log = KotlinLogging.logger {}
    }
}
