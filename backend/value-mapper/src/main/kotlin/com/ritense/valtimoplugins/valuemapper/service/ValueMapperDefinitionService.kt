package com.ritense.valtimoplugins.valuemapper.service

import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperDefinition

class ValueMapperDefinitionService(
    valueMapperLoadingService: ValueMapperLoadingService
) {
    private var definitions: Map<String, ValueMapperDefinition> = emptyMap()

    init {
        definitions = valueMapperLoadingService.loadDefinitions()
    }

    fun getDefinitions(): Map<String, ValueMapperDefinition> = definitions
}
