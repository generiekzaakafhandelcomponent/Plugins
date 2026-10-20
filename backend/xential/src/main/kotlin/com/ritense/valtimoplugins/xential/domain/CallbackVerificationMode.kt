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

package com.ritense.valtimoplugins.xential.domain

/**
 * Determines what happens when the signature on an incoming Xential document callback cannot be verified.
 *
 * Enabling verification is a coordinated change: the Xential/ESB side has to sign its callbacks before Valtimo
 * may start rejecting unsigned ones. [LOG_ONLY] exists to make that roll-out safe and is therefore the default.
 */
enum class CallbackVerificationMode {
    /**
     * Verify the signature and log the outcome, but process the callback either way.
     *
     * Use this while the sending side is being migrated: it surfaces whether callbacks are correctly signed
     * without breaking a running integration.
     *
     * This mode changes no outcome, and that has a price worth being explicit about: an unverifiable callback is
     * still accepted, so the endpoint offers no protection against a forged callback or a session-id grind while
     * it is in force. Unverifiable callbacks are counted against the rate limit budget but not blocked, precisely
     * because blocking would change an outcome. Treat this mode as a migration step with a deadline.
     */
    LOG_ONLY,

    /**
     * Verify the signature and reject the callback when it is missing or does not match.
     *
     * Only switch to this once the sending side has been confirmed to sign every callback.
     *
     * One upgrade edge case: document creation sessions started before this plugin recorded which configuration
     * created them cannot be verified at all, so this mode rejects them
     * ([CallbackVerificationResult.UNKNOWN_PLUGIN_CONFIGURATION]). Wait for those sessions to expire, or restart
     * the affected processes, before switching over.
     */
    ENFORCE,
}
