package com.ritense.valtimoplugins.valuemapper.domain

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.JsonNode

@JsonTypeInfo(use = JsonTypeInfo.Id.DEDUCTION)
@JsonSubTypes(
    Type(ValueTransformation::class),
    Type(TypeTransformation::class)
)
open class ValueMapperTransformation {

    open fun canTransform(node: JsonNode): Boolean {

        TODO("Not implemented for base transformation")
    }

    open fun transform(value: Any): Any {

        TODO("Not implemented for base transformation")
    }
}
