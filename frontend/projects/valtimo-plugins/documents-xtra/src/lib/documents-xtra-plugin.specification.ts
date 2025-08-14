/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {PluginSpecification} from '@valtimo/plugin';
import {DocumentsXtraConfigurationComponent} from './components/documents-xtra-configuration/documents-xtra-configuration.component';
import {DOCUMENTEN_API_PLUGIN_LOGO_BASE64} from './assets';
import {CopyInformationobjectConfigurationComponent} from "./components/copy-informationobject/copy-informationobject-configuration.component";

const documentsXtraPluginSpecification: PluginSpecification = {
  pluginId: 'documentsXtra',
  pluginConfigurationComponent: DocumentsXtraConfigurationComponent,
  pluginLogoBase64: DOCUMENTEN_API_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'copy-eio': CopyInformationobjectConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: 'Documents Xtra plugin',
      description:
          'Met de Documents Xtra plugin kun je complexere acties doen op de Documenten API',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
      url: 'Documenten API URL',
      urlTooltip:
          'In dit veld moet de verwijzing komen naar de REST API van Documenten. Deze url moet dus eindigen op /documenten/api/v1/',
      authenticationPluginConfiguration: 'Configuratie authenticatie-plug-in',
      authenticationPluginConfigurationTooltip:
          'Selecteer de plugin die de authenticatie kan afhandelen. Wanneer de selectiebox leeg blijft zal de authenticatie plugin (bv. OpenZaak) eerst aangemaakt moeten worden',
      eioUrl: 'Urls van enkelvoudig informatieobjecten',
      'copy-eio': 'Kopieer informatie objecten'
    },
    en: {
      title: 'Documents Xtra plugin',
      description:
          'DocumentsXtra adds more actions for the Documenten API',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
      url: 'Documenten API URL',
      urlTooltip:
          'This field must contain the URL to the REST API of Documenten, therefore this URL should end with /documenten/api/v1/',
      authenticationPluginConfiguration: 'Authentication plugin configuration',
      authenticationPluginConfigurationTooltip:
          'Select the plugin that can handle the authentication. If the selection box remains empty, the authentication plugin (e.g. OpenZaak) will have to be created first',
      eioUrl: 'Url of enkelvoudig informatieobjects',
      'copy-eio': 'Copy information objects'
    },
    de: {
      title: 'Documents Xtra plugin',
      description:
          'Documents Xtra plugin gibt mehr functionaliteite fur die Documenten API',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
      url: 'Documenten API URL',
      urlTooltip:
          'Dieses Feld muss die URL zur REST API von Documenten enthalten, daher sollte diese URL mit enden /documenten/api/v1/',
      authenticationPluginConfiguration: 'Authentifizierungs-Plugin-Konfiguration',
      authenticationPluginConfigurationTooltip:
          'Wählen Sie das Plugin aus, das die Authentifizierung verarbeiten kann. Bleibt das Auswahlfeld leer, muss zunächst das Authentifizierungs-Plugin (z. B. OpenZaak) erstellt werden',
      eioUrl: 'Url von enkelvoudig informatieobjecten',
      'copy-eio': 'Kopier information objecten'
    },
  },
};

export {documentsXtraPluginSpecification};
