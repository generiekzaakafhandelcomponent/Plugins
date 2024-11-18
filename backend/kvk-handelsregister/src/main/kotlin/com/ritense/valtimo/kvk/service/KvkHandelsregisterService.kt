package com.ritense.valtimo.kvk.service

import com.ritense.valtimo.kvk.client.KvkHandelsregisterClientConfig
import com.ritense.valtimo.kvk.client.SimpleKvkHandelsregisterClient
import com.ritense.valtimo.kvk.model.ZoekenDto
import javassist.NotFoundException
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.stereotype.Service

@Extension(ordinal = 1)
@Service
class KvkHandelsregisterService(
    private val kvkHandelsregisterClient: SimpleKvkHandelsregisterClient
) : ExtensionPoint {

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