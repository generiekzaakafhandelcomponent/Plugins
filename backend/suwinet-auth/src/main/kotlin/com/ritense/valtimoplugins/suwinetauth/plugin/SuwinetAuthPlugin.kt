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

package com.ritense.valtimoplugins.suwinetauth.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginCategory
import com.ritense.plugin.annotation.PluginProperty
import io.github.oshai.kotlinlogging.KotlinLogging

@PluginCategory("authentication")
@Plugin(
    key = "suwnet-auth",
    title = "Suwinet Auth plugin",
    description = "Plugin delivering authentication for Suwinet plugin"
)
open class SuwinetAuthPlugin(

) {

    @PluginProperty(key = "keystorePath", secret = false, required = false)
    var keystorePath: String? = null

    @PluginProperty(key = "keystoreSecret", secret = true, required = false)
    var keystoreSecret: String? = null

    @PluginProperty(key = "truststorePath", secret = false, required = false)
    var truststorePath: String? = null

    @PluginProperty(key = "truststoreSecret", secret = true, required = false)
    var truststoreSecret: String? = null

    @PluginProperty(key = "basicAuthName", secret = false, required = false)
    var basicAuthName: String? = null

    @PluginProperty(key = "basicAuthSecret", secret = true, required = false)
    var basicAuthSecret: String? = null

    @PluginProperty(key = "headerKey", secret = false, required = false)
    var headerKey: String? = null

    @PluginProperty(key = "headerValue", secret = true, required = false)
    var headerValue: String? = null



    companion object {
        private val logger = KotlinLogging.logger { }
    }

}
