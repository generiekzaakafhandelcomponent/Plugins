/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.xential.service

import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.time.LocalDateTime

/**
 * Removes document creation sessions that were never called back on.
 *
 * Without this sweep an expired session would stay in the database indefinitely. Rejecting expired sessions on
 * the callback is what closes the replay window; deleting them keeps the table from growing without bound.
 *
 * Open so that Spring can create the CGLIB proxy that `@Transactional` requires.
 */
open class XentialTokenCleanupService(
    private val xentialTokenRepository: XentialTokenRepository,
    private val clock: Clock = Clock.systemDefaultZone(),
) {
    @Scheduled(cron = "\${valtimo.xential.callback.token-cleanup-cron:0 0 * * * *}")
    @Transactional
    open fun deleteExpiredTokens() {
        xentialTokenRepository.findAllByExpiresOnBefore(LocalDateTime.now(clock)).let { expiredTokens ->
            if (expiredTokens.isNotEmpty()) {
                xentialTokenRepository.deleteAll(expiredTokens)
                logger.info { "Deleted ${expiredTokens.size} expired Xential document creation session(s)" }
            }
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
