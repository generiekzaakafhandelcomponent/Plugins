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
import {OllamaConfigurationComponent} from './components/ollama-configuration/ollama-configuration.component';
import {OLLAMA_PLUGIN_LOGO_BASE64} from './assets';
import {SendPromptConfigurationComponent} from './components/send-prompt/send-prompt-configuration.component';

const ollamaPluginSpecification: PluginSpecification = {
  pluginId: 'ollama',
  pluginConfigurationComponent: OllamaConfigurationComponent,
  pluginLogoBase64: OLLAMA_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'send-prompt': SendPromptConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Ollama',
      'send-prompt': 'Bericht plaatsen',
      url: 'Ollama URL',
      urlTooltip: 'Een URL naar de REST API van Ollama.',
      description: 'Publiceer berichten met de Ollama plugin.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
        'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
      message: 'Bericht',
      messageTooltip: 'De berichttekst.',
    },
    en: {
      title: 'Ollama',
      'send-prompt': 'Send prompt',
      url: 'Ollama URL',
      urlTooltip: 'A URL to the REST API of Ollama',
      description: 'Post messages with the Ollama plugin.',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
        'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
      message: 'Message',
      messageTooltip: 'The message text.',
    },
    de: {
      title: 'Ollama',
      'send-prompt': 'Kommentar posten',
      url: 'Ollama URL',
      urlTooltip: 'Die URL zur REST API von Ollama',
      description: 'Veröffentlichen Sie Nachrichten mit dem Ollama-Plugin.',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
        'Der Name der aktuellen Plugin-Konfiguration. Unter diesem Namen ist die Konfiguration im Rest der Anwendung zu finden.',
      message: 'Kommentar',
      messageTooltip: 'Der Nachrichtentext.',
    },
  },
};

export {ollamaPluginSpecification};
