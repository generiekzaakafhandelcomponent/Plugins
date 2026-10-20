/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.valtimollm.client

import java.net.URI

// The language model of one plugin configuration. It goes with every call, so one shared bean serves every configuration.
data class ModelEndpoint(
    val url: URI,
    val token: String,
    val model: String? = null,
) {
    // Keeps the token out of logs and exception messages.
    override fun toString() = "ModelEndpoint(url=$url, model=$model)"
}
