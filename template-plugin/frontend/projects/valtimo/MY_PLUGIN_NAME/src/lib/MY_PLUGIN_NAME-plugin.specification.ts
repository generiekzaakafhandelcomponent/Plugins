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
import {MY_PLUGIN_NAME_PLUGIN_LOGO_BASE64} from './assets';
import {
  MY_PLUGIN_NAMEPluginConfigurationComponent
} from "./components/plugin-configuration/MY_PLUGIN_NAME-plugin-configuration.component";

const MY_PLUGIN_NAMEPluginSpecification: PluginSpecification = {
  pluginId: 'MY_PLUGIN_NAME',
  pluginConfigurationComponent: MY_PLUGIN_NAMEPluginConfigurationComponent,
  pluginLogoBase64: MY_PLUGIN_NAME_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
  },
  pluginTranslations: {
    nl: {
      title: 'MY_PLUGIN_NAME',
      description:
          'MY_PLUGIN_NAME is een plugin',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
      clientId: 'Client ID',
      clientIdTooltip:
          'Vul hier het uw MY_PLUGIN_NAME clientId in',
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
      title: 'MY_PLUGIN_NAME',
      description:
          'MY_PLUGIN_NAME is a plugin',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
      clientId: 'Client ID',
      clientIdTooltip:
          'Enter your MY_PLUGIN_NAME clientId here',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Enter the secret associated with the clientId above',
      toEmail: "Email To address",
    },
    de: {
      title: 'MY_PLUGIN_NAME',
      description:
          'MY_PLUGIN_NAME ist einem plugin',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
      clientId: 'Client ID',
      clientIdTooltip:
          'Geben Sie hier Ihre MY_PLUGIN_NAME-Client-ID ein',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Geben Sie das mit der obigen clientId verknüpfte Geheimnis ein',
    },
  },
};

export {MY_PLUGIN_NAMEPluginSpecification};
