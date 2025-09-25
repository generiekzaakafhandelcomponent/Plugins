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
import {HAALCENTRAAL_BRP_PLUGIN_LOGO_BASE64} from './assets';
import {HaalCentraalBrpBewoningenComponent} from './components/haal-centraal-brp-bewoningen/haal-centraal-brp-bewoningen.component';
import {
    HaalcentraalBrpPluginConfigurationComponent
} from './components/haal-centraal-brp-plugin-configuration/haalcentraal-brp-plugin-configuration.component';

const haalCentraalBrpPluginSpecification: PluginSpecification = {
    /*
    The plugin definition key of the plugin.
    This needs to be the same as the id received from the back-endÏÏ
     */
    pluginId: 'haalcentraalbrp',
    /*
    A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
     */
    pluginConfigurationComponent: HaalcentraalBrpPluginConfigurationComponent,
    // Points to a Base64 encoded string, which contains the logo of the plugin.
    pluginLogoBase64: HAALCENTRAAL_BRP_PLUGIN_LOGO_BASE64,

    functionConfigurationComponents: {
        'hc-brp-get-bewoningen': HaalCentraalBrpBewoningenComponent
    },
    /*
    For each language key an implementation supports, translation keys with a translation are provided below.
    These can then be used in configuration components using the pluginTranslate pipe or the PluginTranslationService.
    At a minumum, the keys 'title' and 'description' need to be defined.
    Each function key also requires a translation key. In this case, the key 'sample-action' is added.
     */
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'Haal Centraal BRP Bewoning plugin',
            title: 'Haal Centraal BRP Bewoning API',
            description: 'API voor het raadplegen van de historische bewoning van een adres. Met de API kan de samenstelling van bewoners van een woning op een peildatum worden geraadpleegd.',
            brpBaseUrl: 'Base url naar brp service',
            authenticationPluginConfiguration: 'Configuratie authenticatie-plug-in',
            'hc-brp-get-bewoningen' : 'Ophalen bewoningen op basis van peildatum',
            'adresseerbaarObjectIdentificatie': 'Adresseerbaar object identificatie',
            'peildatum': 'Peildatum',
            'resultProcessVariableName': 'Result proces variabele naam'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
              'Haalcentraal BRP Bewoning plugin',
            title: 'Haal Centraal BRP Bewoning API',
            description: 'API for consulting the historical residence of an address. With the API, the composition of residents of a property can be consulted on a reference date.',
            authenticationPluginConfiguration: 'Configuratie authenticatie-plug-in',
            brpBaseUrl: 'Base url to haal centraal brp service',
            'hc-brp-get-bewoningen' : 'Retrieve occupancies based on reference date',
            'adresseerbaarObjectIdentificatie': 'Addressable object identification',
            'peildatum': 'Reference date',
            'resultProcessVariableName': 'Result process variable name'
        }
    }
};

export {haalCentraalBrpPluginSpecification};
