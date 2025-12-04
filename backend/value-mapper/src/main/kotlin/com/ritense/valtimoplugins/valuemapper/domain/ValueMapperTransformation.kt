package com.ritense.valtimoplugins.valuemapper.domain

import SpelExpressionProcessor
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.JsonNode

@JsonTypeInfo(use = JsonTypeInfo.Id.DEDUCTION)
@JsonSubTypes(
    Type(CopyTransformation::class),
    Type(TypeTransformation::class)
)
open class ValueMapperTransformation {

    open fun canTransform(node: JsonNode): Boolean {

        TODO("Not implemented for base transformation")
    }

    open fun transform(value: Any): Pair<Boolean, Any> {

        TODO("Not implemented for base transformation")
    }

    open fun getSpelProcessor(contextMap: Map<String, Any> = emptyMap()) =
        SpelExpressionProcessor(contextMap = contextMap)
}
