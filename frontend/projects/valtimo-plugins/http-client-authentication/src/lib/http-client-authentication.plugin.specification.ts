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
 *
 */

import {PluginSpecification} from '@valtimo/plugin';
import {HTTP_CLIENT_AUTHENTICATION_PLUGIN_LOGO_BASE64} from './assets';
import {
    HttpClientAuthenticationPluginConfigurationComponent
} from "./components/http-client-authentication-plugin-configuration.component";

const httpClientAuthenticationPluginSpecification: PluginSpecification = {
    /*
    The plugin definition key of the plugin.
    This needs to be the same as the id received from the back-end
     */
    pluginId: 'http-client-authentication-plugin',
    /*
    A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
     */
    pluginConfigurationComponent: HttpClientAuthenticationPluginConfigurationComponent,
    // Points to a Base64 encoded string, which contains the logo of the plugin.
    pluginLogoBase64: HTTP_CLIENT_AUTHENTICATION_PLUGIN_LOGO_BASE64,
    /*
    For each language key an implementation supports, translation keys with a translation are provided below.
    These can then be used in configuration components using the pluginTranslate pipe or the PluginTranslationService.
    At a minimum, the keys 'title' and 'description' need to be defined.
     */
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitlePlaceholder: 'Client Authentication',
            configurationTitleTooltip:
                'Http Client Authentication Plugin',
            title: 'Http Client Authentication Plugin',
            description: 'Biedt authenticatie en mutual TLS voor uitgaande REST clients, waaronder de ZGW API plugins',
            authenticationType: 'Authenticatie type',
            authHeaderName: 'Authenticatie header naam',
            authHeaderNamePlaceholder: 'X-Api-Key',
            authSecret: 'Authenticatie secret',
            authSecretPlaceholder: '0000000000000000000000000000000000000000',
            clientId: 'Client ID',
            clientIdPlaceholder: 'valtimo_client',
            clientSecret: 'Client secret',
            clientSecretPlaceholder: '00000000-0000-0000-0000-000000000000',
            clientSecretTooltip: 'Minimaal 32 tekens. Wordt gebruikt om het ZGW JWT-token te ondertekenen.',
            tlsEnabled: 'Certificaten (mutual TLS)',
            tlsEnabledTooltip:
                'Schakel in om een clientcertificaat (mutual TLS) te gebruiken of een specifiek servercertificaat te vertrouwen. Uitschakelen verwijdert de certificaten bij opslaan.',
            'tlsEnabled.toggleOn': 'Aan',
            'tlsEnabled.toggleOff': 'Uit',
            clientCertificate: 'Clientcertificaat (PEM)',
            clientCertificateTooltip:
                'Optioneel. Het certificaat waarmee GZAC zich bij mutual TLS identificeert. Leeg laten schakelt mutual TLS uit.',
            clientCertificatePlaceholder: '-----BEGIN CERTIFICATE-----\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n...\n-----END CERTIFICATE-----',
            clientPrivateKey: 'Private key van het clientcertificaat (PEM)',
            clientPrivateKeyTooltip:
                'Verplicht bij een nieuw clientcertificaat. Mag niet versleuteld zijn. Wordt na opslaan niet meer getoond; leeg laten behoudt de opgeslagen sleutel.',
            clientPrivateKeyPlaceholder: '-----BEGIN PRIVATE KEY-----\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n...\n-----END PRIVATE KEY-----',
            serverCertificate: 'Servercertificaat (PEM)',
            serverCertificateTooltip:
                'Optioneel. Het CA- of servercertificaat dat vertrouwd wordt in plaats van de standaardlijst van de JVM.',
            serverCertificatePlaceholder: '-----BEGIN CERTIFICATE-----\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n...\n-----END CERTIFICATE-----'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitlePlaceholder: 'Client Authentication',
            configurationTitleTooltip:
                'Http Client Authentication Plugin',
            title: 'Http Client Authentication Plugin',
            description: 'Provides authentication and mutual TLS for outbound REST clients, including the ZGW API plugins',
            authenticationType: 'Authentication type',
            authHeaderName: 'Authentication header name',
            authHeaderNamePlaceholder: 'X-Api-Key',
            authSecret: 'Authentication secret',
            authSecretPlaceholder: '0000000000000000000000000000000000000000',
            clientId: 'Client ID',
            clientIdPlaceholder: 'valtimo_client',
            clientSecret: 'Client secret',
            clientSecretPlaceholder: '00000000-0000-0000-0000-000000000000',
            clientSecretTooltip: 'At least 32 characters. Used to sign the ZGW JWT token.',
            tlsEnabled: 'Certificates (mutual TLS)',
            tlsEnabledTooltip:
                'Turn on to present a client certificate (mutual TLS) or to trust a specific server certificate. Turning it off removes the certificates on save.',
            'tlsEnabled.toggleOn': 'On',
            'tlsEnabled.toggleOff': 'Off',
            clientCertificate: 'Client certificate (PEM)',
            clientCertificateTooltip:
                'Optional. The certificate GZAC presents for mutual TLS. Leave empty to turn mutual TLS off.',
            clientCertificatePlaceholder: '-----BEGIN CERTIFICATE-----\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n...\n-----END CERTIFICATE-----',
            clientPrivateKey: 'Client certificate private key (PEM)',
            clientPrivateKeyTooltip:
                'Required with a new client certificate. Must not be encrypted. Not shown again after saving; leave empty to keep the stored key.',
            clientPrivateKeyPlaceholder: '-----BEGIN PRIVATE KEY-----\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n...\n-----END PRIVATE KEY-----',
            serverCertificate: 'Server certificate (PEM)',
            serverCertificateTooltip:
                'Optional. The CA or server certificate to trust instead of the JVM default list.',
            serverCertificatePlaceholder: '-----BEGIN CERTIFICATE-----\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n...\n-----END CERTIFICATE-----'
        }
    }
};

export {httpClientAuthenticationPluginSpecification};
