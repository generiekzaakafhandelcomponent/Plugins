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

package com.ritense.valtimoplugins.publictask.repository

import com.ritense.valtimoplugins.publictask.BaseIntegrationTest
import com.ritense.valtimoplugins.publictask.domain.PublicTaskAttachmentLimits
import com.ritense.valtimoplugins.publictask.domain.PublicTaskEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDate
import java.util.UUID

internal class PublicTaskRepositoryIT : BaseIntegrationTest() {
    @Autowired
    lateinit var publicTaskRepository: PublicTaskRepository

    @Test
    fun `a public task starts with all of its attachment slots free`() {
        val publicTaskId = givenAPublicTask()

        assertThat(publicTaskRepository.findById(publicTaskId).get().attachmentCount).isZero()
    }

    @Test
    fun `claiming a slot is refused once the limit is reached, and the count stops there`() {
        val publicTaskId = givenAPublicTask(maxAttachments = 2)

        assertThat(publicTaskRepository.reserveAttachmentSlot(publicTaskId)).isEqualTo(1)
        assertThat(publicTaskRepository.reserveAttachmentSlot(publicTaskId)).isEqualTo(1)
        assertThat(publicTaskRepository.reserveAttachmentSlot(publicTaskId)).isEqualTo(0)

        assertThat(publicTaskRepository.findById(publicTaskId).get().attachmentCount).isEqualTo(2)
    }

    @Test
    fun `the limit a slot is claimed against is the one stored on the task itself`() {
        val oneSlot = givenAPublicTask(maxAttachments = 1)
        val threeSlots = givenAPublicTask(maxAttachments = 3)

        assertThat(publicTaskRepository.reserveAttachmentSlot(oneSlot)).isEqualTo(1)
        assertThat(publicTaskRepository.reserveAttachmentSlot(oneSlot)).isEqualTo(0)

        assertThat(publicTaskRepository.reserveAttachmentSlot(threeSlots)).isEqualTo(1)
        assertThat(publicTaskRepository.reserveAttachmentSlot(threeSlots)).isEqualTo(1)
    }

    @Test
    fun `a task with no slots at all cannot be uploaded to`() {
        val publicTaskId = givenAPublicTask(maxAttachments = 0)

        assertThat(publicTaskRepository.reserveAttachmentSlot(publicTaskId)).isEqualTo(0)
    }

    @Test
    fun `a released slot can be claimed again`() {
        val publicTaskId = givenAPublicTask(maxAttachments = 1)
        publicTaskRepository.reserveAttachmentSlot(publicTaskId)

        assertThat(publicTaskRepository.reserveAttachmentSlot(publicTaskId)).isEqualTo(0)
        assertThat(publicTaskRepository.releaseAttachmentSlot(publicTaskId)).isEqualTo(1)
        assertThat(publicTaskRepository.reserveAttachmentSlot(publicTaskId)).isEqualTo(1)

        assertThat(publicTaskRepository.findById(publicTaskId).get().attachmentCount).isEqualTo(1)
    }

    @Test
    fun `the count is never pushed below zero by a release`() {
        val publicTaskId = givenAPublicTask()

        assertThat(publicTaskRepository.releaseAttachmentSlot(publicTaskId)).isEqualTo(0)
        assertThat(publicTaskRepository.findById(publicTaskId).get().attachmentCount).isZero()
    }

    @Test
    fun `claiming a slot of a task that does not exist reports that there was none`() {
        assertThat(publicTaskRepository.reserveAttachmentSlot(UUID.randomUUID())).isEqualTo(0)
    }

    @Test
    fun `the slots of one public task are not spent by another`() {
        val publicTaskId = givenAPublicTask()
        val otherPublicTaskId = givenAPublicTask()

        publicTaskRepository.reserveAttachmentSlot(publicTaskId)

        assertThat(publicTaskRepository.findById(publicTaskId).get().attachmentCount).isEqualTo(1)
        assertThat(publicTaskRepository.findById(otherPublicTaskId).get().attachmentCount).isZero()
    }

    @Test
    fun `the limits a task was created with are what it is read back with`() {
        val publicTaskId = givenAPublicTask(maxAttachments = 4)

        val publicTask = publicTaskRepository.findById(publicTaskId).get()

        assertThat(publicTask.attachmentLimits()).isEqualTo(
            PublicTaskAttachmentLimits(
                maxAttachments = 4,
                maxSizeInBytes = 2048,
                acceptedMimeTypes = listOf("application/pdf", "image/jpeg"),
            ),
        )
    }

    private fun givenAPublicTask(maxAttachments: Int = PublicTaskAttachmentLimits.DEFAULT_MAX_ATTACHMENTS): UUID =
        publicTaskRepository
            .save(
                PublicTaskEntity(
                    publicTaskId = UUID.randomUUID(),
                    userTaskId = UUID.randomUUID(),
                    processBusinessKey = UUID.randomUUID().toString(),
                    assigneeCandidateContactData = "citizen@example.org",
                    taskExpirationDate = LocalDate.now().plusDays(1).toString(),
                    isCompletedByPublicTask = false,
                    maxAttachments = maxAttachments,
                    maxAttachmentSizeInBytes = 2048,
                    acceptedMimeTypes = "application/pdf,image/jpeg",
                ),
            ).publicTaskId
}
