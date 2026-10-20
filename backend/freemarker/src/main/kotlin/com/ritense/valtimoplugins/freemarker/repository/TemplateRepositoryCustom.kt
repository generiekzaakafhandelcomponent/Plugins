/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.repository

import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.KEY
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.TYPE
import com.ritense.valtimoplugins.freemarker.web.rest.dto.TemplateKeyType
import jakarta.persistence.EntityManager
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.jpa.repository.query.QueryUtils
import org.springframework.data.support.PageableExecutionUtils

interface TemplateRepositoryCustom {
    /**
     * Finds only the key and type of the matching templates. Unlike `findAll`, this doesn't load the content and
     * metadata of every template, which can be large (e.g. a PDF template with embedded images).
     */
    fun findKeyTypes(
        specification: Specification<ValtimoTemplate>,
        pageable: Pageable,
    ): Page<TemplateKeyType>
}

class TemplateRepositoryCustomImpl(
    private val entityManager: EntityManager,
) : TemplateRepositoryCustom {
    override fun findKeyTypes(
        specification: Specification<ValtimoTemplate>,
        pageable: Pageable,
    ): Page<TemplateKeyType> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(TemplateKeyType::class.java)
        val root = query.from(ValtimoTemplate::class.java)
        query.select(cb.construct(TemplateKeyType::class.java, root.get<String>(KEY), root.get<String>(TYPE)))
        specification.toPredicate(root, query, cb)?.let { query.where(it) }
        query.orderBy(QueryUtils.toOrders(pageable.sort, root, cb))

        val typedQuery = entityManager.createQuery(query)
        if (pageable.isPaged) {
            typedQuery.firstResult = pageable.offset.toInt()
            typedQuery.maxResults = pageable.pageSize
        }
        return PageableExecutionUtils.getPage(typedQuery.resultList, pageable) { count(specification) }
    }

    private fun count(specification: Specification<ValtimoTemplate>): Long {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Long::class.javaObjectType)
        val root = query.from(ValtimoTemplate::class.java)
        query.select(cb.count(root))
        specification.toPredicate(root, query, cb)?.let { query.where(it) }
        return entityManager.createQuery(query).singleResult
    }
}
