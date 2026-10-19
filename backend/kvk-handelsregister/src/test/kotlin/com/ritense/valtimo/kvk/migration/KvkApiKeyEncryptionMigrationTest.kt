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
import com.ritense.plugin.service.EncryptionService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock

internal class KvkApiKeyEncryptionMigrationTest {

    private val objectMapper = ObjectMapper()
    private val encryptionService = EncryptionService("abcdefghijklmnop")
    private val migration = KvkApiKeyEncryptionMigration(mock(), encryptionService)

    @Test
    fun `should encrypt a plain text api key in the format Valtimo decrypts`() {
        val properties = properties("""{"handelsregisterBaseUrl":"https://example.com","apikey":"plain-key"}""")

        val changed = migration.encryptApiKey(properties)

        assertThat(changed).isTrue()
        val stored = properties.get("apikey").textValue()
        assertThat(stored).startsWith(EncryptionService.PREFIX)
        assertThat(stored).doesNotContain("plain-key")
        // Same steps as com.ritense.plugin.domain.PluginConfiguration.decryptProperty
        assertThat(objectMapper.readTree(encryptionService.decrypt(stored)).textValue()).isEqualTo("plain-key")
        assertThat(properties.get("handelsregisterBaseUrl").textValue()).isEqualTo("https://example.com")
    }

    @Test
    fun `should not change an api key that is already encrypted`() {
        val encrypted = encryptionService.encrypt("\"plain-key\"")
        val properties = properties("""{"apikey":"$encrypted"}""")

        val changed = migration.encryptApiKey(properties)

        assertThat(changed).isFalse()
        assertThat(properties.get("apikey").textValue()).isEqualTo(encrypted)
    }

    @Test
    fun `should not change properties without an api key`() {
        val missing = properties("""{"handelsregisterBaseUrl":"https://example.com"}""")
        val nullValue = properties("""{"apikey":null}""")

        assertThat(migration.encryptApiKey(missing)).isFalse()
        assertThat(migration.encryptApiKey(nullValue)).isFalse()
        assertThat(missing.has("apikey")).isFalse()
        assertThat(nullValue.get("apikey").isNull).isTrue()
    }

    @Test
    fun `should encrypt the api key only once when run twice`() {
        val properties = properties("""{"apikey":"plain-key"}""")

        assertThat(migration.encryptApiKey(properties)).isTrue()
        val firstRun = properties.get("apikey").textValue()
        assertThat(migration.encryptApiKey(properties)).isFalse()
        assertThat(properties.get("apikey").textValue()).isEqualTo(firstRun)
    }

    private fun properties(json: String) = objectMapper.readTree(json) as ObjectNode
}
