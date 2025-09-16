package com.ritense.valtimoplugins.valuemapper

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.document.domain.Document
import com.ritense.document.service.DocumentService
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperDefinition
import com.ritense.valtimoplugins.valuemapper.exception.ValueMapperCommandException

import com.ritense.valtimoplugins.valuemapper.service.ValueMapperDefinitionService

import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Answers
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import kotlin.test.assertEquals

@ExtendWith(MockitoExtension::class)
class ValueMapperTest {

    @Mock
    lateinit var documentService: DocumentService

    @Mock
    lateinit var valueMapperDefinitionService: ValueMapperDefinitionService

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    lateinit var document: Document

    private lateinit var valueMapper: ValueMapper

    @BeforeEach
    fun setUp() {
        valueMapper = ValueMapper(valueMapperDefinitionService, documentService)
    }

    @Test
    fun `should skip commands with no value at pointer`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject("no-value-no-default", emptyMap())
        )

        // then
        assert(mappingResult.isEmpty)
    }

    @Test
    fun `should apply default when no transformation is found for given value`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject("test-v1", mapOf("persoonsgegevens" to mapOf("voornamen" to "Anna")))
        )

        // then
        assertEquals("Anonymous", mappingResult.at("/persoon/voornaam").textValue())
    }

    @Test
    fun `should not modify document if no commands were applied`() {
        // given
        whenever(documentService.get(any())).thenReturn(document)
        whenever(document.content().asJson()).thenReturn(mapper.createObjectNode())
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // then
        assertDoesNotThrow {
            valueMapper.applyToDocument("no-value-no-default", document.id().toString())
        }
        verify(documentService, times(0)).modifyDocument(any(), any())
    }

    @Test
    fun `should return unmodified object if no commands were applied`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)
        val inputObject = mapOf(
            "adres" to mapOf(
                "plaats" to "Amsterdam"
            )
        )

        // then
        val result = assertDoesNotThrow {
            valueMapper.applyToObject(
                "no-value-no-default",
                inputObject
            )
        }

        assertEquals(inputObject, result)
    }

    @Test
    fun `should map (by adding) array to new target in command order`() {

        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-array-moving-v1",
                mapOf(
                    "mijn-kinderen" to listOf(
                        mapOf("voornaam" to "Jan"),
                        mapOf("voornaam" to "Henk")
                    ),
                    "partner-kinderen" to listOf(
                        mapOf("voornaam" to "Kees"),
                        mapOf("voornaam" to "Maria")
                    )
                )
            )
        )

        // then
        assert(mappingResult.at("/kinderen").size() == 4)
        assertEquals(mappingResult.at("/kinderen/0/voornaam").textValue(), "Jan")
        assertEquals(mappingResult.at("/kinderen/1/voornaam").textValue(), "Henk")
        assertEquals(mappingResult.at("/kinderen/2/voornaam").textValue(), "Kees")
        assertEquals(mappingResult.at("/kinderen/3/voornaam").textValue(), "Maria")
    }

    @Test
    fun `should transform and add simple value arrays to new target in command order`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-array-transform-v1",
                mapOf(
                    "selected-aanvraag-types" to listOf(
                        "NORM",
                        "SPEC"
                    )
                )
            )
        )

        // then
        assert(mappingResult.at("/aanvraagTypes").size() == 2)
        assertEquals(mappingResult.at("/aanvraagTypes/0/code").textValue(), "NORMAL")
        assertEquals(mappingResult.at("/aanvraagTypes/0/value").textValue(), "This is a normal request")
        assertEquals(mappingResult.at("/aanvraagTypes/1/code").textValue(), "SPECIAL")
        assertEquals(mappingResult.at("/aanvraagTypes/1/value").textValue(), "This is a special request")
    }

    @Test
    fun `should skip array items that don't hit any transformation criteria`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-array-transform-v1",
                mapOf(
                    "selected-aanvraag-types" to listOf(
                        3,
                        "NORM"
                    )
                )
            )
        )

        // then
        assert(mappingResult.at("/aanvraagTypes").size() == 1)
        assertEquals(mappingResult.at("/aanvraagTypes/0/code").textValue(), "NORMAL")
        assertEquals(mappingResult.at("/aanvraagTypes/0/value").textValue(), "This is a normal request")
        assertNull(mappingResult.at("/aanvraagTypes/1/code").textValue())
        assertNull(mappingResult.at("/aanvraagTypes/1/value").textValue())
    }

    @Test
    fun `should apply default to array items that don't hit any transformation criteria`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-array-transform-v2",
                mapOf(
                    "selected-aanvraag-types" to listOf(
                        3,
                        "NORM"
                    )
                )
            )
        )

        // then
        assert(mappingResult.at("/aanvraagTypes").size() == 2)
        assertEquals(mappingResult.at("/aanvraagTypes/0/code").textValue(), "UNKNOWN")
        assertEquals(mappingResult.at("/aanvraagTypes/0/value").textValue(), "The request type is unknown")
        assertEquals(mappingResult.at("/aanvraagTypes/1/code").textValue(), "NORMAL")
        assertEquals(mappingResult.at("/aanvraagTypes/1/value").textValue(), "This is a normal request")
    }

    @Test
    fun `should not fail`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-array-transform-v1",
                mapOf(
                    "selected-aanvraag-types" to listOf(
                        "NORM",
                        "SPEC",
                        "ASD"
                    )
                )
            )
        )

        // then
        assert(mappingResult.at("/aanvraagTypes").size() == 2)
        assertEquals(mappingResult.at("/aanvraagTypes/0/code").textValue(), "NORMAL")
        assertEquals(mappingResult.at("/aanvraagTypes/0/value").textValue(), "This is a normal request")
        assertEquals(mappingResult.at("/aanvraagTypes/1/code").textValue(), "SPECIAL")
        assertEquals(mappingResult.at("/aanvraagTypes/1/value").textValue(), "This is a special request")
    }


    @Test
    fun `should create empty array`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-array-simple-v1",
                mapOf(
                    "some" to mapOf<String, Any>(
                        "thing1" to "a",
                        "thing1" to "b"
                    )
                )
            )
        )

        // then
        assert(mappingResult.at("/new/array").isArray)
    }

    @Test
    fun `should transform values from complex pointer to complex pointer`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val inputObject = mapOf(
            "mijn-kinderen" to listOf(
                mapOf(
                    "voornaam" to "Jan",
                    "toys" to listOf(
                        mapOf(
                            "toyCode" to 11
                        ),
                        mapOf(
                            "toyCode" to 22
                        )
                    )
                ),
                mapOf(
                    "voornaam" to "Kees",
                    "toys" to emptyList<Map<String, Any>>()
                ),
                mapOf(
                    "voornaam" to "Maria",
                    "toys" to listOf(
                        mapOf(
                            "toyCode" to 22
                        ),
                        mapOf(
                            "toyCode" to 33
                        )
                    )
                )
            )
        )

        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-array-complex-v1",
                inputObject
            )
        )

        // then
        assertEquals(3, mappingResult.at("/kinderen").size())
        assertEquals(2, mappingResult.at("/kinderen/0/speelgoederen").size())
        assertEquals(1, mappingResult.at("/kinderen/1/speelgoederen").size())
        assertEquals(2, mappingResult.at("/kinderen/2/speelgoederen").size())
        assertEquals("Jan", mappingResult.at("/kinderen/0/voornaam").textValue())
        assertEquals("Kees", mappingResult.at("/kinderen/1/voornaam").textValue())
        assertEquals("Maria", mappingResult.at("/kinderen/2/voornaam").textValue())
    }

    @Test
    fun `should error on invalid complex command`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val inputObject = emptyMap<String, Any>()

        assertThrows<ValueMapperCommandException> {
            mapper.convertValue(
                valueMapper.applyToObject(
                    "test-invalid-complex-v1",
                    inputObject
                )
            )
        }
    }

    @Test
    fun `should skip complex command when no value and no default`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val inputObject = emptyMap<String, Any>()


        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-empty-value-complex-v1",
                inputObject
            )
        )

        assert(mappingResult.isEmpty)
    }

    @Test
    fun `should fail when no matching definition found`() {

        // then
        assertThrows<IllegalArgumentException> {
            valueMapper.applyToDocument(
                "non-existing-v1",
                document.id().toString())
        }
    }

    @Test
    fun `should fail when targetPointer points to root node`() {
        // given
        whenever(documentService.get(any())).thenReturn(document)
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)
        whenever(document.content().asJson()).thenReturn(
            mapper.convertValue(
                mapOf("persoonsgegevens" to mapOf("voornaam" to "Kees"))
            )
        )

        // then
        assertThrows<ValueMapperCommandException> {
            valueMapper.applyToDocument(
                "test-invalid-pointer",
                document.id().toString())
        }
    }

    @Test
    fun `should convert string to int and vice versa during mapping`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        val mappingResult: ObjectNode = mapper.convertValue(
            valueMapper.applyToObject(
                "test-convert-types-valid-v1",
                mapOf(
                    "customer" to mapOf<String, Any>(
                        "adres" to mapOf<String, Any>(
                            "streetname" to "Street",
                            "housenumber" to "10",
                            "saunaPresent" to "true",
                            "doorsAreOpen" to false,
                            "cost" to 312330
                        )
                    )
                )
            )
        )

        // then
        assert(mappingResult.at("/adres/huisnummer").isInt)
        assert(mappingResult.at("/adres/hasSauna").isBoolean)
        assertEquals(true, mappingResult.at("/adres/hasSauna").booleanValue())
        assert(mappingResult.at("/adres/unlocked").isTextual)
        assertEquals("false", mappingResult.at("/adres/unlocked").textValue())
        assert(mappingResult.at("/adres/value").isTextual)
        assertEquals("312330", mappingResult.at("/adres/value").textValue())
    }

    @Test
    fun `should fail converting numeric string to boolean during mapping`() {
        // given
        whenever(valueMapperDefinitionService.getDefinitions()).thenReturn(testDefinitions)

        // when
        assertThrows<ValueMapperCommandException> {

            valueMapper.applyToObject(
                "test-convert-type-invalid-v1",
                mapOf(
                    "customer" to mapOf<String, Any>(
                        "adres" to mapOf<String, Any>(
                            "housenumber" to "10"
                        )
                    )
                )
            )

        }
    }

    companion object {
        private val mapper = ObjectMapper()
        private val testDefinitions = mapOf(
            "test-v1" to ValueMapperDefinition(
                definitionId = "test-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/persoonsgegevens",
                        "targetPointer": "/persoon"
                    },
                    {
                        "defaultValue": "Anonymous",
                        "sourcePointer": "/persoonsgegevens/voornamen",
                        "targetPointer": "/persoon/voornaam",
                        "transformations":[]
                    },
                    {
                        "defaultValue": "LETTER",
                        "sourcePointer": "/contactgegevens/communicatievoorkeur",
                        "targetPointer": "/contacts/communicationChannel",
                        "transformations": [
                            {
                                "when": "a",
                                "then": "EMAIL"
                            },
                            {
                                "when": "b",
                                "then": "PHONE"
                            },
                            {
                                "when": "c",
                                "then": "LETTER"
                            }
                        ]
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-v2" to ValueMapperDefinition(
                definitionId = "test-v2",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/persoonsgegevens",
                        "targetPointer": "/persoon"
                    },
                    {
                        "sourcePointer": "/contactgegevens/communicatievoorkeur",
                        "targetPointer": "/contacts/communicationChannel",
                        "transformations": [
                            {
                                "when": "a",
                                "then": "EMAIL"
                            },
                            {
                                "when": "b",
                                "then": "PHONE"},
                            {
                                "when": "c",
                                "then": "LETTER"
                            }
                        ]
                    }
                ]
            """.trimIndent()
                )
            ),
            "no-value-no-default" to ValueMapperDefinition(
                definitionId = "no-value-no-default",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/persoonsgegevens",
                        "targetPointer": "/persoon"
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-invalid-pointer" to ValueMapperDefinition(
                definitionId = "test-invalid-pointer",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/persoonsgegevens",
                        "targetPointer": "/"
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-array-moving-v1" to ValueMapperDefinition(
                definitionId = "test-array-moving-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/mijn-kinderen",
                        "targetPointer": "/kinderen"
                    },
                    {
                        "sourcePointer": "/partner-kinderen",
                        "targetPointer": "/kinderen"
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-array-transform-v1" to ValueMapperDefinition(
                definitionId = "test-array-transform-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/selected-aanvraag-types",
                        "targetPointer": "/aanvraagTypes",
                        "transformations": [
                            {
                                "when":"NORM",
                                "then": {
                                    "code": "NORMAL",
                                    "value": "This is a normal request"
                                }
                            },
                            {
                                "when":"SPEC",
                                "then": {
                                    "code": "SPECIAL",
                                    "value": "This is a special request"
                                }
                            },
                            {
                                "when":"ALT",
                                "then": {
                                    "code": "ALTERNATIVE",
                                    "value": "This is an alternative request"
                                }
                            }
                        ]
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-array-transform-v2" to ValueMapperDefinition(
                definitionId = "test-array-transform-v2",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "defaultValue": {
                            "code": "UNKNOWN",
                            "value": "The request type is unknown"
                        },
                        "sourcePointer": "/selected-aanvraag-types",
                        "targetPointer": "/aanvraagTypes",
                        "transformations": [
                            {
                                "when":"NORM",
                                "then": {
                                    "code": "NORMAL",
                                    "value": "This is a normal request"
                                }
                            },
                            {
                                "when":"SPEC",
                                "then": {
                                    "code": "SPECIAL",
                                    "value": "This is a special request"
                                }
                            },
                            {
                                "when":"ALT",
                                "then": {
                                    "code": "ALTERNATIVE",
                                    "value": "This is an alternative request"
                                }
                            }
                        ]
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-array-complex-v1" to ValueMapperDefinition(
                definitionId = "test-array-complex-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/mijn-kinderen/[]/voornaam",
                        "targetPointer": "/kinderen/[]/voornaam"
                    },
                    {
                        "defaultValue": {
                            "code": "NVT",
                            "value": "Niet van toepassing"
                        },
                        "sourcePointer": "/mijn-kinderen/[]/geslachtsaanduiding",
                        "targetPointer": "/kinderen/[]/geslacht",
                        "transformations": []
                    },
                    {
                        "defaultValue": {
                            "code": 0,
                            "name": "Imagination",
                            "description": "The sky is the limit... 🥲"
                        },
                        "sourcePointer": "/mijn-kinderen/[]/toys/[]/toyCode",
                        "targetPointer": "/kinderen/[]/speelgoederen/[]",
                        "transformations": [
                            {
                                "when": 11,
                                "then": {
                                    "code": 11,
                                    "name": "Nintje Knuffel",
                                    "description": "A cute toy rabbit. 🐰"
                                }
                            },
                            {
                                "when": 22,
                                "then": {
                                    "code": 22,
                                    "name": "Lego blocks",
                                    "description": "You can build a castle."
                                }
                            },
                            {
                                "when": 33,
                                "then": {
                                    "code": 33,
                                    "name": "Toy Car",
                                    "description": "It's red and very fast!"
                                }
                            }
                        ]
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-empty-value-complex-v1" to ValueMapperDefinition(
                definitionId = "test-empty-value-complex-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/mijn-kinderen/[]/voornaam",
                        "targetPointer": "/kinderen/[]/voornaam"
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-array-simple-v1" to ValueMapperDefinition(
                definitionId = "test-array-simple-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "defaultValue": [],
                        "sourcePointer": "/some",
                        "targetPointer": "/new/array",
                        "transformations": []
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-invalid-complex-v1" to ValueMapperDefinition(
                definitionId = "test-invalid-complex-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/mijn-kinderen/[]/voornaam",
                        "targetPointer": "/kinderen/voornaam"
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-convert-types-valid-v1" to ValueMapperDefinition(
                definitionId = "test-convert-types-valid-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/customer/adres/housenumber",
                        "targetPointer": "/adres/huisnummer",
                        "operation": "CONVERT",
                        "transformations":[
                            {
                                "whenType": "STRING",
                                "thenType": "java.lang.Integer"
                            }
                        ]
                    },
                    {
                        "sourcePointer": "/customer/adres/cost",
                        "targetPointer": "/adres/value",
                        "operation": "CONVERT",
                        "transformations":[
                            {
                                "whenType": "NUMBER",
                                "thenType": "java.lang.String"
                            }
                        ]
                    },
                    {
                        "sourcePointer": "/customer/adres/doorsAreOpen",
                        "targetPointer": "/adres/unlocked",
                        "operation": "CONVERT",
                        "transformations":[
                            {
                                "whenType": "BOOLEAN",
                                "thenType": "java.lang.String"
                            }
                        ]
                    },
                    {
                        "sourcePointer": "/customer/adres/saunaPresent",
                        "targetPointer": "/adres/hasSauna",
                        "operation": "CONVERT",
                        "transformations":[
                            {
                                "whenType": "STRING",
                                "thenType": "java.lang.Boolean"
                            }
                        ]
                    }
                ]
            """.trimIndent()
                )
            ),
            "test-convert-type-invalid-v1" to ValueMapperDefinition(
                definitionId = "test-convert-type-invalid-v1",
                commands = jacksonObjectMapper().readValue(
                    """
                [
                    {
                        "sourcePointer": "/customer/adres/housenumber",
                        "targetPointer": "/adres/huisnummer",
                        "operation": "CONVERT",
                        "transformations":[
                            {
                                "whenType": "STRING",
                                "thenType": "java.lang.Boolean"
                            }
                        ]
                    }
                ]
            """.trimIndent()
                )
            )
        )
    }
}
