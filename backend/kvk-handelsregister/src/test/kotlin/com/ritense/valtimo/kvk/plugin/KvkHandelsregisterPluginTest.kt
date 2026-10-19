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

package com.ritense.valtimo.kvk.plugin

import com.ritense.plugin.annotation.PluginProperty
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class KvkHandelsregisterPluginTest {
    @Test
    fun `should mark the api key as a secret property`() {
        val apikey =
            KvkHandelsregisterPlugin::class.java
                .getDeclaredField("apikey")
                .getAnnotation(PluginProperty::class.java)

        assertTrue(
            apikey.secret,
            "The api key must be marked secret, otherwise it is returned by the plugin configuration " +
                "API and written out in plain text when a plugin configuration is exported",
        )
    }
}
