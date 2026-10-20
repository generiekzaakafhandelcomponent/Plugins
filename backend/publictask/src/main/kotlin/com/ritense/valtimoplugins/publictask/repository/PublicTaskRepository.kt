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

package com.ritense.valtimoplugins.publictask.repository

import com.ritense.valtimoplugins.publictask.domain.PublicTaskEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Propagation.REQUIRES_NEW
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

interface PublicTaskRepository : JpaRepository<PublicTaskEntity, UUID> {
    /** Claims a slot in its own transaction, so simultaneous uploads cannot both take the last free one. */
    @Transactional(propagation = REQUIRES_NEW)
    @Modifying
    @Query(
        """
        update PublicTaskEntity publicTask
           set publicTask.attachmentCount = publicTask.attachmentCount + 1
         where publicTask.publicTaskId = :publicTaskId
           and publicTask.attachmentCount < publicTask.maxAttachments
        """,
    )
    fun reserveAttachmentSlot(
        @Param("publicTaskId") publicTaskId: UUID,
    ): Int

    /** Gives back a slot claimed by [reserveAttachmentSlot] for an upload that was refused. */
    @Transactional(propagation = REQUIRES_NEW)
    @Modifying
    @Query(
        """
        update PublicTaskEntity publicTask
           set publicTask.attachmentCount = publicTask.attachmentCount - 1
         where publicTask.publicTaskId = :publicTaskId
           and publicTask.attachmentCount > 0
        """,
    )
    fun releaseAttachmentSlot(
        @Param("publicTaskId") publicTaskId: UUID,
    ): Int
}
