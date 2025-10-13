package com.ritense.valtimoplugins.valuemapper.service

import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperDefinition
import com.ritense.valtimoplugins.valuemapper.exception.ValueMapperDefinitionLoadingException
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.transaction.Transactional
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.event.EventListener
import org.springframework.core.annotation.Order
import org.springframework.core.io.Resource
import org.springframework.core.io.ResourceLoader
import org.springframework.core.io.support.ResourcePatternUtils
import org.springframework.stereotype.Service
import java.io.IOException

@Transactional
@Service
class ValueMapperLoadingService(
    private val resourceLoader: ResourceLoader,
    private val valueMapperTemplateService: ValueMapperTemplateService
) {

    @Order(-1)
    @EventListener(ApplicationReadyEvent::class)
    fun importValueMappers() {
        logger.info { "Importing all ValueMappers from $PATH}" }
        loadResources().forEach { resource ->
            valueMapperTemplateService.saveUpdate(resource.getId(), String(resource.contentAsByteArray))
        }
    }

    fun loadDefinitions(): Map<String, ValueMapperDefinition> {
        logger.info { "Loading all Value Mapper definitions from $PATH" }
        val definitionResources = loadResources()

        try {
            return definitionResources
                .associate { resource ->
                    val resourceId = resource.getId().also {
                        logger.debug {
                            "Parsing Value Mapper definition: $it"
                        }
                    }

                    resourceId to ValueMapperDefinition(
                        definitionId = resourceId,
                        commands = mapper.readValue(resource.inputStream)
                    )
                }
        } catch (e: Exception) {
            throw ValueMapperDefinitionLoadingException("Failed to load Value Mapper definitions", e)
        }
    }

    @Cacheable(value = [VM_TEMPLATE_EXISTS_CACHE_NAME], key = "{ #key}")
    fun resourceExists(
        key: String
    ): Boolean {
        return loadResources().any { resource ->
            resource.getId() == key
        }
    }

    private fun Resource.getId(): String {
        return this
            .filename
            ?.substringBeforeLast(VALUE_MAPPER_DEFINITION_SUFFIX)
            ?: throw IOException("Could not extract filename from resource at ${this.uri}")

    }

    private fun loadResources(): Array<Resource> =
        ResourcePatternUtils
            .getResourcePatternResolver(resourceLoader)
            .getResources(PATH)
            .also {
                logger.debug { "Found ${it.size} definition(s)." }
            }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val mapper = MapperSingleton.get()
        const val VALUE_MAPPER_DEFINITION_SUFFIX = ".valuemapping.json"
        const val PATH = "classpath*:**/*.valuemapping.json"
        private const val VM_TEMPLATE_EXISTS_CACHE_NAME = "VM_template.exists"
    }
}
