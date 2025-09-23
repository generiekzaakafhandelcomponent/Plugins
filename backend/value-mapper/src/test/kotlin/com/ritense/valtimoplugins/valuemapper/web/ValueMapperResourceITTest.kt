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

import com.fasterxml.jackson.databind.ObjectMapper

import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperTemplate
import com.ritense.valtimoplugins.valuemapper.security.ValueMapperHttpSecurityConfigurer
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperLoadingService
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperTemplateService
import org.junit.jupiter.api.Test
import org.mockito.Mockito.verify
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithAnonymousUser
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.client.match.MockRestRequestMatchers.content
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import java.util.UUID


@WebMvcTest
@ContextConfiguration(classes = [ValueMapperLoadingService::class, ValueMapperTemplateService::class, ValueMapperResource::class, ValueMapperHttpSecurityConfigurer::class])
@WithMockUser(roles = ["ADMIN"])
class ValueMapperResourceITTest {

    @MockBean
    lateinit var templateService: ValueMapperTemplateService

    @MockBean
    lateinit var loadingService: ValueMapperLoadingService

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var mapper: ObjectMapper

    @Test
    fun shouldGetMappingDefinitions() {
        whenever(templateService.getTemplatesKeys()).thenReturn(setOf("def1", "def2"))

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

    @Test
    fun shouldGetMappingDefinitionsPaged() {
        val pageable: Pageable = PageRequest.of(0, 2)
        val pageImpl = PageImpl(mutableListOf("def1", "def2"), pageable, 10)

        whenever(templateService.getTemplatesKeysPaged(any())).thenReturn(pageImpl)

        mockMvc.get("/api/management/v1/value-mapper/definitionsPage") {
            accept = MediaType.APPLICATION_JSON
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            content {
                json("{\"content\":[{\"key\":\"def1\",\"readOnly\":false}," +
                        "{\"key\":\"def2\",\"readOnly\":false}]," +
                        "\"pageable\":{\"pageNumber\":0,\"pageSize\":2," +
                        "\"sort\":{\"empty\":true,\"sorted\":false,\"unsorted\":true}," +
                        "\"offset\":0,\"paged\":true,\"unpaged\":false},\"last\":false," +
                        "\"totalPages\":5,\"totalElements\":10,\"first\":true,\"size\":2," +
                        "\"number\":0,\"sort\":{\"empty\":true,\"sorted\":false,\"unsorted\":true}," +
                        "\"numberOfElements\":2,\"empty\":false}")
            }
        }
    }

    @Test
    fun shouldCreateMappingDefinition() {
        val template = ValueMapperTemplate(UUID.randomUUID(), "def1", getValueMapperContent())

        whenever(templateService.getTemplatesKeys()).thenReturn(setOf("def2"))
        whenever(templateService.saveUpdate(any())).thenReturn(template)
        whenever(loadingService.resourceExists(any())).thenReturn(false)

        mockMvc.post("/api/management/v1/value-mapper/definitions") {
            content = mapper.writeValueAsString(template)
            accept = MediaType.APPLICATION_JSON
            contentType = MediaType.APPLICATION_JSON
            with(csrf())
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            content {
                content().toString().contains("def1")
            }
        }

        verify(templateService).saveUpdate(any())
    }

    @Test
    fun shoulUpdateMappingDefinition() {
        val template = ValueMapperTemplate(UUID.randomUUID(), "def1", getValueMapperContent())

        whenever(templateService.getTemplatesKeys()).thenReturn(setOf("def1","def2"))
        whenever(templateService.saveUpdate(any())).thenReturn(template)
        whenever(loadingService.resourceExists(any())).thenReturn(false)

        mockMvc.put("/api/management/v1/value-mapper/definitions/def1") {
            content = mapper.writeValueAsString(template)
            accept = MediaType.APPLICATION_JSON
            contentType = MediaType.APPLICATION_JSON
            with(csrf())
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            content {
                content().toString().contains("def1")
            }
        }

        verify(templateService).saveUpdate(any())
    }

    @Test
    fun shoulRemoveMappingDefinition() {
        val template = ValueMapperTemplate(UUID.randomUUID(), "def1", getValueMapperContent())

        whenever(templateService.getTemplatesKeys()).thenReturn(setOf("def1","def2"))
        whenever(loadingService.resourceExists(any())).thenReturn(false)

        mockMvc.delete("/api/management/v1/value-mapper/definitions/def1") {
            accept = MediaType.APPLICATION_JSON
            contentType = MediaType.APPLICATION_JSON
            with(csrf())
        }.andExpect {
            status { isOk() }
        }

        verify(templateService).removeTemplate(eq("def1"))
    }

    @Test
    @WithAnonymousUser
    fun shouldFailOnSecurity() {
        //test
        mockMvc.get("/api/management/v1/value-mapper/definitions") {
            accept = MediaType.APPLICATION_JSON
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isUnauthorized() }
        }
    }

    private fun getValueMapperContent(): String  {
        val content =
            """
                [
                    {
                        "defaultValue": [],
                        "sourcePointer": "/some",
                        "targetPointer": "/new/array",
                        "transformations": []
                    }
                ]
            """.trimIndent()
        return content
    }

}
