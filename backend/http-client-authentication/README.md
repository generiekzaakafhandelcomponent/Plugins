# Http Client Authentication Plugin

The Http Client Authentication plugin tells GZAC how to log in to an external API. A configuration holds the
credentials (a token, a client ID and secret, or a custom header) and, when the API requires it, the certificates for a
secure connection (mutual TLS).

You can select a configuration of this plugin as the authentication of the ZGW API plugins: Zaken API, Documenten API,
Catalogi API, Besluiten API, Notificaties API, Objecten API and Objecttypen API. Other plugins that call an external API
can use it as well.

The plugin is not a standard part of Valtimo. It is available in the Plugins repo.

## Installation

From version 1.1.0 the plugin needs a GZAC application (with the ZGW modules). For a Valtimo application without
them, use version 1.0.0.

### Backend

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:http-client-authentication-plugin:1.1.0")
}
```

### Frontend

```json
{
  "dependencies": {
    "@valtimo-plugins/http-client-authentication": "1.1.0"
  }
}
```

In your `app.module.ts`:

```typescript
import {
    HttpClientAuthenticationPluginModule, httpClientAuthenticationPluginSpecification,
} from '@valtimo-plugins/http-client-authentication';

@NgModule({
    imports: [
        HttpClientAuthenticationPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                httpClientAuthenticationPluginSpecification,
            ]
        }
    ]
})
```

## Configuring the plugin

Go to **Admin > Plugins**, click **Configure plugin** and choose **Http Client Authentication Plugin**.

### Authentication type

Choose how GZAC logs in to the API:

| Authentication type             | Use it for                                    | Fields to fill in                                      |
|---------------------------------|-----------------------------------------------|--------------------------------------------------------|
| **Client ID / secret (ZGW JWT)** | Open Zaak and Open Notificaties               | **Client ID** and **Client secret** (at least 32 characters) |
| **Token**                       | Objecten and Objecttypen API                  | **Authentication secret**: the API token               |
| **Bearer**                      | APIs that expect a bearer token               | **Authentication secret**: the token                   |
| **Header**                      | APIs that expect a key in a header of their own | **Authentication header name** (for example `X-Api-Key`) and **Authentication secret** |
| **None**                        | APIs without authentication                   | –                                                      |

Secrets are not shown again after saving. When you edit a configuration, leave the secret empty to keep the stored
one. If you switch to another authentication type, enter the secret again.

### Certificates (mutual TLS)

Some APIs are behind a gateway that only accepts calls from a known client certificate, or use a certificate that is
not publicly trusted. Turn on **Certificates (mutual TLS)** to fill in:

- **Client certificate (PEM)** – the certificate GZAC presents to the API. Paste the contents of the `.pem` or `.crt`
  file, starting with `-----BEGIN CERTIFICATE-----`. Leave it empty if the API does not ask for a client certificate.
- **Client certificate private key (PEM)** – the private key that belongs to the client certificate, starting with
  `-----BEGIN PRIVATE KEY-----` (or `RSA PRIVATE KEY` / `EC PRIVATE KEY`). Keys protected with a password are not
  supported. The key is not shown again after saving; when editing, leave it empty to keep the stored key.
- **Server certificate (PEM)** – optional. The certificate (or CA certificate) of the API to trust. Fill it in when the
  API uses a certificate that is not publicly trusted, for example one issued by an internal CA. When it is filled in,
  only that certificate is trusted for this configuration.

To stop using certificates, turn the toggle off and save. The certificates are removed. A stored private key stays
saved but is no longer used.

When saving, GZAC checks the configuration and shows which field is wrong, for example when the private key does not
belong to the client certificate, when a field does not contain a valid certificate, or when a required field is empty.

### Using it in a ZGW API plugin

1. Create a configuration of this plugin as described above, with the authentication type the API expects.
2. Open the configuration of the ZGW API plugin (for example **Zaken API** or **Objecten API**) and select your
   configuration in its authentication field.

The Notificaties API plugin calls Open Notificaties as soon as it is saved, so the certificates of its authentication
must be correct before you save it.

## Configuration files

Configurations can also be deployed with a `*.pluginconfig.json` file. These are checked in the same way as in the
screen; Valtimo logs an invalid configuration and skips it and the rest of its file. The plugin key is
`http-client-authentication-plugin`, and the property names are:

| Property             | Field in the screen                    | Values                                              |
|----------------------|----------------------------------------|-----------------------------------------------------|
| `authenticationType` | Authentication type                    | `ZGW_JWT`, `TOKEN`, `BEARER`, `HEADER` or `NONE`    |
| `clientId`           | Client ID                              |                                                     |
| `authSecret`         | Client secret / Authentication secret  |                                                     |
| `authHeaderName`     | Authentication header name             |                                                     |
| `clientCertificate`  | Client certificate (PEM)               | PEM text, with line breaks written as `\n`          |
| `clientPrivateKey`   | Client certificate private key (PEM)   | PEM text, with line breaks written as `\n`          |
| `serverCertificate`  | Server certificate (PEM)               | PEM text, with line breaks written as `\n`          |

## Using it from another plugin

A plugin that calls an external API can let users pick a configuration of this plugin. Add a `@PluginProperty` of type
`HttpClientAuthenticator`, and call `applyAuth` on the `RestClient.Builder` before making the call:

```kotlin
class SomeOtherPlugin(
    private val httpClientAuthenticator: HttpClientAuthenticator?
) {
    fun callApi(): RestClient {
        var builder = RestClient.builder()
        httpClientAuthenticator?.let { builder = it.applyAuth(builder) }
        return builder.build()
    }
}
```

The plugin has no process actions.

## Testing mutual TLS in the sandbox

The sandbox (`backend/app/docker-compose.yml`) contains `mtls-gateway`, an nginx gateway that only lets requests
through when they present a client certificate signed by the sandbox CA, like the gateway in front of the ZGW APIs at a
municipality.

| Gateway                  | Forwards to                             |
|--------------------------|-----------------------------------------|
| `https://127.0.0.1:8443` | Objecten API (`objecten-api`)           |
| `https://127.0.0.1:8444` | Open Zaak (`openzaak`)                  |
| `https://127.0.0.1:8445` | Open Notificaties (`open-notificaties`) |

