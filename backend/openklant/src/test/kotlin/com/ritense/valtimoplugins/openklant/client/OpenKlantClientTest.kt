import com.ritense.valtimoplugins.openklant.client.OpenKlantClient
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

internal class OpenKlantClientTest {
    private val webClientBuilder = mockk<WebClient.Builder>(relaxed = true)
    private val client = OpenKlantClient(webClientBuilder)

    @Test
    fun `buildOpenKlantUri builds correct URI with all options`() {
        val options =
            KlantcontactOptions(
                klantinteractiesUrl = URI.create("https://example.com/"),
                token = "supersecrettoken",
                objectTypeId = "type123",
                bsn = "bsn456",
                objectUuid = "uuid789",
            )

        // This is the *only builder you need*
        val builder = UriComponentsBuilder.fromUriString("https://example.com")

        val result = client.buildOpenKlantUri(builder, options)

        assertEquals(
            "https://example.com/klantcontacten?" +
                "onderwerpobject__onderwerpobjectidentificatorCodeObjecttype=type123&" +
                "hadBetrokkene__wasPartij__partijIdentificator__objectId=bsn456&" +
                "onderwerpobject__onderwerpobjectidentificatorObjectId=uuid789",
            result.toString(),
        )
    }

    @Test
    fun `buildOpenKlantUri builds correct URI skipping null options`() {
        val options =
            KlantcontactOptions(
                klantinteractiesUrl = URI.create("https://example.com/"),
                token = "supersecrettoken",
                objectTypeId = null,
                bsn = "bsn456",
                objectUuid = null,
            )

        val builder = UriComponentsBuilder.fromUriString("https://example.com")

        val result = client.buildOpenKlantUri(builder, options)

        assertEquals(
            "https://example.com/klantcontacten?" +
                "hadBetrokkene__wasPartij__partijIdentificator__objectId=bsn456",
            result.toString(),
        )
    }
}
