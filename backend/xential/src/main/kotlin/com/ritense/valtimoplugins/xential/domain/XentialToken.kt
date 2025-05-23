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

package com.ritense.valtimoplugins.xential.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "xential_tokens")
class XentialToken(
    @Id
    @Column(name = "token", nullable = false, updatable = false)
    val token: UUID,
    @Column(name = "process_id", nullable = false, updatable = false)
    val processId: UUID,
    @Column(name = "message_name", nullable = false, updatable = false)
    val messageName: String,
    @Column(name = "resume_url", nullable = true, updatable = false)
    val resumeUrl: String?,
)
