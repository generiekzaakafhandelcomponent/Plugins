package com.ritense.valtimoplugins.openklant.util

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.util.UUID

class StringExtensionsTest {
    @Nested
    inner class TrimToNull {
        @Test
        fun `trims surrounding whitespace`() {
            assertEquals("portaalvoorkeur", "  portaalvoorkeur  ".trimToNull())
            assertEquals("portaalvoorkeur", "\tportaalvoorkeur\n".trimToNull())
        }

        @Test
        fun `keeps a value that needs no trimming`() {
            assertEquals("portaalvoorkeur", "portaalvoorkeur".trimToNull())
        }

        @Test
        fun `keeps whitespace inside the value`() {
            assertEquals("Herinnering: openstaande taak", "  Herinnering: openstaande taak ".trimToNull())
        }

        @Test
        fun `returns null for a null value`() {
            assertNull(null.trimToNull())
        }

        @Test
        fun `returns null for an empty or whitespace-only value`() {
            assertNull("".trimToNull())
            assertNull("   ".trimToNull())
            assertNull("\t\n".trimToNull())
        }
    }

    @Nested
    inner class ToUuidIfPresent {
        @Test
        fun `parses a uuid string`() {
            val uuid = UUID.randomUUID()

            assertEquals(uuid, uuid.toString().toUuidIfPresent())
        }

        @Test
        fun `trims surrounding whitespace before parsing`() {
            val uuid = UUID.randomUUID()

            assertEquals(uuid, "  $uuid  ".toUuidIfPresent())
        }

        @Test
        fun `returns null for a null value`() {
            assertNull(null.toUuidIfPresent())
        }

        @Test
        fun `returns null for a blank value`() {
            assertNull("".toUuidIfPresent())
            assertNull("   ".toUuidIfPresent())
            assertNull("\t\n".toUuidIfPresent())
        }

        @Test
        fun `throws for a value that is present but not a uuid`() {
            assertThrows(IllegalArgumentException::class.java) {
                "not-a-uuid".toUuidIfPresent()
            }
        }
    }
}
