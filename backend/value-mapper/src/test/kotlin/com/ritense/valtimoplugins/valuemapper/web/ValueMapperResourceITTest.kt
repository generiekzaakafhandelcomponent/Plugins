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

package com.ritense.valtimoplugins.valuemapper.web

import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperDefinition
import com.ritense.valtimoplugins.valuemapper.security.ValueMapperHttpSecurityConfigurer
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperDefinitionService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@WebMvcTest
@ContextConfiguration(classes = [ValueMapperResource::class, ValueMapperHttpSecurityConfigurer::class])
@WithMockUser(roles = ["ADMIN"])
class ValueMapperResourceITTest {

    @MockBean
    lateinit var definitionService: ValueMapperDefinitionService

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun shouldGetMappingDefinitions() {
        val definition = ValueMapperDefinition("def1", emptyList())

        whenever(definitionService.getDefinitions()).thenReturn(mapOf("def1" to definition, "def2" to definition))

        mockMvc.get("/api/management/v1/value-mapper/definitions") {
            accept = MediaType.APPLICATION_JSON
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            content {
                json("['def1', 'def2']")
            }
        }
    }

}
