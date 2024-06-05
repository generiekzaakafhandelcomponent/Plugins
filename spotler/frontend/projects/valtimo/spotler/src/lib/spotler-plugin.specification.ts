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
import {SPOTLER_PLUGIN_LOGO_BASE64} from './assets';
import {
  SpotlerPluginConfigurationComponent
} from "./components/plugin-configuration/spotler-plugin-configuration.component";

const spotlerPluginSpecification: PluginSpecification = {
  pluginId: 'spotler',
  pluginConfigurationComponent: SpotlerPluginConfigurationComponent,
  pluginLogoBase64: SPOTLER_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
  },
  pluginTranslations: {
    nl: {
      title: 'Spotler',
      description:
          'Met de Spotler plugin kun je in een process emails versturen',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
      clientId: 'Client ID',
      clientIdTooltip:
          'Vul hier het uw Spotler clientId in',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Vul de secret in die hoort bij de clientId hierboven',
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
      title: 'Spotler',
      description:
          'Spotler allows you to send emails from within a process',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
      clientId: 'Client ID',
      clientIdTooltip:
          'Enter your Spotler clientId here',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Enter the secret associated with the clientId above',
      toEmail: "Email To address",
    },
    de: {
      title: 'Spotler',
      description:
          'Spotler ermöglicht das versenden von E-Mails aus einem prozess heraus',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
      clientId: 'Client ID',
      clientIdTooltip:
          'Geben Sie hier Ihre Spotler-Client-ID ein',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Geben Sie das mit der obigen clientId verknüpfte Geheimnis ein',
    },
  },
};

export {spotlerPluginSpecification};
