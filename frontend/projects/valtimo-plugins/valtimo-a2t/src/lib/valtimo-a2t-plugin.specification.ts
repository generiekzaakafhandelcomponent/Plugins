/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
    ValtimoA2tConfigurationComponent
} from './components/valtimo-a2t-configuration/valtimo-a2t-configuration.component';
import {VALTIMO_A2T_PLUGIN_LOGO_BASE64} from './assets';
import {AudioToTranscriptionConfigurationComponent} from "./components/audio-to-transcription/audio-to-transcription-configuration.component";

const valtimoA2tPluginSpecification: PluginSpecification = {
    pluginId: 'valtimo-a2t',
    pluginConfigurationComponent: ValtimoA2tConfigurationComponent,
    pluginLogoBase64: VALTIMO_A2T_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'audio-to-transcription': AudioToTranscriptionConfigurationComponent
    },
    pluginTranslations: {
        nl: {
            title: 'Valtimo A2T Plugin',
            description: 'Deze plugin zet geüploade audio bestanden automatisch om naar platte tekst met behulp van spraakherkenning.',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
            url: 'De URL van de Mistral API endpoint',
            token: 'De API token',
            filePV: 'De naam van de procesvariabele waarin het bestand staat',
            resultPV: 'De naam van de procesvariabele waarin het resultaat wordt opgeslagen',
            'audio-to-transcription': 'Audio naar tekst',
        },
        en: {
            title: 'Valtimo A2T Plugin',
            description: 'This plugin automatically converts uploaded audio into plain text using speech recognition.',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Under this name, the plugin will be recognizable in the rest of the application',
            url: 'The URL of the Mistral API endpoint',
            token: 'Your API token',
            filePV: 'The name of the process variable containing the file',
            resultPV: 'The name of the process variable where the result is stored',
            'audio-to-transcription': 'Audio to text',
        },
        de: {
            title: 'Valtimo A2T Plugin',
            description: 'Dieses Plugin wandelt hochgeladene Audiodateien mithilfe der Spracherkennung automatisch in Klartext um.',
            configurationTitle: 'Konfigurationsname',
            configurationTitleTooltip:
                'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
            url: 'Die URL des Mistral API Endpunkts',
            token: 'Der API Token',
            filePV: 'Der Name der Prozessvariablen, in der die Datei gespeichert ist',
            resultPV: 'Der Name der Prozessvariablen, in der das Ergebnis gespeichert wird',
            'audio-to-transcription': 'Audiodateien zu Text',
        }
    }
};

export {valtimoA2tPluginSpecification};
