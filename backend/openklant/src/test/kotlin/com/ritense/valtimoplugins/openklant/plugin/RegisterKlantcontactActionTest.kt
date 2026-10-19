package com.ritense.valtimoplugins.openklant.plugin

import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.valtimoplugins.openklant.model.KlantcontactCreationInformation
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.lang.reflect.Method
import java.net.URI
import java.util.UUID

/**
 * Regression coverage for GitHub issue #14.
 */
class RegisterKlantcontactActionTest {
    private val partijUuid = UUID.randomUUID().toString()

    @Test
    fun `invokes without error when hasBetrokkene is absent from the action properties`() {
        val information = invokeAction(actionProperties(hasBetrokkene = null))

        assertTrue(
            information.hasBetrokkene,
            "an absent hasBetrokkene should be derived from the configured partijUuid",
        )
        assertEquals(partijUuid, information.partijUuid)
    }

    @Test
    fun `derives hasBetrokkene as false when absent and no partijUuid is configured`() {
        val information =
            invokeAction(actionProperties(hasBetrokkene = null) + mapOf("partijUuid" to null))

        assertFalse(information.hasBetrokkene)
    }

    @Test
    fun `honours an explicitly configured hasBetrokkene`() {
        assertTrue(invokeAction(actionProperties(hasBetrokkene = true)).hasBetrokkene)
        assertFalse(invokeAction(actionProperties(hasBetrokkene = false)).hasBetrokkene)
    }

    /**
     * Mirrors PluginService.resolveMethodArguments: every @PluginActionProperty parameter is looked
     * up by name, anything missing becomes null, and the DelegateExecution is passed positionally.
     */
    private fun invokeAction(actionProperties: Map<String, Any?>): KlantcontactCreationInformation {
        val openKlantService: OpenKlantService = mockk(relaxed = true)
        val plugin =
            OpenKlantPlugin(
                openKlantPluginService = openKlantService,
                reflectionUtil = ReflectionUtil(),
            ).apply {
                klantinteractiesUrl = URI("https://example.com")
                token = "dummy-token"
            }

        val execution: DelegateExecution = mockk(relaxed = true)
        val captured = slot<KlantcontactCreationInformation>()
        every {
            openKlantService.postKlantcontact(any<OpenKlantProperties>(), capture(captured))
        } returns Unit

        val method = registerKlantcontactMethod()
        val arguments =
            method.parameters
                .map { parameter ->
                    if (parameter.isAnnotationPresent(PluginActionProperty::class.java)) {
                        actionProperties[parameter.name]
                    } else {
                        execution
                    }
                }.toTypedArray()

        method.invoke(plugin, *arguments)

        verify(exactly = 1) {
            openKlantService.postKlantcontact(any<OpenKlantProperties>(), any<KlantcontactCreationInformation>())
        }
        return captured.captured
    }

    private fun registerKlantcontactMethod(): Method =
        OpenKlantPlugin::class.java.methods.single { method ->
            method.getAnnotation(PluginAction::class.java)?.key == "register-klantcontact"
        }

    private fun actionProperties(hasBetrokkene: Boolean?): Map<String, Any?> =
        buildMap {
            put("referentienummer", null)
            put("kanaal", "E-mail")
            put("onderwerp", "Herinnering: openstaande taak")
            put("inhoud", "E-mailbericht met herinnering openstaande taak")
            put("reactie", null)
            put("indicatieContactGelukt", "true")
            put("vertrouwelijk", "false")
            put("taal", "nld")
            put("plaatsgevondenOp", "2026-08-31T12:00:00Z")
            put("metadata", null)
            put("partijUuid", partijUuid)
            put("voorletters", "P")
            put("voornaam", "Pietje")
            put("voorvoegselAchternaam", "")
            put("achternaam", "Puk")
            if (hasBetrokkene != null) {
                put("hasBetrokkene", hasBetrokkene)
            }
        }
}
