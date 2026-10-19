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
 * Why the signature on an incoming Xential document callback did or did not check out.
 *
 * Only [VERIFIED] means the callback provably came from a holder of the shared secret. The remaining values are
 * all failures, and they are kept apart purely so that the log line names the actual cause: they are never
 * reflected in the HTTP response, which is identical for every failure.
 *
 * @param explanation the cause, phrased to be appended to a log message.
 */
enum class CallbackVerificationResult(
    val explanation: String,
) {
    /** The signature was present and matched the expected value. */
    VERIFIED("the signature matched"),

    /** A secret was available and the signature was absent, not hex, or did not match. */
    INVALID_SIGNATURE("the signature is missing or does not match"),

    /**
     * The plugin configuration that created this document creation session has no `callbackSecret`.
     *
     * Nothing can be verified until one is configured on that configuration and on the sending side.
     */
    NO_SECRET_CONFIGURED("no callbackSecret is configured on the plugin configuration that created the session"),

    /**
     * The document creation session does not record which plugin configuration created it.
     *
     * This is the one upgrade edge case: sessions started before this version have no recorded configuration, so
     * there is no way to tell which `callbackSecret` their callback should be checked against. Such sessions
     * cannot be verified for the rest of their lifetime. Leave verification in
     * [CallbackVerificationMode.LOG_ONLY] until they have drained, or restart the affected processes.
     */
    UNKNOWN_PLUGIN_CONFIGURATION(
        "the document creation session predates this version and does not record which plugin configuration " +
            "created it, so its callbackSecret cannot be resolved",
    ),

    /** The recorded plugin configuration no longer exists, or is no longer a Xential configuration. */
    PLUGIN_CONFIGURATION_UNRESOLVABLE(
        "the plugin configuration recorded on the document creation session could not be resolved",
    ),
    ;

    /** Whether the callback provably came from a holder of the shared secret. */
    val isVerified: Boolean get() = this == VERIFIED
}
