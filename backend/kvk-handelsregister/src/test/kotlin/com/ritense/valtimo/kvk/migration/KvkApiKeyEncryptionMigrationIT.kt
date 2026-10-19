/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimo.kvk.migration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.EncryptionService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.kvk.BaseIntegrationTest
import com.ritense.valtimo.kvk.plugin.KvkHandelsregisterPlugin
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import java.sql.Connection
import java.util.UUID
import javax.sql.DataSource

internal class KvkApiKeyEncryptionMigrationIT : BaseIntegrationTest() {

    @Autowired
    lateinit var migration: KvkApiKeyEncryptionMigration

    @Autowired
    lateinit var pluginService: PluginService

    @Autowired
    lateinit var dataSource: DataSource

    private val objectMapper = ObjectMapper()
    private val configurationId = UUID.randomUUID()

    @BeforeEach
    fun setUp() {
        // Recreate the state of an installation that stored the api key before it was marked secret
        inTransaction { connection ->
            connection.prepareStatement(
                "UPDATE plugin_property SET secret = false WHERE plugin_definition_key = 'kvk-handelsregister' AND plugin_property_key = 'apikey'"
            ).use { assertThat(it.executeUpdate()).isEqualTo(1) }
            connection.prepareStatement(
                "INSERT INTO plugin_configuration (plugin_configuration_id, title, properties, plugin_definition_key) VALUES (?, ?, CAST(? AS JSON), 'kvk-handelsregister')"
            ).use {
                it.setObject(1, configurationId)
                it.setString(2, "KVK")
                it.setString(3, """{"handelsregisterBaseUrl":"https://example.com","apikey":"plain-key","connectionTimeout":1000}""")
                it.executeUpdate()
            }
        }
    }

    @AfterEach
    fun tearDown() {
        inTransaction { connection ->
            connection.prepareStatement("DELETE FROM plugin_configuration WHERE plugin_configuration_id = ?").use {
                it.setObject(1, configurationId)
                it.executeUpdate()
            }
            connection.prepareStatement(
                "UPDATE plugin_property SET secret = true WHERE plugin_definition_key = 'kvk-handelsregister' AND plugin_property_key = 'apikey'"
            ).use { it.executeUpdate() }
        }
    }

    @Test
    fun `should fail to read a plain text api key once it is secret, without the migration`() {
        inTransaction { connection ->
            connection.prepareStatement(
                "UPDATE plugin_property SET secret = true WHERE plugin_definition_key = 'kvk-handelsregister' AND plugin_property_key = 'apikey'"
            ).use { it.executeUpdate() }
        }

        assertThrows<Exception> {
            pluginService.getPluginConfiguration(PluginConfigurationId.existingId(configurationId)).properties
        }
    }

    @Test
    fun `should encrypt the stored api key and mark it secret`() {
        migration.migrate()

        assertThat(apiKeyIsSecret()).isTrue()
        val storedApiKey = storedProperties().get("apikey").textValue()
        assertThat(storedApiKey).startsWith(EncryptionService.PREFIX)
        assertThat(storedProperties().get("handelsregisterBaseUrl").textValue()).isEqualTo("https://example.com")
        assertThat(storedProperties().get("connectionTimeout").intValue()).isEqualTo(1000)

        val configuration = pluginService.getPluginConfiguration(PluginConfigurationId.existingId(configurationId))
        assertThat(configuration.properties!!.get("apikey").textValue()).isEqualTo("plain-key")
        val plugin = pluginService.createInstance(configuration) as KvkHandelsregisterPlugin
        assertThat(plugin.apikey).isEqualTo("plain-key")
    }

    @Test
    fun `should leave an already encrypted api key unchanged when run again`() {
        migration.migrate()
        val afterFirstRun = storedProperties().get("apikey").textValue()

        migration.migrate()

        assertThat(storedProperties().get("apikey").textValue()).isEqualTo(afterFirstRun)
        val configuration = pluginService.getPluginConfiguration(PluginConfigurationId.existingId(configurationId))
        assertThat(configuration.properties!!.get("apikey").textValue()).isEqualTo("plain-key")
    }

    private fun apiKeyIsSecret(): Boolean = inTransaction { connection ->
        connection.prepareStatement(
            "SELECT secret FROM plugin_property WHERE plugin_definition_key = 'kvk-handelsregister' AND plugin_property_key = 'apikey'"
        ).use { statement ->
            statement.executeQuery().use { it.next(); it.getBoolean(1) }
        }
    }

    private fun storedProperties() = inTransaction { connection ->
        connection.prepareStatement("SELECT properties FROM plugin_configuration WHERE plugin_configuration_id = ?").use { statement ->
            statement.setObject(1, configurationId)
            statement.executeQuery().use { it.next(); objectMapper.readTree(it.getString(1)) }
        }
    }

    private fun <T> inTransaction(block: (Connection) -> T): T =
        dataSource.connection.use { connection ->
            connection.autoCommit = false
            val result = block(connection)
            connection.commit()
            result
        }
}
