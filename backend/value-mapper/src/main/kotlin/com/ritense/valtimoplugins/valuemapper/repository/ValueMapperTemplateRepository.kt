/*
 *  Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 *  Licensed under EUPL, Version 1.2 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.ritense.valtimoplugins.valuemapper.repository

import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperTemplate
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface ValueMapperTemplateRepository: JpaRepository<ValueMapperTemplate, UUID> {

    fun findByKey(key: String): ValueMapperTemplate?

    @Query("SELECT key FROM ValueMapperTemplate")
    fun getAll(): Set<String>

    @Query("SELECT key FROM ValueMapperTemplate")
    fun findAllKeysPaged(pageable: Pageable): Page<String>

    fun deleteByKey(key: String)
}
