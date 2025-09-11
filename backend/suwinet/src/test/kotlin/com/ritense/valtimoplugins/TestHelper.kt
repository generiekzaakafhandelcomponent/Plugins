package com.ritense.valtimo

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.document.domain.impl.JsonDocumentContent
import org.springframework.core.io.DefaultResourceLoader
import java.io.IOException
import java.time.LocalDate
import jakarta.xml.bind.JAXBContext
import jakarta.xml.bind.JAXBException

object TestHelper {

    const val DOCUMENT_ID = "6218600e-5012-4320-9ca6-40fd58e0a297"
    const val CASE_ID = "6668600e-5012-4320-9ca6-40fd58e0a297"
    const val CONNECTOR_NAME = "objects-api-connector"
    val VARIABLE_MAP = mapOf("resultaat" to "testResultaat", "status" to "testStatus")
    val BESLUIT_TYPE = mapOf("besluitType" to "testBesluitType")
    val PROCESS_DEFINITION_ID_INFORMEREN_AANVRAGER_PROCESS = "ooievaarspas-informeren-aanvrager"
    val ZONEDDATETIMESTRING_START="2007-12-03T10:15:30+01:00"
    val ZONEDDATETIMESTRING_END="2022-10-11T22:05:10+03:00"
    val ZONEDDATETIMESTRING_FUTURE="5022-10-11T22:05:10+03:00"
    val CURRENT_DATE: LocalDate = LocalDate.now()
    val resourceLoader = DefaultResourceLoader()

    @Throws(JsonProcessingException::class, JsonMappingException::class)
    inline fun <reified K> deserialiseJsonAsObject(jsonDataPath: String): K {
        val resource = resourceLoader.getResource(jsonDataPath)
        val objectMapper = jacksonObjectMapper()
        return objectMapper.readValue(resource.inputStream)
    }

    @Throws(JsonProcessingException::class, JsonMappingException::class)
    inline fun <reified K, V> deserialiseJsonAsMap(jsonData: String?): Map<K, V> {
        val typeRef: TypeReference<Map<K, V>> = object : TypeReference<Map<K, V>>() {}
        val objectMapper = jacksonObjectMapper()
        return objectMapper.readValue(jsonData, typeRef)
    }

    inline fun <reified T : Any> unmarshal(resourcePath: String): T? {
        try {
            val resource = resourceLoader.getResource("classpath:suwinet/data/responses/$resourcePath")
            val context = JAXBContext.newInstance(T::class.java)
            val un = context.createUnmarshaller()
            return un.unmarshal(resource.inputStream) as T
        } catch (e: JAXBException) {
            e.printStackTrace()
        } catch (e: IOException) {
            throw RuntimeException(e)
        }
        return null
    }

    fun documentAsJson(): JsonDocumentContent {
        val objectMapper = ObjectMapper()
        val trainingJson = objectMapper.convertValue(trainingsCreatieObjectData(), JsonNode::class.java)

        return JsonDocumentContent.build(trainingJson)
    }

    fun trainingsCreatieObjectData(): LinkedHashMap<String, Any> {
        return linkedMapOf(
            "training" to trainingsObjectData()
        )
    }

    private fun trainingsObjectData(): LinkedHashMap<String, Any> {
        return linkedMapOf(
            "naam" to "Testtraining",
            "lokaal" to "1",
            "dagdeel" to "ochtend",
            "locatie" to "zuid",
            "eindtijd" to "T11:00:00+02:00",
            "trainers" to
                listOf(
                    mapOf(
                        "voornaam" to "Piet",
                        "achternaam" to "Klaassen",
                        "emailadres" to "piet@klaassen.nl",
                        "tussenvoegsel" to "",
                        "volledigeNaam" to "Pieter Klaassen",
                        "telefoonnummer" to "0612345678"
                    )
                ),
            "maxAantalDeelnemers" to "10",
            "uitersteInschrijfdatum" to "2022-07-15T00:00:00+02:00",
            "datumLaatsteTrainingsdag" to "2022-07-21",
            "status" to "GEPLAND"
        )
    }
}