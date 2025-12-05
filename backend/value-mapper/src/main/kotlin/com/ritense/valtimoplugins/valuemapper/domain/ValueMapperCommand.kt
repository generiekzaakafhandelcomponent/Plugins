package com.ritense.valtimoplugins.valuemapper.domain

import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperOperation.CONVERT
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperOperation.COPY

data class ValueMapperCommand(
    val defaultValue: Any? = null,
    val operation: ValueMapperOperation = COPY,
    val transformations: List<ValueMapperTransformation>? = null,
    val sourcePointer: String,
    val targetPointer: String,
) {
    init {
        require(sourcePointer.startsWith("/")) {
            "Source pointer [$sourcePointer] must start with /"
        }
        require(targetPointer.startsWith("/")) {
            "Target pointer [$targetPointer] must start with /"
        }

        when (operation) {
            CONVERT -> require(
                transformations != null &&
                    transformations.all { it is TypeTransformation } &&
                    transformations.size == 1
            ) {
                "Exactly one transformation is required when using CONVERT operation"
            }

            COPY -> require(transformations?.all { it is CopyTransformation } ?: true) {
                "transformations array must only contain ValueTransformations"
            }
        }
        if (defaultValue != null) requireNotNull(transformations) {
            "defaultValue can only be used in combination with transformations"
        }
    }
}
