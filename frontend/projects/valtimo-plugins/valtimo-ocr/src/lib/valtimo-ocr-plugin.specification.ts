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
    ValtimoOcrConfigurationComponent
} from './components/valtimo-ocr-configuration/valtimo-ocr-configuration.component';
import {VALTIMO_OCR_PLUGIN_LOGO_BASE64} from './assets';
import {FileToTextConfigurationComponent} from "./components/file-to-text/file-to-text-configuration.component";

const valtimoOcrPluginSpecification: PluginSpecification = {
    pluginId: 'valtimo-ocr',
    pluginConfigurationComponent: ValtimoOcrConfigurationComponent,
    pluginLogoBase64: VALTIMO_OCR_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'file-to-text': FileToTextConfigurationComponent
    },
    pluginTranslations: {
        nl: {
            title: 'Valtimo OCR Plugin',
            description: 'Deze plugin zet geüploade documenten of afbeeldingen automatisch om naar doorzoekbare platte tekst met behulp van optische tekenherkenning.',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
            url: 'De URL van de Mistral OCR API endpoint',
            token: 'De API token voor de Mistral OCR API',
            filePV: 'De naam van de procesvariabele waarin het bestand staat',
            pages: 'De hoeveelheid pagina\'s die gescand moeten worden',
            includeImageBase64: 'Of de gescande afbeelding als base64 moet worden toegevoegd',
            resultPV: 'De naam van de procesvariabele waarin het resultaat wordt opgeslagen',
            'file-to-text': 'Bestand naar tekst',
        },
        en: {
            title: 'Valtimo OCR Plugin',
            description: 'This plugin automatically converts uploaded documents or images into searchable plain text using optical character recognition.',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Under this name, the plugin will be recognizable in the rest of the application',
            url: 'The URL of the Mistral OCR API endpoint',
            token: 'The API token for the Mistral OCR API',
            filePV: 'The name of the process variable containing the file',
            pages: 'The number of pages to be scanned',
            includeImageBase64: 'Whether to include the scanned image as base64',
            resultPV: 'The name of the process variable where the result is stored',
            'file-to-text': 'File to text',
        },
        de: {
            title: 'Valtimo OCR Plugin',
            description: 'Dieses Plugin konvertiert hochgeladene Dokumente oder Bilder mithilfe der optischen Zeichenerkennung automatisch in durchsuchbaren Klartext.',
            configurationTitle: 'Konfigurationsname',
            configurationTitleTooltip:
                'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
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

export {valtimoOcrPluginSpecification};
