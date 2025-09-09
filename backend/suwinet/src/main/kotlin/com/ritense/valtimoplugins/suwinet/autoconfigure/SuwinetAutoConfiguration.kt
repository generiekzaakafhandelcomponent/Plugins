package com.ritense.valtimoplugins.suwinet.autoconfigure

import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.annotation.ProcessBean
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.plugin.SuwiNetPluginFactory
import com.ritense.valtimoplugins.suwinet.service.CodesUitkeringsperiodeService
import com.ritense.valtimoplugins.suwinet.service.DateTimeService
import com.ritense.valtimoplugins.suwinet.service.DocumentWriterService
import com.ritense.valtimoplugins.suwinet.service.NationaliteitenService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpStoreToDocService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoStudiefinancieringInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetRdwService
import com.ritense.valtimoplugins.suwinet.service.SuwinetSvbPersoonsInfoService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SuwinetAutoConfiguration {


    @Bean
    @ProcessBean
    fun documentWriterService(
        documentService: DocumentService
    ): DocumentWriterService {
        return DocumentWriterService(
            documentService
        )
    }

    @Bean
    fun suwinetSOAPClient(): SuwinetSOAPClient {
        return SuwinetSOAPClient()
    }

    @Bean
    @ProcessBean
    fun dateTimeService(): DateTimeService {
        return DateTimeService()
    }

    @Bean
    fun nationaliteitenService(): NationaliteitenService {
        return NationaliteitenService()
    }

    @Bean
    fun codesUitkeringsService(): CodesUitkeringsperiodeService {
        return CodesUitkeringsperiodeService()
    }

    @Bean
    @ProcessBean
    fun suwinetBrpInfoService(
        suwinetSOAPClient: SuwinetSOAPClient,
    ): SuwinetBrpInfoService {
        return SuwinetBrpInfoService(
            suwinetSOAPClient,
            nationaliteitenService(),
            DateTimeService(),
        )
    }

    @Bean
    @ProcessBean
    fun suwinetRdwService(
        suwinetSOAPClient: SuwinetSOAPClient,
    ): SuwinetRdwService {
        return SuwinetRdwService(
            suwinetSOAPClient
        )
    }

    @Bean
    @ProcessBean
    fun suwinetDUOPersoonsInfoService(
        suwinetSOAPClient: SuwinetSOAPClient
    ): SuwinetDuoPersoonsInfoService {
        return SuwinetDuoPersoonsInfoService(suwinetSOAPClient)
    }

    @Bean
    @ProcessBean
    fun suwinetDuoStudiefinancieringInfoService(
        suwinetSOAPClient: SuwinetSOAPClient
    ): SuwinetDuoStudiefinancieringInfoService {
        return SuwinetDuoStudiefinancieringInfoService(suwinetSOAPClient)
    }

    @Bean
    @ProcessBean
    fun suwinetSvbPersoonsInfoService(
        suwinetSOAPClient: SuwinetSOAPClient,
        codesUitkeringsPeriodeService: CodesUitkeringsperiodeService
    ): SuwinetSvbPersoonsInfoService {
        return SuwinetSvbPersoonsInfoService(suwinetSOAPClient, codesUitkeringsPeriodeService)
    }


    @Bean
    @ProcessBean
    fun suwinetBrpStoreToDocService(
        documentWriterService: DocumentWriterService,
        documentService: DocumentService,
        @Value("\${implementation.suwinet.maxAgeKindAlsThuiswonend: }") maxAgeKindAlsThuiswonend: Int
    ): SuwinetBrpStoreToDocService {
        return SuwinetBrpStoreToDocService(
            documentWriterService,
            documentService,
            DateTimeService(),
            maxAgeKindAlsThuiswonend
        )
    }

    @Bean
    fun suwiNetPluginFactory(
        pluginService: PluginService,
        suwinetBrpInfoService: SuwinetBrpInfoService,
        suwinetRdwService: SuwinetRdwService,
        suwinetDuoPersoonsInfoService: SuwinetDuoPersoonsInfoService,
        suwinetDuoStudiefinancieringInfoService: SuwinetDuoStudiefinancieringInfoService,
        suwinetSvbPersoonsInfoService: SuwinetSvbPersoonsInfoService
    ): SuwiNetPluginFactory = SuwiNetPluginFactory(
        pluginService,
        suwinetBrpInfoService,
        suwinetRdwService,
        suwinetDuoPersoonsInfoService,
        suwinetDuoStudiefinancieringInfoService,
        suwinetSvbPersoonsInfoService
    )
}
