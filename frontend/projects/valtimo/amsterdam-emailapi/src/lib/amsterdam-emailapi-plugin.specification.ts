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
import {AmsterdamEmailapiConfigurationComponent} from './components/amsterdam-emailapi-configuration/amsterdam-emailapi-configuration.component';
import {AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64} from './assets';
import {SendEmailConfigurationComponent} from "./components/send-email/send-email-configuration.component";

const amsterdamEmailapiPluginSpecification: PluginSpecification = {
  pluginId: 'amsterdamemailapi',
  pluginConfigurationComponent: AmsterdamEmailapiConfigurationComponent,
  pluginLogoBase64: AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'zend-email': SendEmailConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: 'Amsterdam Email API',
      description:
          'Met de Amsterdam Email API plugin kun je in een process emails versturen',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
      clientId: 'Client ID',
      clientIdTooltip:
          'Vul hier het clientId in dat geconfigureerd staat in de autorisatie server waar de Email API naar kijkt. Gewoonlijk is dat Keycloak . Dit clientId moet de juiste autorisatie hebben voor de benodigde functionaliteit',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Vul de secret in die hoort bij de clientId hierboven',
      emailApiBaseUrl: 'Email API base URL',
      emailApiBaseUrlTooltip: 'Vul hier de base url in van de Email API inclusief pad eindigend op ../mail',
      tokenEndpoint: 'Token endpoint',
      tokenEndpointTooltip: 'Vul hier het openid token endpoint om het token op te vragen',
      toEmail: "Email verzend adres",
      toName: "Naam van ontvanger",
      fromAddress: "Afzender",
      emailSubject: "Onderwerp",
      contentHtml: "body van email",
      ccEmail: "cc email",
      ccName: "cc naam",
      bccEmail: "bcc email",
      bccName: "bcc naam",
    },
    en: {
      title: 'Amsterdam Email API',
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
      emailApiBaseUrl: 'Email API base URL',
      emailApiBaseUrlTooltip: 'Enter the base URL of the Email API here, including the path ending in ../mail',
      tokenEndpoint: 'Token endpoint',
      tokenEndpointTooltip: 'Enter the openid token endpoint here to request the token',
      toEmail: "Email To address",
    },
    de: {
      title: 'Amsterdam Email API',
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
      emailApiBaseUrl: 'Email API base URL',
      emailApiBaseUrlTooltip: 'Geben Sie hier die Basis-URL der E-Mail-API ein, einschließlich des Pfads, der auf ../mail endet',
      tokenEndpoint: 'Token endpoint',
      tokenEndpointTooltip: 'Geben Sie hier den OpenID-Token-Endpunkt ein, um das Token anzufordern',
    },
  },
};

export {amsterdamEmailapiPluginSpecification};
