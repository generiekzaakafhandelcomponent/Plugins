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

import com.fasterxml.jackson.databind.node.JsonNodeType
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class ValueMapperCommandTest {
    @Test
    fun `should create valid COPY command`() {
        // then
        assertDoesNotThrow {
            ValueMapperCommand(
                defaultValue = "Works",
                sourcePointer = "/this/is/a/source/pointer",
                targetPointer = "/this/is/a/target",
            )
        }
    }

    @Test
    fun `should create valid CONVERT command`() {
        // then
        assertDoesNotThrow {
            ValueMapperCommand(
                operation = ValueMapperOperation.CONVERT,
                transformations =
                    listOf(
                        TypeTransformation(
                            whenType = JsonNodeType.NUMBER,
                            thenType = "java.lang.String",
                        ),
                    ),
                sourcePointer = "/this/is/a/source/pointer",
                targetPointer = "/this/is/a/target",
            )
        }
    }

    @Test
    fun `should fail when sourcePointer is invalid`() {
        // then
        assertThrows<IllegalArgumentException> {
            ValueMapperCommand(
                defaultValue = "Works",
                transformations = listOf(),
                sourcePointer = "Blade",
                targetPointer = "/this/is/a/target",
            )
        }
    }

    @Test
    fun `should fail when targetPointer is invalid`() {
        // then
        assertThrows<IllegalArgumentException> {
            ValueMapperCommand(
                defaultValue = "Works",
                transformations = listOf(),
                sourcePointer = "/this/is/a/source/pointer",
                targetPointer = "2131283",
            )
        }
    }

    @Test
    fun `should fail when skipCondition is defined for a CONVERT command`() {
        // then
        assertThrows<IllegalArgumentException> {
            ValueMapperCommand(
                skipCondition = "sourceValue == null",
                operation = ValueMapperOperation.CONVERT,
                sourcePointer = "/this/is/a/source/pointer",
                targetPointer = "/this/is/a/target",
            )
        }
    }
}
