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

package com.ritense.valtimoplugins.smtpmail.dto

import com.fasterxml.jackson.core.type.TypeReference
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimoplugins.smtpmail.BaseTest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

class EmailListTest : BaseTest() {
    private val objectMapper = MapperSingleton.get()

    // -- Binding: against the same mapper Valtimo binds action properties with ----------------

    @Test
    fun `binds a single string, the shape of a text field holding one address`() {
        assertEquals(EmailList(listOf(Email("jan@example.com"))), convert("jan@example.com"))
    }

    @Test
    fun `binds a separated string without splitting it`() {
        // Splitting belongs to the plugin, where the header injection guard runs first.
        assertEquals(
            EmailList(listOf(Email("jan@example.com,piet@example.com"))),
            convert("jan@example.com,piet@example.com"),
        )
    }

    @Test
    fun `binds a list of strings, the shape of a field holding several addresses`() {
        assertEquals(
            EmailList(listOf(Email("jan@example.com"), Email("piet@example.com"))),
            convert(listOf("jan@example.com", "piet@example.com")),
        )
    }

    @Test
    fun `binds an empty list`() {
        assertEquals(EmailList(emptyList()), convert(emptyList<String>()))
    }

    @Test
    fun `rejects an element that is not a string`() {
        assertThrows<IllegalArgumentException> { convert(listOf(42)) }
    }

    @Test
    fun `rejects an object`() {
        assertThrows<IllegalArgumentException> { convert(mapOf("email" to "jan@example.com")) }
    }

    @Test
    fun `serializes back to a plain array of addresses`() {
        assertEquals(
            """["jan@example.com","piet@example.com"]""",
            objectMapper.writeValueAsString(EmailList(listOf(Email("jan@example.com"), Email("piet@example.com")))),
        )
    }

    /** The reason EmailList exists; should this ever start passing, drop it for List<Email>. */
    @Test
    fun `a plain list of Email does not bind a single string`() {
        assertThrows<IllegalArgumentException> {
            objectMapper.convertValue("jan@example.com", object : TypeReference<List<Email>>() {})
        }
    }

    // -- normalized -------------------------------------------------------------------------

    @ParameterizedTest
    @ValueSource(
        strings = [
            "jan@example.com,piet@example.com",
            "jan@example.com;piet@example.com",
            "jan@example.com, piet@example.com",
            " jan@example.com ; piet@example.com ",
            "jan@example.com,,piet@example.com",
            "jan@example.com;,piet@example.com;",
        ],
    )
    fun `normalized splits a separated value`(value: String) {
        assertEquals(
            listOf(Email("jan@example.com"), Email("piet@example.com")),
            emailList(value).normalized("recipients"),
        )
    }

    @Test
    fun `normalized leaves a single address untouched`() {
        assertEquals(listOf(Email("dev@localhost")), emailList("dev@localhost").normalized("recipients"))
    }

    @Test
    fun `normalized leaves an already separate list untouched`() {
        val separate = emailList("jan@example.com", "piet@example.com")

        assertEquals(separate.addresses, separate.normalized("recipients"))
    }

    @Test
    fun `normalized splits a separated value in a list that also holds single addresses`() {
        assertEquals(
            listOf(Email("jan@example.com"), Email("piet@example.com"), Email("klaas@example.com")),
            emailList("jan@example.com", "piet@example.com;klaas@example.com").normalized("recipients"),
        )
    }

    @Test
    fun `normalized returns an empty list for an empty value and for separators only`() {
        assertEquals(emptyList<Email>(), EmailList(emptyList()).normalized("cc"))
        assertEquals(emptyList<Email>(), emailList(" , ; ").normalized("cc"))
        assertEquals(emptyList<Email>(), emailList("").normalized("cc"))
    }

    @Test
    fun `normalized validates every address it produces and names the field`() {
        val exception =
            assertThrows<IllegalArgumentException> {
                emailList("jan@example.com,not-an-address").normalized("recipients")
            }

        assertTrue(exception.message!!.contains("not-an-address"))
        assertTrue(exception.message!!.contains("recipients"))
    }

    @Test
    fun `normalized rejects CRLF before it splits`() {
        val injected = "jan@example.com,evil@example.com\r\nBcc: evil@example.com"

        val exception =
            assertThrows<IllegalArgumentException> { emailList(injected).normalized("recipients") }

        assertTrue(exception.message!!.contains("CR or LF"))
    }

    private fun convert(value: Any?): EmailList = objectMapper.convertValue(value, EmailList::class.java)

    private fun emailList(vararg addresses: String) = EmailList(addresses.map { Email(it) })
}
