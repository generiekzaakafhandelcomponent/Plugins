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
import {
    DocScannerConfigurationComponent
} from './components/doc-scanner-configuration/doc-scanner-configuration.component';
import {DOC_SCANNER_PLUGIN_LOGO_BASE64} from './assets';
import {FileToTextConfigurationComponent} from "./components/file-to-text/file-to-text-configuration.component";

const docScannerPluginSpecification: PluginSpecification = {
    pluginId: 'doc-scanner',
    pluginConfigurationComponent: DocScannerConfigurationComponent,
    pluginLogoBase64: DOC_SCANNER_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'file-to-text': FileToTextConfigurationComponent
    },
    pluginTranslations: {
        nl: {
            title: 'Document Scanner Plugin',
            description: 'Plugin voor het scannen van fotos en pdf\'s met behulp van AI.',
            url: 'De URL van de Mistral OCR API endpoint',
            token: 'De API token voor de Mistral OCR API',
            filePV: 'De naam van de procesvariabele waarin het bestand staat',
            pages: 'De hoeveelheid pagina\'s die gescand moeten worden',
            includeImageBase64: 'Of de gescande afbeelding als base64 moet worden toegevoegd',
            resultPV: 'De naam van de procesvariabele waarin het resultaat wordt opgeslagen',
            'file-to-text': 'Bestand naar tekst',
        },
        en: {
            title: 'Document Scanner Plugin',
            description: 'Plugin for scanning photos and pdf\'s using AI.',
            url: 'The URL of the Mistral OCR API endpoint',
            token: 'The API token for the Mistral OCR API',
            filePV: 'The name of the process variable containing the file',
            pages: 'The number of pages to be scanned',
            includeImageBase64: 'Whether to include the scanned image as base64',
            resultPV: 'The name of the process variable where the result is stored',
            'file-to-text': 'File to text',
        },
        de: {
            title: 'Dokumentenscanner Plugin',
            description: 'Plugin zum Scannen von Fotos und PDFs mit Hilfe von KI.',
            url: 'Die URL des Mistral OCR API Endpunkts',
            token: 'Der API Token für die Mistral OCR API',
            filePV: 'Der Name der Prozessvariablen, in der die Datei gespeichert ist',
            pages: 'Die Anzahl der zu scannenden Seiten',
            includeImageBase64: 'Ob das gescannte Bild als Base64 hinzugefügt werden soll',
            resultPV: 'Der Name der Prozessvariablen, in der das Ergebnis gespeichert wird',
            'file-to-text': 'Datei zu Text',
        }
    }
};

export {docScannerPluginSpecification};