The sandbox autodeploys these configurations through the gateway
([mtls-gateway.pluginconfig.json](../app/src/main/resources/config/plugin/mtls-gateway.pluginconfig.json)), next to the
plain ones:

| Configuration                                     | Plugin                     | Settings                                                                    |
|---------------------------------------------------|----------------------------|-----------------------------------------------------------------------------|
| Objects API Authentication via mTLS gateway       | Http Client Authentication | Token, client certificate and private key, sandbox CA as server certificate |
| Objects API via mTLS gateway                      | Objecten API               | `https://127.0.0.1:8443/api/v2/`                                            |
| Open Zaak Authentication via mTLS gateway         | Http Client Authentication | Client ID and secret (`valtimo_client`), same certificates                  |
| Catalogi API via mTLS gateway                     | Catalogi API               | `https://127.0.0.1:8444/catalogi/api/v1/`                                   |
| Zaken API via mTLS gateway                        | Zaken API                  | `https://127.0.0.1:8444/zaken/api/v1/`                                      |
| Documenten API via mTLS gateway                   | Documenten API             | `https://127.0.0.1:8444/documenten/api/v1`, bronorganisatie `051845623`     |
| Open Notificaties Authentication via mTLS gateway | Http Client Authentication | Client ID and secret (`valtimo`), same certificates                         |
| Notificaties API via mTLS gateway                 | Notificaties API           | `https://127.0.0.1:8445/api/v1/`, its own callback URL (see below)          |

The object management configuration *Bomen via mTLS gateway* uses the Objects API through the gateway, so
*Objects → Bomen via mTLS gateway* shows its objects only when the client certificate is presented. The zaaktypes of the
Catalogi API via the gateway appear next to the regular ones, with `https://127.0.0.1:8444` URLs.

The Objecttypen API is not behind the gateway. The objecttype URL is an identifier, not only an address: the Objects API
only accepts objecttype URLs under the address it knows the Objecttypen API by, and Valtimo builds that URL from its
Objecttypes API configuration. Putting the Objecttypen API behind the gateway would make the Objects API, which every
case shares, depend on the gateway too. So the mTLS object management configurations use the plain
*Objecttypes API (Autodeployed)*.

*Notificaties API via mTLS gateway* registers its own abonnement in the same Open Notificaties as
*Notificaties API (Autodeployed)*. Valtimo removes abonnementen with a configuration's callback URL that it doesn't track,
and it sees the abonnement of the other configuration under a different URL. So the configuration through the gateway
has its own callback URL, `…/notificatiesapi/callback?configuration=mtls-gateway`, and the two leave each other's
abonnement alone. A notification that reaches Valtimo through both abonnementen is processed once.

The case *mTLS gateway* shows the whole route: [create-verzoek-example.http](../app/examples/create-verzoek-example.http)
creates a verzoek in the Objects API through the gateway, and the *Verzoek via mTLS gateway* configuration turns it into
a case. It starts `mtls-gateway-create-zaakdossier`, a copy of Valtimo's `create-zaakdossier` whose actions use
*Zaken API via mTLS gateway*, so other cases that use `create-zaakdossier` don't go through the gateway.

The gateway logs every request with the client certificate it received and the authentication scheme (never the
secret):

```shell
docker logs -f valtimo-plugins-local-mtls-gateway
# 192.168.65.1 "GET /api/v2/objects?... HTTP/1.1" 200 client="CN=valtimo-sandbox-client" verify=SUCCESS authorization="Token"
```

A request without a client certificate is refused with `400 No required SSL certificate was sent`. To call the gateway
by hand:

```shell
cd backend/app/imports/mtls-gateway/certs
curl --cacert ca.pem --cert client.pem --key client-key.pem \
  -H 'Authorization: Token 182c13e2209161852c53cef53a879f7a2f923430' https://127.0.0.1:8443/api/v2/objects
```

The certificates in [imports/mtls-gateway/certs](../app/imports/mtls-gateway/certs) are throwaway test material.
[generate-certs.sh](../app/imports/mtls-gateway/generate-certs.sh) creates new ones and rewrites
`mtls-gateway.pluginconfig.json` to match. Valtimo's docker filter (`valtimo.docker.filter`) only rewrites
`http://localhost` URLs, so it leaves the `https://` gateway URLs alone.

## Release notes

### 1.1.0

- Can be selected as the authentication of the Zaken, Documenten, Catalogi, Besluiten, Notificaties, Objecten and
  Objecttypen API plugins.
- New authentication types **Token** and **Client ID / secret (ZGW JWT)**.
- Optional certificates for mutual TLS: a client certificate with private key, and a server certificate to trust.
- Configurations are checked when they are saved or deployed.
- Requires the GZAC ZGW modules.
