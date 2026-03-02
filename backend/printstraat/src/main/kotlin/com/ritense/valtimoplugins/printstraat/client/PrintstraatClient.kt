package com.ritense.valtimoplugins.printstraat.client

import com.ritense.valtimoplugins.printstraat.dto.PrintstraatBodyDto

interface PrintstraatClient {

    fun postDocumentToPrintstraat(
        printstraatBodyDto: PrintstraatBodyDto
    )
}
