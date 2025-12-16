/*
 * Copyright 2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.valuemapper.domain

import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperOperation.CONVERT
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperOperation.COPY

data class ValueMapperCommand(
    val defaultValue: Any? = null,
    val operation: ValueMapperOperation = COPY,
    val transformations: List<ValueMapperTransformation>? = null,
    val sourcePointer: String,
    val targetPointer: String,
    val skipCondition: String? = null,
) {
    init {
        require(sourcePointer.startsWith("/")) {
            "Source pointer [$sourcePointer] must start with /"
        }
        require(targetPointer.startsWith("/")) {
            "Target pointer [$targetPointer] must start with /"
        }

        when (operation) {
            CONVERT -> {
                require(
                    transformations != null &&
                        transformations.all { it is TypeTransformation } &&
                        transformations.size == 1,
                ) {
                    "Exactly one transformation is required when using CONVERT operation"
                }
                require(skipCondition == null) {
                    "Skip Conditions are not allowed when using CONVERT operation"
                }
            }

            COPY ->
                require(transformations?.all { it is CopyTransformation } ?: true) {
                    "transformations array must only contain ValueTransformations"
                }
        }
        if (defaultValue != null) {
            requireNotNull(transformations) {
                "defaultValue can only be used in combination with transformations"
            }
        }
    }
}
