package com.ritense.externeklanttaak

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.util.UUID

object TestHelper {
    internal val objectMapper = jacksonObjectMapper().findAndRegisterModules()

    internal val externalUrl = "https://example.com/external-url"
    internal val bsn = "999990755"
    internal val objectUrl = "https://example.com/objecten/api/v1/object-id"
    internal val objecttypeUrl = "https://example.com/objecttypen/api/v1/${UUID.randomUUID()}"
    internal val objecttypeId = objecttypeUrl.substringAfterLast("/")

    internal val openKlanttaak: ObjectNode = objectMapper.readTree(
        """
            {
                  "titel" : "Fake Task",
                  "status" : "open",
                  "soort" : "url",
                  "url" : { "uri": "https://example.com/external-url"},
                  "identificatie" : {
                    "type" : "bsn",
                    "value" : "999990755"
                  },
                  "verloopdatum" : "2024-12-24",
                  "eigenaar" : "GZAC",
                  "verwerker_taak_id" : "fake-task-id"
            }
        """.trimIndent()
    ).deepCopy()

    internal val afgerondeKlanttaak: ObjectNode = objectMapper.readTree(
        """
           {
                  "titel" : "Fake Task",
                  "status" : "afgerond",
                  "soort" : "url",
                  "url" : { "uri": "https://example.com/external-url"},
                  "identificatie" : {
                    "type" : "bsn",
                    "value" : "999990755"
                  },
                  "verloopdatum" : "2024-12-24",
                  "eigenaar" : "GZAC",
                  "verwerker_taak_id" : "fake-task-id"
           }
        """.trimIndent()
    ).deepCopy()

    internal val verwerkteKlanttaak: ObjectNode = objectMapper.readTree(
        """
           {
                  "titel" : "Fake Task",
                  "status" : "verwerkt",
                  "soort" : "url",
                  "url" : { "uri": "https://example.com/external-url"},
                  "identificatie" : {
                    "type" : "bsn",
                    "value" : "999990755"
                  },
                  "verloopdatum" : "2024-12-24",
                  "eigenaar" : "GZAC",
                  "verwerker_taak_id" : "fake-task-id"
           }
        """.trimIndent()
    ).deepCopy()

    internal val openTaakObject: JsonNode = objectMapper.readTree(
        """
                {
                  "uuid": "${UUID.randomUUID()}",
                  "url": "$objectUrl",
                  "type" : "$objecttypeUrl",
                  "record" : {
                    "typeVersion" : 1,
                    "data" : {
                      "titel" : "Fake Task",
                      "status" : "open",
                      "soort" : "url",
                      "url" : { "uri": "https://example.com/external-url"},
                      "identificatie" : {
                        "type" : "bsn",
                        "value" : "999990755"
                      },
                      "verloopdatum" : "2024-12-24",
                      "eigenaar" : "GZAC",
                      "verwerker_taak_id" : "fake-task-id"
                    },
                    "startAt" : "2024-11-07"
                  }
                }
            """.trimIndent()
    )
    internal val afgerondeTaakObject: JsonNode = objectMapper.readTree(
        """
                {
                  "uuid": "${UUID.randomUUID()}",
                  "url": "$objectUrl",
                  "type" : "$objecttypeUrl",
                  "record" : {
                    "typeVersion" : 1,
                    "data" : {
                      "titel" : "Fake Task",
                      "status" : "afgerond",
                      "soort" : "url",
                      "url" : { "uri": "https://example.com/external-url"},
                      "identificatie" : {
                        "type" : "bsn",
                        "value" : "999990755"
                      },
                      "verloopdatum" : "2024-12-24",
                      "eigenaar" : "GZAC",
                      "verwerker_taak_id" : "fake-task-id"
                    },
                    "startAt" : "2024-11-07"
                  }
                }
            """.trimIndent()
    )
    internal val verwerkteTaakObject: JsonNode = objectMapper.readTree(
        """
                {
                  "uuid": "${UUID.randomUUID()}",
                  "url": "$objectUrl",
                  "type" : "$objecttypeUrl",
                  "record" : {
                    "typeVersion" : 1,
                    "data" : {
                      "titel" : "Fake Task",
                      "status" : "verwerkt",
                      "soort" : "url",
                      "url" : { "uri": "https://example.com/external-url"},
                      "identificatie" : {
                        "type" : "bsn",
                        "value" : "999990755"
                      },
                      "verloopdatum" : "2024-12-24",
                      "eigenaar" : "GZAC",
                      "verwerker_taak_id" : "fake-task-id"
                    },
                    "startAt" : "2024-11-07"
                  }
                }
            """.trimIndent()
    )
}