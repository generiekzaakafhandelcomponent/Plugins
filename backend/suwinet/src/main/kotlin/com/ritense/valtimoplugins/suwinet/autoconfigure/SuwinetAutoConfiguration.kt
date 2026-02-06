package com.ritense.valtimoplugins.suwinet.autoconfigure

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.service.UwvCodeService
import com.ritense.valtimoplugins.suwinet.service.UwvSoortIkvService
import com.ritense.valtimo.contract.annotation.ProcessBean
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.plugin.SuwiNetPluginFactory
import com.ritense.valtimoplugins.suwinet.service.CodesUitkeringsperiodeService
import com.ritense.valtimoplugins.suwinet.service.DateTimeService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDocumentWriterService
import com.ritense.valtimoplugins.suwinet.service.NationaliteitenService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBijstandsregelingenService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpStoreToDocService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoStudiefinancieringInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetKadasterInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetRdwService
import com.ritense.valtimoplugins.suwinet.service.SuwinetSvbPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetUwvPersoonsIkvService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SuwinetAutoConfiguration {


    @Bean
    @ProcessBean
    fun suwinetDocumentWriterService(
        documentService: DocumentService
    ): SuwinetDocumentWriterService {
        return SuwinetDocumentWriterService(
            documentService
        )
    }

    @Bean
    fun suwinetSOAPClient(): SuwinetSOAPClient {
        return SuwinetSOAPClient()
    }

    @Bean
    fun dynamicResponseFactory(objectMapper: ObjectMapper): DynamicResponseFactory {
        return DynamicResponseFactory(objectMapper)
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
        dynamicResponseFactory: DynamicResponseFactory
    ): SuwinetBrpInfoService {
        return SuwinetBrpInfoService(
            suwinetSOAPClient,
            nationaliteitenService(),
            DateTimeService(),
            dynamicResponseFactory
        )
    }

    @Bean
    @ProcessBean
    fun suwinetRdwService(
        suwinetSOAPClient: SuwinetSOAPClient,
        dynamicResponseFactory: DynamicResponseFactory
    ): SuwinetRdwService {
        return SuwinetRdwService(
            suwinetSOAPClient,
            dynamicResponseFactory
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
    fun uwvCodeService() : UwvCodeService {
        return UwvCodeService()
    }

    @Bean
    @ProcessBean
    fun uwvSoortIkvService() : UwvSoortIkvService {
        return UwvSoortIkvService()
    }

    @Bean
    @ProcessBean
    fun suwinetUwvPersoonsIkvService(
        suwinetSOAPClient: SuwinetSOAPClient,
        dateTimeService: DateTimeService,
        uwvCodeService: UwvCodeService,
        uwvSoortIkvService: UwvSoortIkvService
    ): SuwinetUwvPersoonsIkvService {
        return SuwinetUwvPersoonsIkvService(
            suwinetSOAPClient,
            dateTimeService,
            uwvCodeService,
            uwvSoortIkvService
        )
    }

    @Bean
    @ProcessBean
    fun suwinetKadasterInfoService(
        suwinetSOAPClient: SuwinetSOAPClient,
    ): SuwinetKadasterInfoService {
        return SuwinetKadasterInfoService(
            suwinetSOAPClient
        )
    }

    @Bean
    @ProcessBean
    fun suwinetBrpStoreToDocService(
        suwinetDocumentWriterService: SuwinetDocumentWriterService,
        documentService: DocumentService,
        @Value("\${implementation.suwinet.maxAgeKindAlsThuiswonend:99}") maxAgeKindAlsThuiswonend: Int
    ): SuwinetBrpStoreToDocService {
        return SuwinetBrpStoreToDocService(
            suwinetDocumentWriterService,
            documentService,
            DateTimeService(),
            maxAgeKindAlsThuiswonend
        )
    }

    @Bean
    @ProcessBean
    fun suwinetBijstandsRegelingenInfoService(
        suwinetSOAPClient: SuwinetSOAPClient,
        dynamicResponseFactory: DynamicResponseFactory,
        dateTimeService: DateTimeService,
    ): SuwinetBijstandsregelingenService {
        return SuwinetBijstandsregelingenService(
            suwinetSOAPClient,
            dynamicResponseFactory,
            dateTimeService,
        )
    }

    @Bean
    fun suwiNetPluginFactory(
        pluginService: PluginService,
        suwinetBrpInfoService: SuwinetBrpInfoService,
        suwinetRdwService: SuwinetRdwService,
        suwinetDuoPersoonsInfoService: SuwinetDuoPersoonsInfoService,
        suwinetDuoStudiefinancieringInfoService: SuwinetDuoStudiefinancieringInfoService,
        suwinetSvbPersoonsInfoService: SuwinetSvbPersoonsInfoService,
        suwinetUwvPersoonsIkvService: SuwinetUwvPersoonsIkvService,
        suwinetKadasterInfoService: SuwinetKadasterInfoService,
        suwinetBijstandsregelingenService: SuwinetBijstandsregelingenService
    ): SuwiNetPluginFactory = SuwiNetPluginFactory(
        pluginService,
        suwinetBrpInfoService,
        suwinetDuoPersoonsInfoService,
        suwinetDuoStudiefinancieringInfoService,
        suwinetKadasterInfoService,
        suwinetRdwService,
        suwinetSvbPersoonsInfoService,
        suwinetUwvPersoonsIkvService,
        suwinetBijstandsregelingenService
    )
}
