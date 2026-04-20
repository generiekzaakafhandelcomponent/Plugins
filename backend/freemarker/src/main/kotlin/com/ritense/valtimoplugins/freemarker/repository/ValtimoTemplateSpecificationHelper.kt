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

import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import org.springframework.data.jpa.domain.Specification

class ValtimoTemplateSpecificationHelper {

    companion object {

        const val KEY: String = "key"
        const val CASE_DEFINITION_NAME: String = "caseDefinitionName"
        const val TYPE: String = "type"

        @JvmStatic
        fun query() = Specification<ValtimoTemplate> { _, _, cb ->
            cb.equal(cb.literal(1), 1)
        }

        @JvmStatic
        fun byKey(key: String) = Specification<ValtimoTemplate> { root, _, cb ->
            cb.equal(root.get<Any>(KEY), key)
        }

        @JvmStatic
        fun byCaseDefinitionName(caseDefinitionName: String?) = Specification<ValtimoTemplate> { root, _, cb ->
            if (caseDefinitionName == null) {
                root.get<Any>(CASE_DEFINITION_NAME).isNull
            } else {
                cb.equal(root.get<Any>(CASE_DEFINITION_NAME), caseDefinitionName)
            }
        }

        @JvmStatic
        fun byType(type: String) = Specification<ValtimoTemplate> { root, _, cb ->
            cb.equal(root.get<Any>(TYPE), type)
        }

        @JvmStatic
        fun byTypes(types: List<String>) = Specification<ValtimoTemplate> { root, _, cb ->
            root.get<Any>(TYPE).`in`(types)
        }

        @JvmStatic
        fun byKeyAndCaseDefinitionNameAndType(key: String, caseDefinitionName: String?, type: String) =
            byKey(key).and(byCaseDefinitionName(caseDefinitionName)).and(byType(type))

    }
}
