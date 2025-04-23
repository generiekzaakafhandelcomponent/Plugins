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

package com.ritense.valtimoplugins.objectmanagement.service

import com.fasterxml.jackson.databind.JsonNode
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectRequest
import com.ritense.objectenapi.client.ObjectsList
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.repository.ObjectManagementRepository
import com.ritense.objectmanagement.service.ObjectManagementFacade
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.service.PluginService
import java.net.URI
import java.time.LocalDate
import java.util.*

class ObjectManagementCrudService(
    private val pluginService: PluginService,
    private val objectManagementRepository: ObjectManagementRepository,
    private val objectManagementFacade: ObjectManagementFacade
) {
    fun createObject(
        objectManagementId: UUID,
        objectData: JsonNode,
    ): URI {
        val objectManagement = getObjectManagement(objectManagementId)
        val objectenApiPlugin = getObjectenApiPlugin(objectManagement.objectenApiPluginConfigurationId)
        val objecttypenApiPlugin = getObjecttypenApiPlugin(objectManagement.objecttypenApiPluginConfigurationId)
        val objectRequest = ObjectRequest(
            objecttypenApiPlugin.getObjectTypeUrlById(objectManagement.objecttypeId),
            ObjectRecord(
                typeVersion = objectManagement.objecttypeVersion,
                data = objectData,
                startAt = LocalDate.now()
            )
        )
        return objectenApiPlugin.createObject(objectRequest).url
    }

    fun updateObject(
        objectManagementId: UUID,
        objectUrl: URI,
        objectData: JsonNode
    ): URI {
        val objectManagement = getObjectManagement(objectManagementId)
        val objectenApiPlugin = getObjectenApiPlugin(objectManagement.objectenApiPluginConfigurationId)
        val objecttypenApiPlugin = getObjecttypenApiPlugin(objectManagement.objecttypenApiPluginConfigurationId)

        val objectRequest = ObjectRequest(
            objecttypenApiPlugin.getObjectTypeUrlById(objectManagement.objecttypeId),
            ObjectRecord(
                typeVersion = objectManagement.objecttypeVersion,
                data = objectData,
                startAt = LocalDate.now()
            )
        )

        return objectenApiPlugin.objectPatch(objectUrl, objectRequest).url
    }

    fun deleteObject(
        objectUrl: String,
        objectManagementConfigurationId: UUID
    ) {
        val objectManagement = getObjectManagement(objectManagementConfigurationId)
        val objectenApiPlugin = getObjectenApiPlugin(objectManagement.objectenApiPluginConfigurationId)
        val uri = URI.create(objectUrl)
        objectenApiPlugin.deleteObject(uri)
    }

    fun getObjectsByObjectManagementTitle(
        objectManagementTitle: String,
        searchString: String? = null,
        ordering: String? = null
    ): ObjectsList {
        return try {
            objectManagementFacade.getObjectsUnpaged(
                objectName = objectManagementTitle,
                searchString = searchString,
                ordering = ordering
            )
        } catch (e: Exception) {
            throw RuntimeException("Failed to fetch objects for objectManagement: $objectManagementTitle", e)
        }
    }

    private fun getObjectenApiPlugin(objectenApiPluginConfigurationId: UUID): ObjectenApiPlugin {
        return pluginService.createInstance<ObjectenApiPlugin>(objectenApiPluginConfigurationId)

    }

    private fun getObjecttypenApiPlugin(objecttypenApiPluginConfigurationId: UUID): ObjecttypenApiPlugin {
        return pluginService.createInstance<ObjecttypenApiPlugin>(objecttypenApiPluginConfigurationId)

    }

    private fun getObjectManagement(objectManagementId: UUID): ObjectManagement {
        return objectManagementRepository.findById(objectManagementId).orElseThrow()
    }
}
