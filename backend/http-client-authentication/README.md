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
screen; an invalid configuration stops the application from starting. The plugin key is
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

## Release notes

### 1.1.0

- Can be selected as the authentication of the Zaken, Documenten, Catalogi, Besluiten, Notificaties, Objecten and
  Objecttypen API plugins.
- New authentication types **Token** and **Client ID / secret (ZGW JWT)**.
- Optional certificates for mutual TLS: a client certificate with private key, and a server certificate to trust.
- Configurations are checked when they are saved or deployed.
- Requires the GZAC ZGW modules.
