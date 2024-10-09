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
import {AlfrescoAuthConfigurationComponent} from './components/alfresco-auth-configuration/alfresco-auth-configuration.component';
import {ALFRESCO_AUTH_PLUGIN_LOGO_BASE64} from './assets';

const alfrescoAuthPluginSpecification: PluginSpecification = {
  pluginId: 'alfrescoauthentication',
  pluginConfigurationComponent: AlfrescoAuthConfigurationComponent,
  pluginLogoBase64: ALFRESCO_AUTH_PLUGIN_LOGO_BASE64,
  pluginTranslations: {
    nl: {
      title: 'Alfresco Auth',
      description:
          'Alfresco is een document management systeem die de Documenten API-standaard voor zaakgericht werken implementeert (de ZGW-API’s). Met deze plugin kun je via OAuth client credentials koppelen met Alfresco',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
      clientId: 'Client ID',
      clientIdTooltip:
          'Vul hier het clientId in dat geconfigureerd staat onder OpenZaak-beheer voor Alfresco(zie API authorisaties > Applicaties). Dit clientId moet de juiste authorisaties hebben voor de benodigde functionaliteit',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Vul de secret in die hoort bij de clientId hierboven',
    },
    en: {
      title: 'Alfresco Auth',
      description:
          'Alfresco is a document management system that implements the Document API standard for case-oriented working (the ZGW APIs). With this plugin you can use OAuth client credentials to link with Alfresco',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
      clientId: 'Client ID',
      clientIdTooltip:
          'Enter the clientId here which is configured under OpenZaak management for Alfresco (see API authorizations > Applications). This clientId must have the correct authorizations for the required functionality',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Enter the secret associated with the clientId above',
    },
    de: {
      title: 'Alfresco Auth',
      description:
          'OpenNotificaties ist eine document management system, die den Document API-Standard für fallorientiertes Arbeiten (die ZGW-APIs) implementiert. Mit diesem Plugin können Sie Client-Zugangsdaten über OAuth mit Alfresco verknüpfen',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
      clientId: 'Client ID',
      clientIdTooltip:
          'Geben Sie hier die clientId ein, die unter OpenZaak-Verwaltung konfiguriert fur Alfreco ist (siehe API-Berechtigungen > Anwendungen). Diese clientId muss die richtigen Berechtigungen für die erforderliche Funktionalität haben',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Geben Sie das mit der obigen clientId verknüpfte Geheimnis ein',
    },
  },
};

export {alfrescoAuthPluginSpecification};
