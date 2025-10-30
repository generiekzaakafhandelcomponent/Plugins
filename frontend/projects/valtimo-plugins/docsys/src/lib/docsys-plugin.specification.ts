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
import {DocsysConfigurationComponent} from './components/docsys-configuration/docsys-configuration.component';
import {DOCSYS_PLUGIN_LOGO_BASE64} from './assets';
import {GenerateDocumentComponent} from "./components/generate-document/generate-document.component";


const docsysPluginSpecification: PluginSpecification = {
    pluginId: 'Docsys',
    pluginConfigurationComponent: DocsysConfigurationComponent,
    pluginLogoBase64: DOCSYS_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'generate-document': GenerateDocumentComponent
    },
    pluginTranslations: {
        nl: {
            title: 'Docsys',
            damApiUrl: 'Docsys URL van DAM API',
            damApiUrlTooltip: 'Een URL naar de DAM API van Docsys.',
            docsysApiUrl: 'Docsys URL van Docsys API',
            docsysApiUrlTooltip: 'Een URL naar de Docsys API van Docsys.',
            description: 'Genereer dokumenten met de Docsys plugin.',
            clientId: "Client ID",
            clientIdTooltip: "Vul het client ID in",
            clientSecret: "Client Secret",
            clientSecretTooltip: "Vul het client secret in",
            tokenEndpoint: 'Token endpoint',
            tokenEndpointTooltip: 'Vul het token endpoint in',
            scope: 'Scope',
            scopeTooltip: 'Vul de scope van het token in',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
            'generate-document': 'Genereer document',
            modelId: 'Model ID',
            modelIdTooltip: 'Vul het Berkely Bridge model ID in',
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
            title: 'Docsys',
            damApiUrl: 'Docsys URL van DAM API',
            damApiUrlTooltip: 'Een URL naar de DAM API van Docsys.',
            docsysApiUrl: 'Docsys URL van Docsys API',
            docsysApiUrlTooltip: 'Een URL naar de Docsys API van Docsys.',
            description: 'Generate documents with the Docsys plugin.',
            clientId: "Client ID",
            clientIdTooltip: "Give the client ID",
            clientSecret: "Client Secret",
            clientSecretTooltip: "Give the client secret",
            tokenEndpoint: 'Token endpoint',
            tokenEndpointTooltip: 'Give the token endpoint',
            scope: 'Scope',
            scopeTooltip: 'Give the scope of the token',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
            'generate-document': 'Generate document',
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
            title: 'Docsys',
            damApiUrl: 'Docsys URL van DAM API',
            damApiUrlTooltip: 'Een URL naar de DAM API van Docsys.',
            docsysApiUrl: 'Docsys URL van Docsys API',
            docsysApiUrlTooltip: 'Een URL naar de Docsys API van Docsys.',
            description: 'Genereer dokumenten met de Docsys plugin.',
            clientId: "Client ID",
            clientIdTooltip: "Vul het client ID in",
            clientSecret: "Client Secret",
            clientSecretTooltip: "Vul het client secret in",
            tokenEndpoint: 'Token endpoint',
            tokenEndpointTooltip: 'Vul het token endpoint in',
            scope: 'Scope',
            scopeTooltip: 'Vul de scope van het token in',
            configurationTitle: 'Konfigurationsname',
            configurationTitleTooltip:
                'Der Name der aktuellen Plugin-Konfiguration. Unter diesem Namen ist die Konfiguration im Rest der Anwendung zu finden.',
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

export {docsysPluginSpecification};
