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

package com.ritense.valtimoplugins.publictask.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "public_task_plugin_entity")
data class PublicTaskEntity(
    @Id
    @field:Column(name = "public_task_id")
    val publicTaskId: UUID = UUID.randomUUID(),
    @field:Column(name = "user_task_id")
    val userTaskId: UUID = UUID.randomUUID(),
    @field:Column(name = "process_business_key")
    val processBusinessKey: String = "",
    @field:Column(name = "assignee_candidate_contact_data")
    val assigneeCandidateContactData: String = "",
    @field:Column(name = "task_expiration_date")
    val taskExpirationDate: String = "",
    @field:Column(name = "is_completed_by_public_task")
    val isCompletedByPublicTask: Boolean = false,
    @field:Column(name = "attachment_count")
    val attachmentCount: Int = 0,
    @field:Column(name = "max_attachments")
    val maxAttachments: Int = PublicTaskAttachmentLimits.DEFAULT_MAX_ATTACHMENTS,
    @field:Column(name = "max_attachment_size_in_bytes")
    val maxAttachmentSizeInBytes: Long = PublicTaskAttachmentLimits.DEFAULT_MAX_SIZE_IN_BYTES,
    @field:Column(name = "accepted_mime_types")
    val acceptedMimeTypes: String = "",
    // JSON, because the values are free text a delimiter would not survive.
    @field:Column(name = "document_metadata")
    val documentMetadataJson: String = "",
    @field:Column(name = "base_url")
    val baseUrl: String = "",
) {
    fun attachmentLimits(): PublicTaskAttachmentLimits =
        PublicTaskAttachmentLimits(
            maxAttachments = maxAttachments,
            maxSizeInBytes = maxAttachmentSizeInBytes,
            acceptedMimeTypes = PublicTaskAttachmentLimits.parseMimeTypes(acceptedMimeTypes),
        )

    fun documentMetadata(): PublicTaskDocumentMetadata = PublicTaskDocumentMetadata.fromJson(documentMetadataJson)
}
