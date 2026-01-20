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

package com.ritense.valtimoplugins.oipklanttaak.domain

import com.fasterxml.jackson.annotation.JsonValue

enum class LevelOfAssurance(@JsonValue val value: String) {
    PASSWORD_PROTECTED_TRANSPORT("urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"),
    MOBILE_TWO_FACTOR_CONTRACT("urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorContract"),
    SMARTCARD("urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard"),
    SMARTCARD_PKI("urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI"),
}
