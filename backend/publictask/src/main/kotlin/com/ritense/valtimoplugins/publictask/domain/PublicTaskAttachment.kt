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

/**
 * The value one uploaded file takes in the submission. Valtimo 12's UploadField takes a temporary resource from
 * `/id`; `/data/resourceId` is left out, because UploadField reads that as the UUID of an already stored resource.
 */
data class PublicTaskAttachment(
    val id: String,
    val originalName: String,
    val name: String,
    val size: Long,
    val type: String,
    val storage: String = STORAGE_PROVIDER_NAME,
) {
    companion object {
        // The name the page registers its Form.io storage provider under.
        const val STORAGE_PROVIDER_NAME = "publicTask"
    }
}
