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
import {CoworkerConfigurationComponent} from './components/coworker-configuration/coworker-configuration.component';
import {COWORKER_PLUGIN_LOGO_BASE64} from './assets';
import {SendMessageConfigurationComponent} from './components/send-message/send-message-configuration.component';

const coworkerPluginSpecification: PluginSpecification = {
  pluginId: 'coworker',
  pluginConfigurationComponent: CoworkerConfigurationComponent,
  pluginLogoBase64: COWORKER_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'send-message': SendMessageConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Coworker',
      'send-message': 'Bericht versturen naar Coworker',
      description: 'Communiceer met een Coworker Service via RabbitMQ.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
        'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
      rabbitHost: 'RabbitMQ host',
      rabbitHostTooltip: 'Het hostadres van de RabbitMQ server.',
      rabbitPort: 'RabbitMQ poort',
      rabbitPortTooltip: 'De poort van de RabbitMQ server (standaard 5672).',
      rabbitUsername: 'RabbitMQ gebruikersnaam',
      rabbitUsernameTooltip: 'De gebruikersnaam voor RabbitMQ authenticatie.',
      rabbitPassword: 'RabbitMQ wachtwoord',
      rabbitPasswordTooltip: 'Het wachtwoord voor RabbitMQ authenticatie.',
      rabbitVirtualHost: 'RabbitMQ virtual host',
      rabbitVirtualHostTooltip: 'De virtual host op de RabbitMQ server (standaard /).',
      sourceUrn: 'Bron URN',
      sourceUrnTooltip:
        'De URN die deze applicatie identificeert (bijv. urn:nld:oin:00000001234567890000:systeem:app).',
      exchange: 'Exchange',
      exchangeTooltip:
        'De RabbitMQ exchange om naar te publiceren. Laat leeg voor de default exchange.',
      routingKey: 'Routing key',
      routingKeyTooltip: 'De routing key voor het publiceren van berichten.',
      replyToQueue: 'Reply-to queue',
      replyToQueueTooltip: 'De queue naam waarop antwoorden worden ontvangen.',
      coworkerId: 'Coworker ID',
      coworkerIdTooltip: 'De UUID van de coworker.',
      userPrompt: 'Gebruikersprompt',
      userPromptTooltip: 'De vraag of het verzoek aan de coworker. Ondersteunt pv: prefix voor procesvariabelen.',
      expertiseId: 'Expertise ID',
      expertiseIdTooltip: 'Optioneel: UUID van de expertise voor gestructureerde verzoeken.',
      expertiseInput: 'Expertise input (JSON)',
      expertiseInputTooltip: 'Optioneel: JSON-object met invoergegevens voor de expertise.',
      sessionId: 'Sessie ID',
      sessionIdTooltip: 'Optioneel: sessie-ID om een bestaand gesprek voort te zetten.',
      callbackUrl: 'Callback URL',
      callbackUrlTooltip: 'Optioneel: HTTP POST URL voor het antwoord.',
    },
    en: {
      title: 'Coworker',
      'send-message': 'Send message to Coworker',
      description: 'Communicate with a Coworker Service via RabbitMQ.',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
        'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
      rabbitHost: 'RabbitMQ host',
      rabbitHostTooltip: 'The host address of the RabbitMQ server.',
      rabbitPort: 'RabbitMQ port',
      rabbitPortTooltip: 'The port of the RabbitMQ server (default 5672).',
      rabbitUsername: 'RabbitMQ username',
      rabbitUsernameTooltip: 'The username for RabbitMQ authentication.',
      rabbitPassword: 'RabbitMQ password',
      rabbitPasswordTooltip: 'The password for RabbitMQ authentication.',
      rabbitVirtualHost: 'RabbitMQ virtual host',
      rabbitVirtualHostTooltip: 'The virtual host on the RabbitMQ server (default /).',
      sourceUrn: 'Source URN',
      sourceUrnTooltip:
        'The URN identifying this application (e.g. urn:nld:oin:00000001234567890000:systeem:app).',
      exchange: 'Exchange',
      exchangeTooltip:
        'The RabbitMQ exchange to publish to. Leave empty for the default exchange.',
      routingKey: 'Routing key',
      routingKeyTooltip: 'The routing key for publishing messages.',
      replyToQueue: 'Reply-to queue',
      replyToQueueTooltip: 'The queue name to listen on for responses.',
      coworkerId: 'Coworker ID',
      coworkerIdTooltip: 'The UUID of the coworker.',
      userPrompt: 'User prompt',
      userPromptTooltip: 'The question or request for the coworker. Supports pv: prefix for process variables.',
      expertiseId: 'Expertise ID',
      expertiseIdTooltip: 'Optional: UUID of the expertise for structured requests.',
      expertiseInput: 'Expertise input (JSON)',
      expertiseInputTooltip: 'Optional: JSON object with input data for the expertise.',
      sessionId: 'Session ID',
      sessionIdTooltip: 'Optional: session ID to continue an existing conversation.',
      callbackUrl: 'Callback URL',
      callbackUrlTooltip: 'Optional: HTTP POST URL for the response.',
    },
  },
};

export {coworkerPluginSpecification};
