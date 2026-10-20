/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

import com.ritense.document.domain.Document
import com.ritense.document.domain.impl.JsonSchemaDocument
import jakarta.persistence.QueryHint
import java.util.stream.Stream
import org.hibernate.jpa.HibernateHints.HINT_FETCH_SIZE
import org.hibernate.jpa.HibernateHints.HINT_READ_ONLY
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.jpa.repository.QueryHints

interface JsonSchemaDocumentRepositoryStreaming : JpaRepository<JsonSchemaDocument, Document.Id> {

    @Deprecated("Loads every document entity. Use streamContentByCaseDefinitionName instead.")
    @Query(
        """SELECT d
        FROM JsonSchemaDocument d
        WHERE d.documentDefinitionId.name = :caseDefinitionName"""
    )
    fun streamAllByCaseDefinitionName(caseDefinitionName: String): Stream<JsonSchemaDocument>

    /**
     * Streams only the JSON content: no entities enter the persistence context and no eager associations are loaded.
     * The fetch size makes the PostgreSQL driver use a cursor instead of buffering the whole result set.
     */
    @Query(
        """SELECT d.content.content
        FROM JsonSchemaDocument d
        WHERE d.documentDefinitionId.name = :caseDefinitionName"""
    )
    @QueryHints(
        QueryHint(name = HINT_FETCH_SIZE, value = "500"),
        QueryHint(name = HINT_READ_ONLY, value = "true"),
    )
    fun streamContentByCaseDefinitionName(caseDefinitionName: String): Stream<String>
}
