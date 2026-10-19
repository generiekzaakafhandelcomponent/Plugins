/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.publictask.autoconfiguration

import com.ritense.form.service.impl.DefaultFormSubmissionService
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.service.ProcessLinkActivityService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.annotation.ProcessBean
import com.ritense.valtimo.contract.upload.ValtimoUploadProperties
import com.ritense.valtimoplugins.publictask.config.PublicTaskSecurityConfigurer
import com.ritense.valtimoplugins.publictask.domain.PublicTaskBaseUrl
import com.ritense.valtimoplugins.publictask.htmlrenderer.config.FreemarkerConfig
import com.ritense.valtimoplugins.publictask.htmlrenderer.service.HtmlRenderService
import com.ritense.valtimoplugins.publictask.plugin.PublicTaskPluginFactory
import com.ritense.valtimoplugins.publictask.repository.PublicTaskRepository
import com.ritense.valtimoplugins.publictask.service.PublicTaskService
import com.ritense.valtimoplugins.publictask.web.rest.PublicTaskResource
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.RuntimeService
import org.springframework.beans.factory.ObjectProvider
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.autoconfigure.web.servlet.MultipartProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@EnableJpaRepositories(basePackages = ["com.ritense.valtimoplugins.publictask.repository"])
@EntityScan("com.ritense.valtimoplugins.publictask.domain")
class PublicTaskAutoConfiguration {
    @Bean
    fun freemarkerConfig() = FreemarkerConfig()

    @Bean
    fun htmlRenderService(freemarkerConfig: FreemarkerConfig): HtmlRenderService =
        HtmlRenderService(
            freemarkerConfig = freemarkerConfig,
        )

    @Bean
    @ProcessBean
    fun publicTaskService(
        publicTaskRepository: PublicTaskRepository,
        runtimeService: RuntimeService,
        processLinkActivityService: ProcessLinkActivityService,
        htmlRenderService: HtmlRenderService,
        defaultFormSubmissionService: DefaultFormSubmissionService,
        temporaryResourceStorageService: TemporaryResourceStorageService,
        multipartProperties: ObjectProvider<MultipartProperties>,
        uploadProperties: ObjectProvider<ValtimoUploadProperties>,
        @Value("\${valtimo.app.scheme:https}") scheme: String,
        @Value("\${valtimo.app.hostname:}") hostname: String,
        @Value("\${valtimo.url:}") valtimoUrl: String,
    ): PublicTaskService {
        warnWhenAnyFileTypeIsAccepted(uploadProperties)
        return PublicTaskService(
            publicTaskRepository = publicTaskRepository,
            runtimeService = runtimeService,
            processLinkActivityService = processLinkActivityService,
            htmlRenderService = htmlRenderService,
            defaultFormSubmissionService = defaultFormSubmissionService,
            temporaryResourceStorageService = temporaryResourceStorageService,
            fallbackBaseUrl = fallbackBaseUrl(valtimoUrl, hostname, scheme),
            applicationMaxFileSizeInBytes = getSpringServletMultipartMaxFileSize(multipartProperties),
        )
    }

    private fun fallbackBaseUrl(
        valtimoUrl: String,
        hostname: String,
        scheme: String,
    ): String? =
        try {
            PublicTaskBaseUrl.of(valtimoUrl, scheme) ?: PublicTaskBaseUrl.of(hostname, scheme)
        } catch (e: IllegalArgumentException) {
            logger.warn(e) {
                "Public task URLs cannot start with what 'valtimo.url' or 'valtimo.app.hostname' holds. Fill in " +
                    "the URL of this environment in the Public Task plugin configuration instead."
            }
            null
        }

    /** `spring.servlet.multipart.max-file-size` */
    private fun getSpringServletMultipartMaxFileSize(multipartProperties: ObjectProvider<MultipartProperties>): Long? =
        multipartProperties
            .getIfAvailable()
            ?.maxFileSize
            ?.toBytes()
            ?.takeIf { it > 0 }

    private fun warnWhenAnyFileTypeIsAccepted(uploadProperties: ObjectProvider<ValtimoUploadProperties>) {
        if (uploadProperties.getIfAvailable()?.acceptedMimeTypes.isNullOrEmpty()) {
            logger.warn {
                "Valtimo accepts every file type, because 'valtimo.upload.accepted-mime-types' is not set. The " +
                    "public task upload endpoint is open by design, so set it, or set the accepted mime types of " +
                    "the Create Public Task process links that have upload fields, to the types the process " +
                    "actually needs."
            }
        }
    }

    @Bean
    @ConditionalOnMissingBean(PublicTaskResource::class)
    fun publicTaskResource(publicTaskService: PublicTaskService): PublicTaskResource =
        PublicTaskResource(publicTaskService = publicTaskService)

    @Bean
    @Order(270)
    @ConditionalOnMissingBean(PublicTaskSecurityConfigurer::class)
    fun publicTaskSecurityConfigurer(): PublicTaskSecurityConfigurer = PublicTaskSecurityConfigurer()

    @Bean
    fun publicTaskPluginFactory(
        pluginService: PluginService,
        publicTaskService: PublicTaskService,
        valueResolverService: ValueResolverService,
    ): PublicTaskPluginFactory =
        PublicTaskPluginFactory(
            pluginService = pluginService,
            publicTaskService = publicTaskService,
            valueResolverService = valueResolverService,
        )

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
