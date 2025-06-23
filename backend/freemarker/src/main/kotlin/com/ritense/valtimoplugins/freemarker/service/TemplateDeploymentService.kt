/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.model.TemplateDeploymentMetadata
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.IOException
import java.io.InputStream
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.event.EventListener
import org.springframework.core.annotation.Order
import org.springframework.core.io.Resource
import org.springframework.core.io.ResourceLoader
import org.springframework.core.io.support.ResourcePatternUtils
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@SkipComponentScan
@Transactional
class TemplateDeploymentService(
    private val resourceLoader: ResourceLoader,
    private val templateService: TemplateService,
    private val objectMapper: ObjectMapper,
) {

    @Order(-1)
    @EventListener(ApplicationReadyEvent::class)
    fun deployTemplates() {
        logger.info { "Deploying all templates from $PATH" }
        loadResources().forEach { resource ->
            deploy(requireNotNull(resource.filename), resource.inputStream)
        }
    }

    fun deploy(fileName: String, fileContent: InputStream) {
        try {
            logger.info { "Deploying template from file '${fileName}'" }
            val template = objectMapper.readValue<TemplateDeploymentMetadata>(fileContent)
            require(template.content != null || template.contentRef != null)
            val content = template.content
                ?: this::class.java.getResource(template.contentRef!!)!!.readText()

            templateService.saveTemplate(
                templateKey = template.templateKey,
                caseDefinitionName = template.caseDefinitionName,
                templateType = template.templateType,
                metadata = template.metadata ?: emptyMap(),
                content = content
            )
        } catch (e: Exception) {
            throw IllegalStateException("Error while deploying template $fileName", e)
        }
    }

    @Cacheable(value = [TEMPLATE_EXISTS_CACHE_NAME], key = "{ #template.key, #template.caseDefinitionName, #template.type }")
    fun deploymentFileExists(
        template: ValtimoTemplate
    ) = deploymentFileExists(template.key, template.caseDefinitionName, template.type)

    @Cacheable(value = [TEMPLATE_EXISTS_CACHE_NAME], key = "{ #templateKey, #caseDefinitionName, #templateType }")
    fun deploymentFileExists(
        templateKey: String,
        caseDefinitionName: String?,
        templateType: String
    ): Boolean {
        return loadResources().any { resource ->
            val template = objectMapper.readValue<TemplateDeploymentMetadata>(resource.inputStream)
            template.templateKey == templateKey && template.caseDefinitionName == caseDefinitionName
        }
    }

    // Note: This function is slow. It will scan through the entire jar including jars from dependencies for a '*.template.json'
    @Throws(IOException::class)
    private fun loadResources(): Array<Resource> {
        return ResourcePatternUtils.getResourcePatternResolver(resourceLoader)
            .getResources(PATH)
    }

    companion object {
        private val logger: KLogger = KotlinLogging.logger {}
        const val PATH = "classpath*:**/*.template.json"
        private const val TEMPLATE_EXISTS_CACHE_NAME = "template.exists"
    }
}
