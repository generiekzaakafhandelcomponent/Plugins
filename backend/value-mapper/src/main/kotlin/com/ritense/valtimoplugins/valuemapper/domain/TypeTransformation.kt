package com.ritense.valtimoplugins.valuemapper.domain

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.JsonNodeType
import com.ritense.valtimo.contract.json.MapperSingleton
import io.github.oshai.kotlinlogging.KotlinLogging

data class TypeTransformation(
    private val whenType: JsonNodeType,
    private val thenType: String
) : ValueMapperTransformation() {
    val thenClazz: Class<*> = Class.forName(thenType)

    override fun canTransform(node: JsonNode): Boolean = whenType == node.nodeType

    override fun transform(value: Any): Pair<Boolean, Any> {
        logger.debug {
            "Attempting to convert $whenType value to ${thenClazz.simpleName}"
        }
        return false to mapper.convertValue(value, thenClazz)
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val mapper = MapperSingleton.get()
    }
}
