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

package com.ritense.valtimoplugins.objectmanagement.plugin

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.document.domain.patch.JsonPatchService
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimo.contract.json.patch.JsonPatchBuilder
import com.ritense.valtimoplugins.objectmanagement.service.ObjectManagementCrudService
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI
import java.util.UUID

@Plugin(
    key = "object-management",
    title = "Object Management",
    description = "Plugin for CRUD actions on the Objects registration"
)
open class ObjectManagementPlugin(
    pluginService: PluginService,
    private val objectManagementCrudService: ObjectManagementCrudService,
    private val valueResolverService: ValueResolverService
) {
    private val objectMapper = pluginService.getObjectMapper()

    @PluginAction(
        key = "create-object",
        title = "Create Object",
        description = "Create a new Object",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun createObject(
        execution: DelegateExecution,
        @PluginActionProperty objectManagementConfigurationId: UUID,
        @PluginActionProperty objectData: List<DataBindingConfig>,
        @PluginActionProperty objectUrlProcessVariableName: String
    ) {
        val objectUrl = objectManagementCrudService.createObject(
            objectManagementConfigurationId,
            getObjectData(objectData, execution.businessKey),
        )

        execution.setVariable(objectUrlProcessVariableName, objectUrl.toString())
    }

    @PluginAction(
        key = "update-object",
        title = "Update Object",
        description = "Update an existing Object",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun updateObject(
        execution: DelegateExecution,
        @PluginActionProperty objectUrl: URI,
        @PluginActionProperty objectManagementConfigurationId: UUID,
        @PluginActionProperty objectData: List<DataBindingConfig>,
    ) {

    }

    @PluginAction(
        key = "delete-object",
        title = "Delete Object",
        description = "Delete an existing Object",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun deleteObject() {

    }

    @PluginAction(
        key = "get-objects-unpaged",
        title = "Get Objects Unpaged",
        description = "Retrieve all Objects of a given object-management id",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun getObjectsUnpaged(
        execution: DelegateExecution,
        @PluginActionProperty objectManagementConfigurationTitle: String,
        @PluginActionProperty listOfObjectProcessVariableName: String
    ) {
        val objects = objectManagementCrudService.getObjectsByObjectManagementTitle(objectManagementConfigurationTitle)
        val processedObject = objects.results.map { it.record.data }

        execution.setVariable(listOfObjectProcessVariableName, processedObject)
        logger.info { "Successfully retrieved ${objects.results.size} objects for object management: $objectManagementConfigurationTitle" }
    }

    private fun getObjectData(keyValueMap: List<DataBindingConfig>, documentId: String): JsonNode {
        val resolvedValuesMap = valueResolverService.resolveValues(
            documentId, keyValueMap.map { it.value }
        )

        if (keyValueMap.size != resolvedValuesMap.size) {
            val failedValues = keyValueMap
                .filter { !resolvedValuesMap.containsKey(it.value) }
                .joinToString(", ") { "'${it.key}' = '${it.value}'" }
            throw IllegalArgumentException(
                "Error in case: '${documentId}'. Failed to resolve values: $failedValues".trimMargin()
            )
        }

        val objectDataMap = keyValueMap.associate { it.key to resolvedValuesMap[it.value] }

        val objectData = objectMapper.createObjectNode()
        val jsonPatchBuilder = JsonPatchBuilder()

        objectDataMap.forEach {
            val path = JsonPointer.valueOf(it.key)
            val valueNode = objectMapper.valueToTree<JsonNode>(it.value)
            jsonPatchBuilder.addJsonNodeValue(objectData, path, valueNode)
        }

        JsonPatchService.apply(jsonPatchBuilder.build(), objectData)

        return objectMapper.convertValue(objectData)
    }

    companion object {
        private val logger: KLogger = KotlinLogging.logger { }
    }
}
