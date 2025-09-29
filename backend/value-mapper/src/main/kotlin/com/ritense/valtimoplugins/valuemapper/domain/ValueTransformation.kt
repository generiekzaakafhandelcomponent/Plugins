package com.ritense.valtimoplugins.valuemapper.domain

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.valtimo.contract.json.MapperSingleton

data class ValueTransformation(
    private val `when`: Any,
    private val then: Any
) : ValueMapperTransformation() {
    override fun canTransform(node: JsonNode): Boolean = `when` == mapper.convertValue(node)

    override fun transform(value: Any): Any {
        return then
    }

    companion object {
        private val mapper = MapperSingleton.get()
    }
}
