package com.ritense.valtimoplugins.valuemapper.domain

import com.fasterxml.jackson.databind.node.JsonNodeType
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class ValueMapperCommandTest()  {

    @Test
    fun `should create valid COPY command`() {
        // then
        assertDoesNotThrow {
            ValueMapperCommand(
                defaultValue = "Works",
                transformations = listOf(),
                sourcePointer = "/this/is/a/source/pointer",
                targetPointer = "/this/is/a/target"

            )
        }
    }

    @Test
    fun `should create valid CONVERT command`() {
        // then
        assertDoesNotThrow {
            ValueMapperCommand(
                operation = ValueMapperOperation.CONVERT,
                transformations = listOf(
                    TypeTransformation(
                        whenType = JsonNodeType.NUMBER,
                        thenType = "java.lang.String"
                    )
                ),
                sourcePointer = "/this/is/a/source/pointer",
                targetPointer = "/this/is/a/target"

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
                targetPointer = "/this/is/a/target"

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
                targetPointer = "2131283"

            )
        }
    }


    @Test
    fun `should fail when defaultValue is defined but transformations not`() {
        // then
        assertThrows<IllegalArgumentException> {
            ValueMapperCommand(
                defaultValue = "Works",
                sourcePointer = "/this/is/a/source/pointer",
                targetPointer = "/this/is/a/target"

            )
        }
    }
}
