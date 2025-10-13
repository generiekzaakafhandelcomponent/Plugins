package com.ritense.valtimoplugins.valuemapper.domain

data class ValueMapperDefinition(
    val definitionId: String,
    val commands: List<ValueMapperCommand> = emptyList()
)
