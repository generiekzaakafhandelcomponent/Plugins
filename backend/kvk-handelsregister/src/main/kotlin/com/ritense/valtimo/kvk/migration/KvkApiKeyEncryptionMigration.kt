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
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.databind.node.TextNode
import com.ritense.plugin.service.EncryptionService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.SmartInitializingSingleton
import java.nio.ByteBuffer
import java.sql.Connection
import java.sql.SQLException
import java.util.UUID
import javax.sql.DataSource

/**
 * Encrypts KVK api keys that were stored in plain text before the `apikey` plugin property was marked secret.
 *
 * Valtimo decrypts every secret property when a plugin configuration is read, and does not migrate values that
 * were stored before a property became secret. Without this migration, reading an existing KVK plugin
 * configuration would fail after upgrading.
 *
 * This runs once all singletons are created, so before the web server and the job executor start, and before
 * Valtimo deploys the plugin definitions. In one transaction it marks the `apikey` property as secret in the plugin
 * definition and encrypts every stored api key that is not encrypted yet, in the same format Valtimo uses. Running it
 * again changes nothing.
 */
class KvkApiKeyEncryptionMigration(
    private val dataSource: DataSource,
    private val encryptionService: EncryptionService,
) : SmartInitializingSingleton {

    private val objectMapper = ObjectMapper()

    override fun afterSingletonsInstantiated() {
        migrate()
    }

    fun migrate() {
        dataSource.connection.use { connection ->
            val autoCommit = connection.autoCommit
            connection.autoCommit = false
            try {
                if (!pluginTablesExist(connection)) {
                    logger.debug { "Plugin tables do not exist yet, no KVK api keys to encrypt" }
                    connection.rollback()
                    return
                }
                markApiKeySecret(connection)
                val migratedIds = encryptStoredApiKeys(connection)
                connection.commit()
                if (migratedIds.isNotEmpty()) {
                    logger.info { "Encrypted the api key of KVK plugin configuration(s): ${migratedIds.joinToString()}" }
                }
            } catch (e: Exception) {
                connection.rollback()
                throw IllegalStateException("Failed to encrypt the stored KVK api keys", e)
            } finally {
                connection.autoCommit = autoCommit
            }
        }
    }

    /**
     * Encrypts the api key in the given plugin configuration properties when it is not encrypted yet.
     *
     * @return true when the properties were changed
     */
    fun encryptApiKey(properties: ObjectNode): Boolean {
        val apiKey = properties.get(API_KEY_FIELD)
        if (apiKey == null || apiKey.isNull) {
            return false
        }
        if (apiKey.isTextual && apiKey.textValue().startsWith(EncryptionService.PREFIX)) {
            return false
        }
        // Same format as com.ritense.plugin.domain.PluginConfiguration.encryptProperty
        val encrypted = encryptionService.encrypt(objectMapper.writeValueAsString(apiKey))
        properties.replace(API_KEY_FIELD, TextNode(encrypted))
        return true
    }

    private fun pluginTablesExist(connection: Connection): Boolean {
        val savepoint = connection.setSavepoint()
        return try {
            connection.prepareStatement(
                "SELECT COUNT(*) FROM plugin_property, plugin_configuration WHERE 1 = 0"
            ).use { it.executeQuery().close() }
            connection.releaseSavepoint(savepoint)
            true
        } catch (e: SQLException) {
            connection.rollback(savepoint)
            false
        }
    }

    private fun markApiKeySecret(connection: Connection) {
        connection.prepareStatement(
            "UPDATE plugin_property SET secret = ? WHERE plugin_definition_key = ? AND plugin_property_key = ?"
        ).use { statement ->
            statement.setBoolean(1, true)
            statement.setString(2, PLUGIN_DEFINITION_KEY)
            statement.setString(3, API_KEY_PROPERTY_KEY)
            statement.executeUpdate()
        }
    }

    private fun encryptStoredApiKeys(connection: Connection): List<String> {
        val updates = mutableListOf<Pair<Any, String>>()
        connection.prepareStatement(
            "SELECT plugin_configuration_id, properties FROM plugin_configuration WHERE plugin_definition_key = ?"
        ).use { statement ->
            statement.setString(1, PLUGIN_DEFINITION_KEY)
            statement.executeQuery().use { resultSet ->
                while (resultSet.next()) {
                    val id = resultSet.getObject(1)
                    val properties = resultSet.getString(2)?.let { objectMapper.readTree(it) }
                    if (properties is ObjectNode && encryptApiKey(properties)) {
                        updates.add(id to objectMapper.writeValueAsString(properties))
                    }
                }
            }
        }

        if (updates.isEmpty()) {
            return emptyList()
        }

        // CAST(? AS JSON) works for the JSON column type on both PostgreSQL and MySQL
        connection.prepareStatement(
            "UPDATE plugin_configuration SET properties = CAST(? AS JSON) WHERE plugin_configuration_id = ?"
        ).use { statement ->
            updates.forEach { (id, properties) ->
                statement.setString(1, properties)
                statement.setObject(2, id)
                statement.executeUpdate()
            }
        }
        return updates.map { (id, _) -> displayId(id) }
    }

    // MySQL stores the id as BINARY(16), PostgreSQL as UUID
    private fun displayId(id: Any): String =
        if (id is ByteArray && id.size == 16) {
            val buffer = ByteBuffer.wrap(id)
            UUID(buffer.long, buffer.long).toString()
        } else {
            id.toString()
        }

    companion object {
        private val logger = KotlinLogging.logger {}

        const val PLUGIN_DEFINITION_KEY = "kvk-handelsregister"
        const val API_KEY_PROPERTY_KEY = "apikey"
        const val API_KEY_FIELD = "apikey"
    }
}
