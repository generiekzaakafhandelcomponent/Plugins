/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
import {HAAL_CENTRAAL_AUTH_PLUGIN_LOGO_BASE64} from './assets';
import {
    HaalCentraalAuthPluginConfigurationComponent
} from "./components/haal-centraal-auth-plugin-configuration.component";

const haalCentraalBrpAuthPluginSpecification: PluginSpecification = {
    /*
    The plugin definition key of the plugin.
    This needs to be the same as the id received from the back-end
     */
    pluginId: 'haal-centraal-auth',
    /*
    A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
     */
    pluginConfigurationComponent: HaalCentraalAuthPluginConfigurationComponent,
    // Points to a Base64 encoded string, which contains the logo of the plugin.
    pluginLogoBase64: HAAL_CENTRAAL_AUTH_PLUGIN_LOGO_BASE64,
    /*
    For each language key an implementation supports, translation keys with a translation are provided below.
    These can then be used in configuration components using the pluginTranslate pipe or the PluginTranslationService.
    At a minimum, the keys 'title' and 'description' need to be defined.
    Each function key also requires a translation key. In this case, the key 'sample-action' is added.
     */
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'Haal Centraal Authenticatie Plugin',
            title: 'Haal Centraal Authenticatie Plugin',
            description: 'Dummy Authenticatie',
            authenticationSecret: 'API key',
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Haal Centraal Authentication Plugin',
            title: 'Haal Centraal Authentication Plugin',
            description: 'Dummy Authentication',
            authenticationSecret: 'API key',
        }
    }
};

export {haalCentraalBrpAuthPluginSpecification};
