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

package com.ritense.valtimoplugins.publictask.domain

import com.ritense.resource.domain.MetadataType
import com.ritense.valtimoplugins.publictask.BaseTest
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.entry
import org.junit.jupiter.api.Test

internal class PublicTaskDocumentMetadataTest : BaseTest() {
    @Test
    fun `a process link that configures no metadata gets none`() {
        assertThat(PublicTaskDocumentMetadata.of(null).fields).isEmpty()
        assertThat(PublicTaskDocumentMetadata.of(emptyMap()).fields).isEmpty()
    }

    @Test
    fun `the keys a process link configures are kept as they are`() {
        val metadata =
            PublicTaskDocumentMetadata.of(
                mapOf(
                    "informatieobjecttype" to "https://catalogi.example.org/informatieobjecttypen/1",
                    "titel" to "Bijlage bij de aanvraag",
                ),
            )

        assertThat(metadata.fields)
            .containsEntry("informatieobjecttype", "https://catalogi.example.org/informatieobjecttypen/1")
            .containsEntry("titel", "Bijlage bij de aanvraag")
    }

    @Test
    fun `a key or value left empty means it was not set`() {
        val metadata =
            PublicTaskDocumentMetadata.of(
                mapOf(
                    " titel " to "Bijlage",
                    "beschrijving" to "  ",
                    "taal" to null,
                    "  " to "nergens bij",
                ),
            )

        assertThat(metadata.fields).containsOnly(entry("titel", "Bijlage"))
    }

    @Test
    fun `a process link cannot set the keys the plugin owns`() {
        // A submission is checked against 'user' and 'documentId'; configuring them would configure that away.
        val metadata =
            PublicTaskDocumentMetadata.of(
                mapOf(
                    MetadataType.USER.key to "a-logged-in-user",
                    MetadataType.DOCUMENT_ID.key to "a-different-case",
                    MetadataType.FILE_NAME.key to "iets-anders.pdf",
                    MetadataType.CONTENT_TYPE.key to "application/pdf",
                    "titel" to "Bijlage",
                ),
            )

        assertThat(metadata.fields).containsOnlyKeys("titel")
    }

    @Test
    fun `metadata survives being stored and read back`() {
        val metadata =
            PublicTaskDocumentMetadata.of(
                mapOf(
                    "titel" to """Een "titel", met komma's""",
                    "informatieobjecttype" to "https://catalogi.example.org/informatieobjecttypen/1",
                ),
            )

        assertThat(PublicTaskDocumentMetadata.fromJson(metadata.toJson())).isEqualTo(metadata)
    }

    @Test
    fun `a task without metadata is stored as nothing rather than as an empty document`() {
        assertThat(PublicTaskDocumentMetadata().toJson()).isEmpty()
        assertThat(PublicTaskDocumentMetadata.fromJson("").fields).isEmpty()
        assertThat(PublicTaskDocumentMetadata.fromJson(null).fields).isEmpty()
    }

    @Test
    fun `metadata that cannot be read leaves the upload without it rather than failing`() {
        assertThat(PublicTaskDocumentMetadata.fromJson("{niet eens json").fields).isEmpty()
    }
}
