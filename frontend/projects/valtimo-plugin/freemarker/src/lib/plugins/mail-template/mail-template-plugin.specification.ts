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
import {MailTemplateConfigurationComponent} from './components/mail-template-configuration/mail-template-configuration.component';
import {FREEMARKER_PLUGIN_LOGO_BASE64} from './assets';
import {GenerateMailContentComponent} from './components/generate-mail-content/generate-mail-content.component';
import {GenerateMailFileComponent} from './components/generate-mail-file/generate-mail-file.component';

const mailTemplatePluginSpecification: PluginSpecification = {
  pluginId: 'mail-template',
  pluginConfigurationComponent: MailTemplateConfigurationComponent,
  pluginLogoBase64: FREEMARKER_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'generate-mail-file': GenerateMailFileComponent,
    'generate-mail-content': GenerateMailContentComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Mail sjablonen',
      'generate-mail-file': 'Genereer Mailbestand',
      'generate-mail-content': 'Genereer Mailinhoud',
      description: 'Maak Mail sjablonen met Freemarker.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'De naam van de huidige plug-in configuratie. Onder deze naam kan de configuratie worden gevonden in de rest van de applicatie.',
      generateMailContentDescription:
          'Deze actie genereert de inhoud van een mail op basis van een sjabloon. De mail tekst wordt opgeslagen in een Proces Variabele.',
      generateMailFileDescription:
          'Deze actie genereert de inhoud van een mail en slaat het resultaat op in een tijdelijk bestand. Het ID van het bestand wordt opgeslagen in een Proces Variabele.',
      mailTemplateKey: 'Mail sjabloon',
      mailTemplateKeyTooltip: 'Op bases van deze sjabloon wordt de mail gegenereerd',
      processVariableName: 'Procesvariabelenaam',
      processVariableNameTooltip: 'Het resultaat wordt opgeslagen in een procesvariabele met deze naam',
    },
    en: {
      title: 'Mail Templates',
      'generate-mail-file': 'Generate Mail File',
      'generate-mail-content': 'Generate Mail Content',
      description: 'Create mail templates with Freemarker.',
      configurationTitle: 'Configuration Name',
      configurationTitleTooltip:
          'The name of the current plug-in configuration. The configuration can be found under this name in the rest of the application.',
      generateMailContentDescription:
          'This action generates the content of an mail based on a template. The mail text is stored in a Process Variable.',
      generateMailFileDescription:
          'This action generates the content of an mail and saves the result in a temporary file. The file ID is stored in a Process Variable.',
      mailTemplateKey: 'Mail Template',
      mailTemplateKeyTooltip: 'The mail will be generated based on this template.',
      processVariableName: 'Process Variable Name',
      processVariableNameTooltip: 'The result will be stored in a process variable with this name.',
    },
    de: {
      title: 'Mail-Vorlagen',
      'generate-mail-file': 'Mail-Datei generieren',
      'generate-mail-content': 'Mail-Inhalt generieren',
      description: 'Erstellen Sie Mail-Vorlagen mit Freemarker.',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Der Name der aktuellen Plug-in-Konfiguration. Unter diesem Namen kann die Konfiguration im Rest der Anwendung gefunden werden.',
      generateMailContentDescription:
          'Diese Aktion generiert den Inhalt einer Mail basierend auf einer Vorlage. Der Mail-Text wird in einer Prozessvariablen gespeichert.',
      generateMailFileDescription:
          'Diese Aktion generiert den Inhalt einer Mail und speichert das Ergebnis in einer temporären Datei. Die Datei-ID wird in einer Prozessvariablen gespeichert.',
      mailTemplateKey: 'Mail-Vorlage',
      mailTemplateKeyTooltip: 'Die Mail wird basierend auf dieser Vorlage generiert.',
      processVariableName: 'Prozessvariablenname',
      processVariableNameTooltip: 'Das Ergebnis wird in einer Prozessvariablen mit diesem Namen gespeichert.',
    },
  },
};

export {mailTemplatePluginSpecification};
