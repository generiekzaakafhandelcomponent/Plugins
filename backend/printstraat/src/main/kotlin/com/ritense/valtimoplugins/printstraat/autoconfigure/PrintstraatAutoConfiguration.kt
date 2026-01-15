package com.ritense.valtimoplugins.printstraat.autoconfigure

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.documentenapi.service.DocumentenApiService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.printstraat.client.PrintstraatClient
import com.ritense.valtimoplugins.printstraat.client.PrintstraatRestClient
import com.ritense.valtimoplugins.printstraat.plugin.PrintstraatPluginFactory
import com.ritense.valtimoplugins.printstraat.service.PrintstraatService
import com.ritense.zakenapi.service.ZaakDocumentService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PrintstraatAutoConfiguration {

    @Bean
    fun printstraatClient(pluginService: PluginService) = PrintstraatRestClient(pluginService = pluginService)

    @Bean
    fun printstraatService(
        printstraatClient: PrintstraatClient,
        documentenApiService: DocumentenApiService,
        objectMapper: ObjectMapper,
        zaakDocumentService: ZaakDocumentService
    ): PrintstraatService = PrintstraatService(
        printstraatClient = printstraatClient,
        zaakDocumentService = zaakDocumentService,
        documentenApiService = documentenApiService,
        objectMapper = objectMapper,
    )

    @Bean
    fun printstraatPluginFactory(
        pluginService: PluginService,
        printstraatService: PrintstraatService
    ) = PrintstraatPluginFactory(
        pluginService,
        printstraatService,
    )
}
