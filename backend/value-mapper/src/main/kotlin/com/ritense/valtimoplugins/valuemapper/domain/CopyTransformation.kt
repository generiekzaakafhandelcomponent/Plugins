package com.ritense.valtimoplugins.valuemapper.domain

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.valtimo.contract.json.MapperSingleton

data class CopyTransformation(
    private val `when`: Any,
    private val then: Any? = null,
    private val skipCondition: String? = null
) : ValueMapperTransformation() {
    override fun canTransform(node: JsonNode): Boolean = `when` == mapper.convertValue(node)

    override fun transform(value: Any): Pair<Boolean, Any> {
        if (
            !skipCondition.isNullOrBlank() &&
            getSpelProcessor().isExpression(skipCondition)
        ) {
            val contextMap = mapOf("it" to value)
            if (getSpelProcessor(contextMap).process<Boolean>(skipCondition) == true) {
                return true to value
            } else return false to (then ?: value)
        }
        return false to (then ?: value)
    }

    companion object {
        private val mapper = MapperSingleton.get()
    }
}
