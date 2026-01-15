package com.ritense.valtimoplugins.openklant.client

import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.util.DefaultUriBuilderFactory
import java.net.URI

@ExtendWith(MockKExtension::class)
class OpenKlantClientTest {
    private lateinit var openKlantClient: OpenKlantClient

    @BeforeEach
    fun setUp() {
        openKlantClient =
            OpenKlantClient(
                openKlantWebClientBuilder = WebClient.builder(),
            )
    }

    @Test
    fun `buildOpenklantUri returns correct URI`() {
        // Arrange
        val options =
            KlantcontactOptions(
                klantinteractiesUrl = URI.create("https://mydomain.com"),
                token = "token",
                bsn = "1234567890",
                objectTypeId = "myId",
            )

        // Act
        val builder = DefaultUriBuilderFactory().builder()
        val uri = openKlantClient.buildOpenKlantUri(builder, options)

        // Assert
        assertTrue(uri.toString().contains("hadBetrokkene__wasPartij__partijIdentificator__objectId=1234567890"))
        assertTrue(uri.toString().contains("onderwerpobject__onderwerpobjectidentificatorCodeObjecttype=myId"))

        // Should not add query param if its related property is not passed to KlantcontactOptions
        assertFalse(uri.toString().contains("onderwerpobject__onderwerpobjectidentificatorObjectId"))
        assertTrue(uri.path.endsWith("klantcontacten"))
    }
}