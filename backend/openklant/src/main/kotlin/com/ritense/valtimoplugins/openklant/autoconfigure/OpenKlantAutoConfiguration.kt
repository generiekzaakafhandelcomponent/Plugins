package com.ritense.valtimoplugins.openklant.autoconfigure

import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimoplugins.openklant.client.OpenKlantClient
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.plugin.OpenKlantPluginFactory
import com.ritense.valtimoplugins.openklant.resolver.OpenKlantValueResolverFactory
import com.ritense.valtimoplugins.openklant.service.DefaultOpenKlantService
import com.ritense.valtimoplugins.openklant.service.KlantcontactFactory
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.service.PartijFactory
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
import com.ritense.zakenapi.service.ZaakDocumentService
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient
import java.net.URI

@Configuration
@EnableConfigurationProperties
class OpenKlantAutoConfiguration {
    @Bean
    fun openKlantPluginClient(
        openKlantWebClientBuilder: WebClient.Builder,
    ): OpenKlantClient =
        OpenKlantClient(openKlantWebClientBuilder)

    @Bean
    fun partijFactory(): PartijFactory = PartijFactory()

    @Bean
    fun klantContactFactory(): KlantcontactFactory = KlantcontactFactory()

    @Bean
    fun openKlantService(
        openKlantClient: OpenKlantClient,
        partijFactory: PartijFactory,
        klantContactFactory: KlantcontactFactory
    ): OpenKlantService =
        DefaultOpenKlantService(
            openKlantClient,
            partijFactory,
            klantContactFactory
        )

    @Bean
    fun openKlantPluginFactory(
        pluginService: PluginService,
        openKlantService: OpenKlantService,
        reflectionUtil: ReflectionUtil,
    ): OpenKlantPluginFactory =
        OpenKlantPluginFactory(
            pluginService,
            openKlantService,
            reflectionUtil,
        )

    @Bean
    fun openKlantValueResolverFactory(
        processDocumentService: ProcessDocumentService,
        zaakDocumentService: ZaakDocumentService,
        openKlantService: OpenKlantService,
        reflectionUtil: ReflectionUtil,
        @Value("\${AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_KLANTINTERACTIES_URL}")
        klantinteractieUrl: String,
        @Value("\${AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_AUTHORIZATION_TOKEN}")
        openKlantToken: String,
    ) = OpenKlantValueResolverFactory(
        processDocumentService,
        zaakDocumentService,
        openKlantService,
        reflectionUtil,
        OpenKlantProperties(URI.create(klantinteractieUrl), openKlantToken)
    )

    @Bean
    fun reflectionUtil() = ReflectionUtil()
}