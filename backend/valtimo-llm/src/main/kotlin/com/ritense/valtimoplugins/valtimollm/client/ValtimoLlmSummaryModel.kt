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

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.valtimollm.client.valtimollm.MISTRAL_SYSTEM_MESSAGE
import com.ritense.valtimoplugins.valtimollm.client.valtimollm.MistralMessage
import com.ritense.valtimoplugins.valtimollm.client.valtimollm.MistralRequest
import com.ritense.valtimoplugins.valtimollm.client.valtimollm.resolveModel
import org.springframework.stereotype.Component

// Stateless: the endpoint comes with every call, so actions of different configurations can run at the same time.
@Component
@SkipComponentScan
class ValtimoLlmSummaryModel(
    private val chatCompletionsClients: ChatCompletionsClients,
) {
    fun giveSummary(
        endpoint: ModelEndpoint,
        longText: String,
    ): String {
        val request =
            MistralRequest(
                model = resolveModel(endpoint.model),
                messages =
                    listOf(
                        MistralMessage(role = "user", content = longText),
                        MISTRAL_SYSTEM_MESSAGE,
                    ),
                max_tokens = 500,
                stream = false,
            )

        return chatCompletionsClients
            .forEndpoint(endpoint.url, endpoint.token)
            .complete(request, SummaryResponse::class.java)
            .summaryText
    }
}
