/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.service

import com.ritense.valtimo.contract.case_.CaseDefinitionId
import com.ritense.valtimoplugins.freemarker.BaseIntegrationTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import kotlin.test.assertEquals

@Transactional
class TemplateServiceIT : BaseIntegrationTest() {

    @Autowired
    lateinit var templateService: TemplateService

    @BeforeEach
    internal fun setUp() {
    }

    @Test
    fun `find a list of possible placeholders`() {
        val template = templateService.getTemplate("placeholder-test-template", CaseDefinitionId("profile", "1.0.0"), "mail")

        val placeholders = templateService.findPlaceholders(template.content).keys

        assertEquals(
            setOf(
                "doc:lastname",
                "doc:houseNumber",
                "case:createdBy",
                "case:createdOn",
                "case:definitionId.name",
                "case:definitionId.version",
                "case:id",
                "case:sequence",
                "case:version"
            ), placeholders
        )
    }

}
