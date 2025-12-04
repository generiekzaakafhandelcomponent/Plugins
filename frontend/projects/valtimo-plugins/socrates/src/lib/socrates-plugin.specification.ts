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
import {DocsysConfigurationComponent} from './components/socrates-configuration/docsys-configuration.component';
import {DOCSYS_PLUGIN_LOGO_BASE64} from './assets';
import {GenerateDocumentComponent} from "./components/generate-document/generate-document.component";


const socratesPluginSpecification: PluginSpecification = {
    pluginId: 'docsys',
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
            description: 'Genereer documenten met de Docsys plugin.',
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
            modelIdTooltip: 'Vul het pad van de DAM API in',
            format: "Formaat",
            formatTooltip: 'Vul hier het formaat in van de te genereren tekst of file',
            parameters: "Parameters",
            parametersTooltip: 'Vul hier de parameters die worden gebruikt in de template',
            variabeleNaam: 'Naam process variabele',
            variabeleNaamTooltip: 'Naam van de process variabele die de tekst bevat',
            addParameter: 'Voeg een parameter toe',
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
            modelIdTooltip: 'Enter the path of the DAM API URL',
            format: "Format",
            formatTooltip: 'Enter the format of the text or file to be generated here',
            parameters: "Parameters",
            parametersTooltip: 'Enter the parameters used in the template here',
            variabeleNaam: 'Process variable name',
            variabeleNaamTooltip: 'Name of the process variable containing the text',
            addParameter: 'Add a parameter',
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
            modelIdTooltip: 'Vul het pad van de DAM API URL in',
            templateId: 'Template ID',
            templateIdTooltip: 'Geben Sie die Vorlagen-ID ein, um einen Text oder ein PDF zu generieren',
            format: "Format",
            formatTooltip: 'Geben Sie hier das Format des zu generierenden Textes oder der Datei ein',
            parameters: "Parameters",
            parametersTooltip: 'Geben Sie hier die in der Vorlage verwendeten Parameter ein',
            variabeleNaam: 'Name der Prozessvariablen',
            variabeleNaamTooltip: 'Name der Prozessvariablen, die den Text enthält',
            addParameter: 'Fügen Sie einen Parameter hinzu',
        },
    },
};

export {socratesPluginSpecification};
