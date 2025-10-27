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
 */

import {PluginSpecification} from '@valtimo/plugin';
import {NOTIFY_NL_PLUGIN_LOGO_BASE64} from './assets';
import {NotifyNlConfigurationComponent} from "./components/notify-nl-configuration/notify-nl-configuration.component";
import {SendSmsConfigurationComponent} from "./components/send-sms/send-sms-configuration.component";
import {SendEmailConfigurationComponent} from "./components/send-email/send-email-configuration.component";
import {GetMessageConfigurationComponent} from "./components/get-message/get-message-configuration.component";
import {GetTemplateConfigurationComponent} from "./components/get-template/get-template-configuration.component";
import {
    GetAllTemplatesConfigurationComponent
} from "./components/get-all-templates/get-all-templates-configuration.component";
import {SendLetterConfigurationComponent} from "./components/send-letter/send-letter-configuration.component";

const notifyNlPluginSpecification: PluginSpecification = {
  pluginId: 'notify-nl',
  pluginConfigurationComponent: NotifyNlConfigurationComponent,
  pluginLogoBase64: NOTIFY_NL_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'send-sms': SendSmsConfigurationComponent,
    'send-email': SendEmailConfigurationComponent,
    'send-letter': SendLetterConfigurationComponent,
    'get-template': GetMessageConfigurationComponent,
    'get-all-templates': GetAllTemplatesConfigurationComponent,
    'get-message': GetTemplateConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: 'NotifyNL',
      'send-sms': 'Stuur SMS',
      'send-email': 'Stuur een E-mail',
      url: 'NotifyNL API URL',
      urlTooltip: 'Een URL naar de REST API van NotifyNL.',
      description: 'Verstuur SMS en E-mail met de NotifyNL service.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
        'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
      phoneNumber: 'Telefoonnummer',
      phoneNumberTooltip: 'Het telefoonnummer van de ontvanger',
      apiKey: 'API Sleutel',
      apiKeyTooltip: 'De API sleutel van de Service in NotifyNL',
      templateId: 'Template ID',
      templateIdTooltip: 'De unieke identifier van de template die gebruikt wordt voor dit bericht'
    },
    en: {
      title: 'NotifyNL',
      'send-sms': 'Send SMS',
      'send-email': 'Send E-mail',
      url: 'NotifyNL API URL',
      urlTooltip: 'The URL of the NotifyNL REST API.',
      description: 'Send SMS and E-mail with the NotifyNL service.',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
      phoneNumber: 'Phone number',
      phoneNumberTooltip: 'The mobile number of the recipient.',
      apiKey: 'API Sleutel',
      apiKeyTooltip: 'De API sleutel van de Service in NotifyNL',
      templateId: 'Template ID',
      templateIdTooltip: 'The unique ID of the template that will be used for this message'
    }
  },
};

export {notifyNlPluginSpecification};
