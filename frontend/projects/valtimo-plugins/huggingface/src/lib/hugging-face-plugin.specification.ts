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
import {HuggingFaceConfigurationComponent} from './components/hugging-face-configuration/hugging-face-configuration.component';
import {SummarizationConfigurationComponent} from './components/summarization-configuration/summarization-configuration.component';
import {HUGGING_FACE_PLUGIN_LOGO_BASE64} from "./assets";

const huggingFacePluginSpecification: PluginSpecification = {
  pluginId: 'hugging-face-ai',
  pluginConfigurationComponent: HuggingFaceConfigurationComponent,
  pluginLogoBase64: HUGGING_FACE_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'summarize-message': SummarizationConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Hugging face',
      'summarize-message': 'Bericht samenvatten',
      url: 'Hugging face URL',
      urlTooltip: 'Een URL naar de REST API van Hugging face.',
      description: 'Verstuur AI verzoeken met de Hugging face plugin.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
        'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
      token: 'Token',
      tokenTooltip: 'Authenticatie token met vereiste scopes.',
      message: 'Bericht',
      messageTooltip: 'De berichttekst.',
    },
    en: {
      title: 'Hugging face',
      'summarize-message': 'Summarize message',
      url: 'Hugging face URL',
      urlTooltip: 'A URL to the REST API of Hugging face',
      description: 'Send AI requests with the Hugging face plugin.',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
        'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
      token: 'Token',
      tokenTooltip: 'Authentication token bearing required scopes.',
      message: 'Message',
      messageTooltip: 'The message text.',
    },
    de: {
      title: 'Hugging face',
      'post-message': 'Kommentar posten',
      'post-message-with-file': 'Kommentar mit Datei posten',
      url: 'Hugging face URL',
      urlTooltip: 'Die URL zur REST API von Hugging face',
      description: 'Veröffentlichen Sie Nachrichten mit dem Hugging face-Plugin.',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
        'Der Name der aktuellen Plugin-Konfiguration. Unter diesem Namen ist die Konfiguration im Rest der Anwendung zu finden.',
      token: 'Token',
      tokenTooltip: 'Authentifizierungstoken mit erforderlichen scopes.',
      channel: 'Channel',
      channelTooltip:
        'Kanal, private Gruppe oder IM-Kanal, an den die Nachricht gesendet werden soll. Kann eine codierte ID oder ein Name sein. Siehe unten für weitere Details.',
      channels: 'Kanäle',
      channelsTooltip:
        'Durch Komma getrennte Liste von Kanalnamen oder IDs, wo die Datei geteilt wird.',
      message: 'Kommentar',
      messageTooltip: 'Der Nachrichtentext.',
      filename: 'Dateiname',
      filenameTooltip: 'Der Dateiname der Datei.',
    },
  },
};

export {huggingFacePluginSpecification};
