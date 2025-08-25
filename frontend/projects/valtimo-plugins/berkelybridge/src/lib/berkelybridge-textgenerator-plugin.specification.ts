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
import {BerkelybridgeTextgeneratorConfigurationComponent} from './components/berkelybridge-textgenerator-configuration/berkelybridge-textgenerator-configuration.component';
import {TextGenerationConfigurationComponent} from "./components/text-generation/text-generation-configuration.component";
import {BERKELYBRIDGE_TEXTGENERATION_PLUGIN_LOGO_BASE64} from "./assets/berkelybridge-textgeneration-plugin-logo";
import {
  FileGenerationConfigurationComponent
} from "./components/file-generation/file-generation-configuration.component";

const berkelybridgeTextgeneratorPluginSpecification: PluginSpecification = {
  pluginId: 'bbtextgenerator',
  pluginConfigurationComponent: BerkelybridgeTextgeneratorConfigurationComponent,
  pluginLogoBase64: BERKELYBRIDGE_TEXTGENERATION_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'genereer-tekst': TextGenerationConfigurationComponent,
    'genereer-file-documenten-api': FileGenerationConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      'genereer-tekst': 'Genereer tekst',
      'genereer-file-documenten-api': 'Genereer file Documenten API',
      title: 'Berkely Bridge tekst en PDF generator',
      description:
          'Met de Berkely Bridge tekst en PDF generator plugin kun je in een process tekst of PDF\'s genereren',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
      berkelybridgeBaseUrl: 'Berkely Bridge base url',
      berkelybridgeBaseUrlTooltip:
          'Vul hier url in waarop Berkely Bridge is te bereiken.',
      subscriptionKey: 'Subscription key',
      subscriptionKeyTooltip:
          'Vul hier de Subcription Key in.',
      modelId: 'Model ID',
      modelIdTooltip: 'Vul het Berkely Bridge model ID in',
      templateId: 'Template ID',
      templateIdTooltip: 'Vul het template ID in om een tekst of PDF te genereren',
      naam: 'Naam',
      nameTooltip: 'Vul hier de naam in van de te genereren file.',
      format: "Formaat",
      formatTooltip: 'Vul hier het formaat in van de te genereren tekst of file',
      parameters: "Parameters",
      parametersTooltip: 'Vul hier de parameters die worden gebruikt in de template',
      variabeleNaam: 'Naam process variabele',
      variabeleNaamTooltip: 'Naam van de process variabele die de tekst bevat',
      addParameter: 'Voeg een parameter toe',
      documentDefinitie: 'Document definitie',
      documentDefinitieTooltip: 'Vul hier de document definitie naam in voor ',
      inputDescription: "Beschrijving",
      inputDescriptionTooltip: "Een generieke beschrijving van de inhoud van het document",
      language: "Taal",
      languageTooltip: "De taal waarin het document is opgesteld",
      informatieobjecttype: "Documenttype",
      informatieobjecttypeTooltip: "Een documenttype dat gerelateerd is aan het zaaktype van het huidige dossier",

    },
    en: {
      'genereer-tekst': 'Generate text',
      'genereer-file-documenten-api': 'Generate file Documenten API',
      title: 'Berkely Bridge text and PDF generator',
      description:
          'With the Berkely Bridge tekst and PDF generator plugin you can generate a text or PDF in a process step',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
      berkelybridgeBaseUrl: 'Berkely Bridge base url',
      berkelybridgeBaseUrlTooltip:
          'Enter the URL here where Berkely Bridge can be reached.',
      subscriptionKey: 'Subscription key',
      subscriptionKeyTooltip:
          'Fill in the subcription Key for the Berkely Bridge API.',
      modelId: 'Model ID',
      modelIdTooltip: 'Enter the Berkely Bridge model ID',
      templateId: 'Template ID',
      templateIdTooltip: 'Enter the template ID to generate a text or PDF',
      naam: 'Naam',
      nameTooltip: 'Enter the name of the file to be generated here.',
      format: "Format",
      formatTooltip: 'Enter the format of the text or file to be generated here',
      parameters: "Parameters",
      parametersTooltip: 'Enter the parameters used in the template here',
      variabeleNaam: 'Process variable name',
      variabeleNaamTooltip: 'Name of the process variable containing the text',
      addParameter: 'Add a parameter',
      inputDescription: "Description",
      inputDescriptionTooltip: "A generic description of the content of the document",
      language: "Language",
      languageTooltip: "The language in which the document is written",
      informatieobjecttype: "Document type",
      informatieobjecttypeTooltip: "A document type which is related to the zaak type of the current case",
    },
    de: {
      'genereer-tekst': 'Generate text',
      'genereer-file-documenten-api': 'Generieren file Documenten API',
      title: 'Berkely Bridge tekst en PDF generator',
      description:
          'Met de Berkely Bridge tekst en PDF generator plugin kun je in een process tekst of PDF\'s genereren',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
      berkelybridgeBaseUrl: 'Berkely Bridge base url',
      berkelybridgeBaseUrlTooltip:
          'Vul hier url in waarop Berkely Bridge is te bereiken.',
      subscriptionKey: 'Subscription key',
      subscriptionKeyTooltip:
          'Geben Sie hier die Subcription Key ein.',
      modelId: 'Model ID',
      modelIdTooltip: 'Vul het Berkely Bridge model ID in',
      templateId: 'Template ID',
      templateIdTooltip: 'Geben Sie die Vorlagen-ID ein, um einen Text oder ein PDF zu generieren',
      naam: 'Name',
      nameTooltip: 'Geben Sie hier den Namen der zu generierenden Datei ein.',
      format: "Format",
      formatTooltip: 'Geben Sie hier das Format des zu generierenden Textes oder der Datei ein',
      parameters: "Parameters",
      parametersTooltip: 'Geben Sie hier die in der Vorlage verwendeten Parameter ein',
      variabeleNaam: 'Name der Prozessvariablen',
      variabeleNaamTooltip: 'Name der Prozessvariablen, die den Text enthält',
      addParameter: 'Fügen Sie einen Parameter hinzu',
      inputDescription: "Beschreibung",
      inputDescriptionTooltip: "Eine allgemeine Beschreibung des Inhalts des Dokuments",
      nld: "Nederlands",
      eng: "Engels",
      deu: "Duits",
      language: "Sprache",
      languageTooltip: "Die Sprache, in der das Dokument geschrieben ist",
      informatieobjecttype: "Dokumententyp",
      informatieobjecttypeTooltip: "Ein Dokumenttyp, der sich auf den Falltyp des aktuellen Falls bezieht",
    },
  },
};

export {berkelybridgeTextgeneratorPluginSpecification};
