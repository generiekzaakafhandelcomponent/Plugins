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
import {
    HaalCentraalBagPluginConfigurationComponent
} from './components/hc-bag-plugin-configuration/haal-centraal-bag-plugin-configuration.component';
import {HAAL_CENTRAAL_BAG_PLUGIN_LOGO_BASE64} from './assets';
import {
    HcBagOphalenAdresseerbaarObjectIdentificatieComponent
} from "./components/hc-bag-ophalen-adresseerbaar-object-identificatie/hc-bag-ophalen-adresseerbaar-object-identificatie.component";

const haalCentraalBagPluginSpecification: PluginSpecification = {
    /*
    The plugin definition key of the plugin.
    This needs to be the same as the id received from the back-end
     */
    pluginId: 'haalcentraalbag',
    /*
    A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
     */
    pluginConfigurationComponent: HaalCentraalBagPluginConfigurationComponent,
    // Points to a Base64 encoded string, which contains the logo of the plugin.
    pluginLogoBase64: HAAL_CENTRAAL_BAG_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'get-adresseerbaar-object-identificatie': HcBagOphalenAdresseerbaarObjectIdentificatieComponent
    },
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
                'Haal Centraal Bag Plugin',
            title: 'Haal Centraal Bag Plugin',
            description: 'De BAG API plugin is bedoeld voor individuele bevragingen te doen op de landelijke voorziening Basisregistratie Adressen en Gebouwen (LV BAG)',
            bagBaseUrl: 'Url naar bag service',
            authenticationPluginConfiguration: 'Configuratie authenticatie plugin',
            'get-adresseerbaar-object-identificatie': 'Ophalen adresseerbaar object identificatie',
            postcode: 'Postcode',
            huisnummer: 'Huisnummer',
            huisletter: 'Huisletter',
            huisnummertoevoeging: 'Huisnummertoevoeging',
            resultProcessVariableName: 'Resultaat proces variabele naam',
            exacteMatch: 'Exacte overeenkomst',
            exacteMatchTooltip: 'Een indicatie of de resultaten van een zoekoperatie exact overeen moeten komen met de zoekcriteria'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Haal Centraal Bag Plugin',
            title: 'Haal Centraal Bag Plugin',
            description: 'The BAG API plugin is intended for individual queries to the national facility Basic Registration of Addresses and Buildings (LV BAG)',
            bagBaseUrl: 'Base url to bag service',
            authenticationPluginConfiguration: 'Authentication plugin configuration',
            'get-adresseerbaar-object-identificatie': 'Retrieve addressable object identification',
            postcode: 'Postcode',
            huisnummer: 'House number',
            huisletter: 'House letter',
            huisnummertoevoeging: 'House number addition',
            resultProcessVariableName: 'Result process variable name',
            exacteMatch: 'Exact match',
            exacteMatchTooltip: 'An indication of whether the results of a search operation should exactly match the search criteria'
        }
    }
};

export {haalCentraalBagPluginSpecification};
