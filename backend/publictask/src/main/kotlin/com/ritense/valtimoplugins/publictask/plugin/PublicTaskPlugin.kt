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

package com.ritense.valtimoplugins.publictask.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.publictask.domain.PublicTaskAttachmentLimits
import com.ritense.valtimoplugins.publictask.domain.PublicTaskData
import com.ritense.valtimoplugins.publictask.domain.PublicTaskDocumentMetadata
import com.ritense.valtimoplugins.publictask.service.PublicTaskService
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.util.UUID

@Plugin(
    key = "public-task",
    title = "Public Task Plugin",
    description = "Expose a public task outside the Valtimo UI with the Public Task plugin",
)
class PublicTaskPlugin(
    private val publicTaskService: PublicTaskService,
    private val valueResolverService: ValueResolverService,
) {
    @PluginProperty(key = "baseUrl", secret = false, required = false)
    private var baseUrl: String? = null

    /** Creates a public task and hands its URL to the process. The attachment limits bound its upload endpoint. */
    @PluginAction(
        key = "create-public-task",
        title = "Create Public Task",
        description = "create a public task and expose it",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun createPublicTask(
        execution: DelegateExecution,
        @PluginActionProperty pvAssigneeCandidateContactData: String,
        @PluginActionProperty timeToLive: String?,
        @PluginActionProperty maxAttachments: Int?,
        @PluginActionProperty maxAttachmentSizeInBytes: Long?,
        @PluginActionProperty acceptedMimeTypes: String?,
        @PluginActionProperty documentMetadata: Map<String, String?>?,
    ) {
        val publicTaskData =
            PublicTaskData.from(
                userTaskId = UUID.fromString(execution.getVariableLocal("userTaskId") as String),
                processBusinessKey = execution.processBusinessKey,
                assigneeCandidateContactData = pvAssigneeCandidateContactData,
                timeToLive = timeToLive,
                attachmentLimits =
                    PublicTaskAttachmentLimits.of(
                        maxAttachments = maxAttachments,
                        maxSizeInBytes = maxAttachmentSizeInBytes,
                        acceptedMimeTypes = acceptedMimeTypes,
                    ),
                documentMetadata = PublicTaskDocumentMetadata.of(resolved(execution, documentMetadata)),
            )

        publicTaskService.createAndSendPublicTaskUrl(
            execution = execution,
            publicTaskData = publicTaskData,
            configuredBaseUrl = baseUrl,
        )
    }

    /**
     * Valtimo resolves a placeholder only in an action property that is a string, and this one is a map, so
     * its values are resolved here instead.
     */
    private fun resolved(
        execution: DelegateExecution,
        documentMetadata: Map<String, String?>?,
    ): Map<String, String?>? =
        documentMetadata?.mapValues { (key, value) ->
            if (value.isNullOrBlank()) value else resolvedValue(execution, key, value)
        }

    /**
     * One value at a time, so that a value which resolves to nothing costs only its own key.
     */
    private fun resolvedValue(
        execution: DelegateExecution,
        key: String,
        value: String,
    ): String? {
        val resolved =
            try {
                valueResolverService
                    .resolveValues(execution.processInstanceId, execution, listOf(value))[value]
            } catch (e: Exception) {
                // Everything before a ':' reads as a prefix, and an unknown one is refused rather than
                // resolved - which is what ordinary text with a colon in it looks like from here.
                logger.debug(e) { "Kept document metadata '$key' of a public task as it was written" }
                return value
            }
        if (resolved == null) {
            logger.warn {
                "Document metadata '$key' of a public task resolves to nothing, so the files of this task " +
                    "are filed without it. Check that '$value' exists at the moment this task runs."
            }
        }
        return resolved?.toString()
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
