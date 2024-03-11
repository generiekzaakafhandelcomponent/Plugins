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
import {BrpPluginConfigurationComponent} from './components/brp-configuration/brp-plugin-configuration.component';
import {BRP_PLUGIN_LOGO_BASE64} from './assets';
import {FetchBrpDataConfigurationComponent} from './components/fetch-brp-data/fetch-brp-data-configuration.component';

const brpPluginSpecification: PluginSpecification = {
  pluginId: 'brp',
  pluginConfigurationComponent: BrpPluginConfigurationComponent,
  pluginLogoBase64: BRP_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'fetch-brp-data': FetchBrpDataConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      description: 'Haal BRP data op van HaalCentraal',
      title: 'BRP',
      configurationTitle: 'Naam van de plugin',
      'fetch-brp-data': 'BRP gegevens ophalen',
      url: 'HaalCentraal NLX URL',
      apiKeyHeaderName: 'apiKeyHeaderName',
      apiKey: 'apiKey',
      applicationId: 'applicationId',
      requestProcessId: 'requestProcessId',
      requestSubjectIdentifier: 'requestSubjectIdentifier',
      filterChildrenOlderThenThirteen: 'Kinderen ouderen dan 13 jaar verwijderen uit persoonsgegevens?'
    },
    en: {
      description: 'Haal BRP data op van HaalCentraal',
      title: 'BRP',
      configurationTitle: 'Naam van de plugin',
      'fetch-brp-data': 'BRP gegevens ophalen',
      url: 'HaalCentraal NLX URL',
      apiKeyHeaderName: 'apiKeyHeaderName',
      apiKey: 'apiKey',
      applicationId: 'applicationId',
      requestProcessId: 'requestProcessId',
      requestSubjectIdentifier: 'requestSubjectIdentifier',
      filterChildrenOlderThenThirteen: 'Kinderen ouderen dan 13 jaar verwijderen uit persoonsgegevens?'

    },
    de: {
      description: 'Haal BRP data op van HaalCentraal',
      title: 'BRP',
      configurationTitle: 'Naam van de plugin',
      'fetch-brp-data': 'BRP gegevens ophalen',
      url: 'HaalCentraal NLX URL',
      apiKeyHeaderName: 'apiKeyHeaderName',
      apiKey: 'apiKey',
      applicationId: 'applicationId',
      requestProcessId: 'requestProcessId',
      requestSubjectIdentifier: 'requestSubjectIdentifier',
      filterChildrenOlderThenThirteen: 'Kinderen ouderen dan 13 jaar verwijderen uit persoonsgegevens?'
    },
  },
};

export {brpPluginSpecification};
