package com.ritense.valtimoplugins.printstraat.client

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.printstraat.dto.PrintstraatBodyDto
import com.ritense.valtimoplugins.printstraat.dto.PrintstraatPluginDto
import com.ritense.valtimoplugins.printstraat.plugin.PrintstraatPlugin
import org.springframework.http.HttpStatus
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.reactive.function.client.WebClient

class PrintstraatWebClient(
    private val pluginService: PluginService
) : PrintstraatClient {

    override fun postDocumentToPrintstraat(printstraatBodyDto: PrintstraatBodyDto) {
        try {
            val printstraatPluginProperties = getPrintstraatConnectionData()

            WebClient.builder()
                .baseUrl(printstraatPluginProperties.url)
                .defaultHeader(API_KEY_HEADER_NAME, printstraatPluginProperties.token)
                .build()
                .post()
                .bodyValue(printstraatBodyDto)
                .retrieve()
                .toBodilessEntity()
                .block()
        } catch (e: Exception) {
            throw HttpServerErrorException(
                HttpStatus.BAD_REQUEST,
                "Request to Printstraat has failed. Error message '$e'"
            )
        }
    }

    private fun getPrintstraatConnectionData(): PrintstraatPluginDto {
        val printstraatPluginInstance = pluginService
            .createInstance(PrintstraatPlugin::class.java) { true }

        requireNotNull(printstraatPluginInstance) { "No plugin found" }

        return PrintstraatPluginDto(
            url = printstraatPluginInstance.url.toString(),
            token = printstraatPluginInstance.token
        )
    }

    companion object {
        private const val API_KEY_HEADER_NAME = "X-OPENTUNNEL-API-KEY"
    }
}
