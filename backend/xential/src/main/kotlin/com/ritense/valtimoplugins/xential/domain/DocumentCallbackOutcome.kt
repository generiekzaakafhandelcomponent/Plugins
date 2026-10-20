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
 * The result of handling an incoming Xential document callback.
 *
 * There is deliberately a single failure value. A malformed session id, an unknown session id, an expired
 * session, an undecodable payload and a missing or wrong signature all map onto [REJECTED], so that the endpoint
 * cannot be used to probe which document creation sessions exist.
 *
 * That single value matters more than it looks. Resolving the shared secret requires knowing which plugin
 * configuration created the session, so the session has to be looked up *before* the signature can be checked.
 * With separate values for "no such session" and "bad signature" that ordering would hand an unauthenticated
 * caller a session-existence oracle. Keeping one value makes that impossible to reintroduce by accident at the
 * web layer: there is nothing left to tell apart.
 *
 * [RATE_LIMITED] is reachable only for callbacks that already failed verification, and it is applied to every
 * failure cause alike, so it cannot discriminate between them either.
 */
enum class DocumentCallbackOutcome {
    /** The document was stored and the BPMN message was correlated. */
    PROCESSED,

    /** The callback was not accepted. The real cause is logged, never returned. */
    REJECTED,

    /** More unverifiable callbacks arrived than the endpoint is configured to absorb. */
    RATE_LIMITED,
}
