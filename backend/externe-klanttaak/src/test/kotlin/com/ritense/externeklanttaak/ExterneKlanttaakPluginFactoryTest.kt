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

package com.ritense.externeklanttaak

import com.ritense.externeklanttaak.plugin.ExterneKlanttaakPluginFactory
import com.ritense.notificatiesapi.NotificatiesApiPlugin
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.domain.PluginDefinition
import com.ritense.plugin.domain.PluginProperty
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever

internal class ExterneKlanttaakPluginFactoryTest {

    @Test
    fun `should create ExterneKlanttaakPlugin`() {
        val pluginService = mock<PluginService>()
        whenever(pluginService.getObjectMapper()).thenReturn(MapperSingleton.get())

        val notificatiesApiPluginMock = mock<NotificatiesApiPlugin>()
        whenever(pluginService.createInstance(any<PluginConfigurationId>())).thenReturn(notificatiesApiPluginMock)

        val factory = ExterneKlanttaakPluginFactory(pluginService, mock(), mock())

        val externeKlanttaakPluginProperties: String = """
            {
              "pluginVersion": "1.1.0",
              "notificatiesApiPluginConfiguration": "4d9e7fe7-0671-4955-a106-fc71dc7527a6",
              "objectManagementConfigurationId": "cc713213-995d-494f-b1cd-61fecf40f86e"
            }
        """.trimIndent()
        val pluginDefinition = createPluginDefinition()
        val pluginConfiguration = PluginConfiguration(
            PluginConfigurationId.newId(),
            "Klanttaak 1.1.0",
            MapperSingleton.get()
                .readTree(externeKlanttaakPluginProperties)
                .deepCopy(),
            pluginDefinition
        )
        val plugin = factory.create(pluginConfiguration)

        assertEquals(notificatiesApiPluginMock, plugin.notificatiesApiPluginConfiguration)
        assertEquals("cc713213-995d-494f-b1cd-61fecf40f86e", plugin.objectManagementConfigurationId.toString())
        // assertEquals(ExterneKlanttaakVersion.V1_1_0, plugin.klanttaakVersion)
    }

    private fun createPluginDefinition(): PluginDefinition {
        val propertyDefinitions = mutableSetOf<PluginProperty>()
        val pluginDefinition = PluginDefinition(
            "key",
            "title",
            "description",
            "class",
            propertyDefinitions
        )

        propertyDefinitions.add(
            PluginProperty(
                "notificatiesApiPluginConfiguration", pluginDefinition, "title", required = true,
                secret = false, "notificatiesApiPluginConfiguration",
                "com.ritense.notificatiesapi.NotificatiesApiPlugin"
            )
        )

        propertyDefinitions.add(
            PluginProperty(
                "objectManagementConfigurationId", pluginDefinition, "title", required = true,
                secret = false, "objectManagementConfigurationId",
                "java.util.UUID"
            )
        )

        propertyDefinitions.add(
            PluginProperty(
                "pluginVersion", pluginDefinition, "title", required = true,
                secret = false, "pluginVersion",
                "com.ritense.externeklanttaak.domain.Version"
            )
        )

        return pluginDefinition
    }
}