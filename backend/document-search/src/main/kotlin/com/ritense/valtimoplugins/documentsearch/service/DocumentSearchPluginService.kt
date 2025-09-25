/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
 *
 */


package com.ritense.valtimoplugins.documentsearch.service

import com.ritense.document.domain.Document
import com.ritense.document.domain.search.AdvancedSearchRequest
import com.ritense.document.domain.search.AdvancedSearchRequest.OtherFilter
import com.ritense.document.domain.search.DatabaseSearchType
import com.ritense.document.service.DocumentSearchService
import com.ritense.document.service.impl.SearchCriteria
import com.ritense.document.service.impl.SearchRequest
import org.springframework.data.domain.Pageable

class DocumentSearchPluginService(
    private val documentSearchService: DocumentSearchService
) {

    fun searchDocuments(documentPath: String, documentDefinitionName: String, searchedValue: String): List<Document> {

        val searchRequest = SearchRequest()
        searchRequest.documentDefinitionName = documentDefinitionName

        val searchCriteria = SearchCriteria(toJsonPath(documentPath), searchedValue)
        searchRequest.otherFilters = listOf(searchCriteria)

        val advancedSearchRequest = AdvancedSearchRequest()
            .addOtherFilters(
                OtherFilter()
                    .path(toJsonPath(documentPath))
                    .searchType(DatabaseSearchType.EQUAL)
                    .addValue(searchedValue)
            )

        return documentSearchService.search(documentDefinitionName, advancedSearchRequest, Pageable.unpaged()).content
    }

    /**
     * toJsonPath converts a Valtimo doc: path to a JsonPath.
     *
     * Example:
     * ```
     * input: "/some/path"
     * returns: "$.some.path"
     * ```
     * @param path The Valtimo doc: path
     * @return The JsonPath string
     */
    fun toJsonPath(path: String): String {
        return path
            .replace("/", "doc:")
            .replace("/", ".")
    }
}
