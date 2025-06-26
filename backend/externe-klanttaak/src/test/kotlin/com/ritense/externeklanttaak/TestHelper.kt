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
                  "verloopdatum" : "2024-12-23T23:00:00",
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
                  "verloopdatum" : "2024-12-23T23:00:00",
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
                  "verloopdatum" : "2024-12-23T23:00:00",
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
                      "verloopdatum" : "2024-12-23T23:00:00",
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
                      "verloopdatum" : "2024-12-23T23:00:00",
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
                      "verloopdatum" : "2024-12-23T23:00:00",
                      "eigenaar" : "GZAC",
                      "verwerker_taak_id" : "fake-task-id"
                    },
                    "startAt" : "2024-11-07"
                  }
                }
            """.trimIndent()
    )
}