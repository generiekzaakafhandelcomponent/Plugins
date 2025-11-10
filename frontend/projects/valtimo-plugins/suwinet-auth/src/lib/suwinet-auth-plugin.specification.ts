/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

import {PluginSpecification} from '@valtimo/plugin';
import {
    SuwinetAuthConfigurationComponent
} from './components/suwinet-auth-configuration/suwinet-auth-configuration.component';
import {SUWINET_AUTH_PLUGIN_LOGO_BASE64} from './assets';


const suwinetAuthPluginSpecification: PluginSpecification = {
    pluginId: 'suwinet-auth',
    pluginConfigurationComponent: SuwinetAuthConfigurationComponent,
    pluginLogoBase64: SUWINET_AUTH_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {},
    pluginTranslations: {
        nl: {
            title: 'Suwinet Auth',
            authType: 'Kies de gebruikte authenticatie methode:',
            description: 'Plugin om te authenticeren voor Suwinet ',
            keystorePath: 'Keystore certificate path',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate path',
            truststoreSecret: 'Truststore certificate key',
            basicAuthName: 'Basic Authorization name',
            basicAuthSecret: 'Basic Authorization password',
            headerName: 'Header name',
            headerValue: 'Header value',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip: 'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.'
        },
        en: {
            title: 'Suwinet Auth',
            authType: 'Select the authentication method used:',
            description: 'Plugin to  authenticate with Suwinet ',
            keystorePath: 'Keystore certificate path',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate path',
            truststoreSecret: 'Truststore certificate key',
            basicAuthName: 'Basic Authorization name',
            basicAuthSecret: 'Basic Authorization password',
            headerName: 'Header name',
            headerValue: 'Header value',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.'
        },
        de: {
            title: 'Suwinet Auth',
            authType: 'Wählen Sie die verwendete Authentifizierungsmethode aus',
            description: 'Plugin zur Authentifizierung für Suwinet ',
            keystorePath: 'Keystore certificate path',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate path',
            truststoreSecret: 'Truststore certificate key',
            basicAuthName: 'Basic Authorization name',
            basicAuthSecret: 'Basic Authorization password',
            headerName: 'Header name',
            headerValue: 'Header value',
            configurationTitle: 'Konfigurationsname',
            configurationTitleTooltip:
                'Der Name der aktuellen Plugin-Konfiguration. Unter diesem Namen ist die Konfiguration im Rest der Anwendung zu finden.',
        },
    },
};

export {suwinetAuthPluginSpecification};
