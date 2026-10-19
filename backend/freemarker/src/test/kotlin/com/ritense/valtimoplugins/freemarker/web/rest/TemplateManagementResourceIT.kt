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
package com.ritense.valtimoplugins.freemarker.web.rest

import com.ritense.valtimoplugins.freemarker.BaseIntegrationTest
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.web.rest.dto.TemplateListItemResponse
import jakarta.persistence.EntityManager
import kotlin.test.assertEquals
import org.hibernate.Session
import org.hibernate.engine.spi.EntityKey
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.transaction.annotation.Transactional

@Transactional
class TemplateManagementResourceIT : BaseIntegrationTest() {

    @Autowired
    lateinit var templateManagementResource: TemplateManagementResource

    @Autowired
    lateinit var entityManager: EntityManager

    @Test
    fun `should list templates without loading them`() {
        entityManager.clear()

        val page = templateManagementResource.getTemplates(
            templateKey = null,
            caseDefinitionName = null,
            templateType = "mail",
            templateTypes = null,
            pageable = PageRequest.of(0, 10, Sort.by("key"))
        ).body!!

        assertEquals(
            listOf(
                TemplateListItemResponse("letter-template", "mail"),
                TemplateListItemResponse("placeholder-test-template", "mail"),
            ),
            page.content
        )
        val loadedTemplates = entityManager
            .unwrap(Session::class.java)
            .statistics.entityKeys
            .filterIsInstance<EntityKey>()
            .count { it.entityName == ValtimoTemplate::class.java.name }
        assertEquals(0, loadedTemplates)
    }
}
