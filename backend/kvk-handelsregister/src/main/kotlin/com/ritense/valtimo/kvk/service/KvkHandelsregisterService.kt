package com.ritense.valtimo.kvk.service

import com.ritense.valtimo.kvk.client.KvkHandelsregisterClientConfig
import com.ritense.valtimo.kvk.client.SimpleKvkHandelsregisterClient
import com.ritense.valtimo.kvk.model.ZoekenDto
import javassist.NotFoundException

class KvkHandelsregisterService(
    private val kvkHandelsregisterClient: SimpleKvkHandelsregisterClient
) {

    fun zoeken(clientConfig: KvkHandelsregisterClientConfig, kvkNumber: String): List<ZoekenDto> {
        val result = kvkHandelsregisterClient.search(kvkNumber, clientConfig)

        return if (result?.resultaten?.isNotEmpty() == true) {
            result.resultaten.map {
                ZoekenDto(
                    it.kvkNummer,
                    it.naam,
                    it.type
                )
            }
        } else {
            throw NotFoundException("no result found by kvk number")
        }
    }
}