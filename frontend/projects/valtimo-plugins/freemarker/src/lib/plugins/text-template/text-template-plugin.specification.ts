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
import {TextTemplateConfigurationComponent} from './components/text-template-configuration/text-template-configuration.component';
import {TEXT_TEMPLATE_PLUGIN_LOGO_BASE64} from './assets';
import {GenerateTextFileComponent} from './components/generate-text-file/generate-text-file.component';

const textTemplatePluginSpecification: PluginSpecification = {
  pluginId: 'text-template',
  pluginConfigurationComponent: TextTemplateConfigurationComponent,
  pluginLogoBase64: TEXT_TEMPLATE_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'generate-text-file': GenerateTextFileComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Text sjablonen',
      'generate-text-file': 'Genereer Textbestand',
      description: 'Maak Text sjablonen met Freemarker.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'De naam van de huidige plug-in configuratie. Onder deze naam kan de configuratie worden gevonden in de rest van de applicatie.',
      generateTextFileDescription:
          'Deze actie genereert de inhoud van een text-template en slaat het resultaat op in een tijdelijk bestand. Het ID van het bestand wordt opgeslagen in een Proces Variabele.',
      textTemplateKey: 'Text sjabloon',
      textTemplateKeyTooltip: 'Op bases van deze sjabloon wordt de text-template gegenereerd',
      processVariableName: 'Procesvariabelenaam',
      processVariableNameTooltip: 'Het resultaat wordt opgeslagen in een procesvariabele met deze naam',
    },
    en: {
      title: 'Text Templates',
      'generate-text-file': 'Generate Text File',
      description: 'Create text-template templates with Freemarker.',
      configurationTitle: 'Configuration Name',
      configurationTitleTooltip:
          'The name of the current plug-in configuration. The configuration can be found under this name in the rest of the application.',
      generateTextFileDescription:
          'This action generates the content of an text-template and saves the result in a temporary file. The file ID is stored in a Process Variable.',
      textTemplateKey: 'Text Template',
      textTemplateKeyTooltip: 'The text-template will be generated based on this template.',
      processVariableName: 'Process Variable Name',
      processVariableNameTooltip: 'The result will be stored in a process variable with this name.',
    },
    de: {
      title: 'Text-Vorlagen',
      'generate-text-file': 'Text-Datei generieren',
      description: 'Erstellen Sie Text-Vorlagen mit Freemarker.',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Der Name der aktuellen Plug-in-Konfiguration. Unter diesem Namen kann die Konfiguration im Rest der Anwendung gefunden werden.',
      generateTextFileDescription:
          'Diese Aktion generiert den Inhalt einer Text und speichert das Ergebnis in einer temporären Datei. Die Datei-ID wird in einer Prozessvariablen gespeichert.',
      textTemplateKey: 'Text-Vorlage',
      textTemplateKeyTooltip: 'Die Text wird basierend auf dieser Vorlage generiert.',
      processVariableName: 'Prozessvariablenname',
      processVariableNameTooltip: 'Das Ergebnis wird in einer Prozessvariablen mit diesem Namen gespeichert.',
    },
  },
};

export {textTemplatePluginSpecification};
