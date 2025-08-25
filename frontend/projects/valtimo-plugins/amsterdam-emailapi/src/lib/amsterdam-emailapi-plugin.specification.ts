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
      subscriptionKey: 'Subscription key',
      subscriptionKeyTooltip:
          'Vul hier de Subcription Key in.',
      emailApiBaseUrl: 'Email API base URL',
      emailApiBaseUrlTooltip: 'Vul hier de base url in van de Email API inclusief pad eindigend op ../mail',
      authenticationPluginConfiguration: 'Configuratie authenticatie-plug-in',
      authenticationPluginConfigurationTooltip:
          'Selecteer de plugin die de authenticatie kan afhandelen. Wanneer de selectiebox leeg blijft zal de authenticatie plugin (bv. OpenZaak) eerst aangemaakt moeten worden',
      zaakId: 'De ID van de zaak',
      relatieCodes: 'De code van de relatie(s)',
      to: 'Aan',
      toEmail: 'Email verzend adres',
      toName: 'Naam van ontvanger',
      fromAddress: 'Afzender',
      emailSubject: 'Onderwerp',
      contentHtml: 'body van email',
      cc: 'CC',
      ccEmail: 'cc email',
      ccName: 'cc naam',
      bcc: 'BCC',
      bccEmail: 'bcc email',
      bccName: 'bcc naam',
      'zend-email': 'Zend E-mail',
      attachments: 'Attachments'
    },
    en: {
      title: 'Amsterdam Email API',
      description:
          'Alfresco is a document management system that implements the Document API standard for case-oriented working (the ZGW APIs). With this plugin you can use OAuth client credentials to link with Alfresco',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
      subscriptionKey: 'Subscription key',
      subscriptionKeyTooltip:
          'Fill in the Subcription Key for the Email API.',
      emailApiBaseUrl: 'Email API base URL',
      emailApiBaseUrlTooltip: 'Enter the base URL of the Email API here, including the path ending in ../mail',
      authenticationPluginConfiguration: 'Authentication plugin configuration',
      authenticationPluginConfigurationTooltip:
          'Select the plugin that can handle the authentication. If the selection box remains empty, the authentication plugin (e.g. OpenZaak) will have to be created first',
      zaakId: 'The ID of the case',
      relatieCode: 'The code of the relation(s)',
      toEmail: 'Email To address',
      'zend-email': 'Send E-mail',
      attachments: 'Attachments'

    },
    de: {
      title: 'Amsterdam Email API',
      description:
          'OpenNotificaties ist eine document management system, die den Document API-Standard für fallorientiertes Arbeiten (die ZGW-APIs) implementiert. Mit diesem Plugin können Sie Client-Zugangsdaten über OAuth mit Alfresco verknüpfen',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
      subscriptionKey: 'Subscription key',
      subscriptionKeyTooltip:
          'Geben Sie hier die Subcription Key ein.',
      emailApiBaseUrl: 'Email API base URL',
      emailApiBaseUrlTooltip: 'Geben Sie hier die Basis-URL der E-Mail-API ein, einschließlich des Pfads, der auf ../mail endet',
      'zend-email': 'Schick E-mail',
      authenticationPluginConfiguration: 'Authentifizierungs-Plugin-Konfiguration',
      authenticationPluginConfigurationTooltip:
          'Wählen Sie das Plugin aus, das die Authentifizierung verarbeiten kann. Bleibt das Auswahlfeld leer, muss zunächst das Authentifizierungs-Plugin (z. B. OpenZaak) erstellt werden',
      attachments: 'Attachments',
      relatieCode: 'Der code der Beziehung(s)',
    },
  },
};

export {amsterdamEmailapiPluginSpecification};
