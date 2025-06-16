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
import {DocumentGeneratorConfigurationComponent} from './components/document-generator-configuration/document-generator-configuration.component';
import {DOCUMENT_GENERATOR_PLUGIN_LOGO_BASE64} from './assets';
import {GeneratePdfComponent} from './components/generate-pdf/generate-pdf.component';
import {GenerateCsvComponent} from './components/generate-csv/generate-csv.component';

const documentGeneratorPluginSpecification: PluginSpecification = {
  pluginId: 'document-generator',
  pluginConfigurationComponent: DocumentGeneratorConfigurationComponent,
  pluginLogoBase64: DOCUMENT_GENERATOR_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'generate-csv': GenerateCsvComponent,
    'generate-pdf': GeneratePdfComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Document generator',
      'generate-csv': 'Genereer CSV-bestand',
      'generate-pdf': 'Genereer PDF-bestand',
      description: 'Genereer PDF of CSV bestanden met Freemarker-sjablonen.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'De naam van de huidige plug-inconfiguratie. Onder deze naam is de configuratie beschikbaar in de rest van de applicatie.',
      generateDocumentFileDescription:
          'Deze actie genereert een bestand op basis van een Freemarker-sjabloon en slaat het resultaat op in een tijdelijk bestand. Het bestand-ID wordt opgeslagen in een procesvariabele.',
      csvTemplateKey: 'CSV-sjabloon',
      pdfTemplateKey: 'PDF-sjabloon',
      templateKeyTooltip: 'Dit bestand wordt gegenereerd op basis van dit Freemarker-sjabloon.',
      processVariableName: 'Procesvariabelenaam',
      processVariableNameTooltip: 'Het gegenereerde bestand wordt opgeslagen in een procesvariabele met deze naam.',
    },
    en: {
      title: 'Document generator',
      'generate-csv': 'Generate CSV File',
      'generate-pdf': 'Generate PDF File',
      description: 'Generate PDF or CSV files using Freemarker templates.',
      configurationTitle: 'Configuration Name',
      configurationTitleTooltip:
          'The name of the current plug-in configuration. This name is used to reference the configuration throughout the application.',
      generateDocumentFileDescription:
          'This action generates a file based on a Freemarker template and stores the result in a temporary file. The file ID is saved in a process variable.',
      csvTemplateKey: 'CSV Template',
      pdfTemplateKey: 'PDF Template',
      templateKeyTooltip: 'The file will be generated based on this Freemarker template.',
      processVariableName: 'Process Variable Name',
      processVariableNameTooltip: 'The generated file will be stored in a process variable with this name.',
    },
    de: {
      title: 'Document generator',
      'generate-csv': 'CSV-Datei generieren',
      'generate-pdf': 'PDF-Datei generieren',
      description: 'PDF oder CSV Dateien mit Freemarker-Vorlagen generieren.',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Der Name der aktuellen Plug-in-Konfiguration. Diese Konfiguration kann unter diesem Namen in der gesamten Anwendung verwendet werden.',
      generateDocumentFileDescription:
          'Diese Aktion erstellt eine Datei basierend auf einer Freemarker-Vorlage und speichert das Ergebnis in einer temporären Datei. Die Datei-ID wird in einer Prozessvariablen gespeichert.',
      csvTemplateKey: 'CSV-Vorlage',
      pdfTemplateKey: 'PDF-Vorlage',
      templateKeyTooltip: 'Die Datei wird basierend auf dieser Freemarker-Vorlage generiert.',
      processVariableName: 'Prozessvariablenname',
      processVariableNameTooltip: 'Die generierte Datei wird in einer Prozessvariablen mit diesem Namen gespeichert.',
    },
  },
};

export {documentGeneratorPluginSpecification};
