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
    HuggingFaceConfigurationComponent
} from './components/hugging-face-configuration/hugging-face-configuration.component';
import {HUGGING_FACE_PLUGIN_LOGO_BASE64} from './assets';
import {GiveSummaryConfigurationComponent} from './components/give-summary/give-summary-configuration.component';
import {ChatConfigurationComponent} from "./components/chat/chat-configuration.component";

const huggingFacePluginSpecification: PluginSpecification = {
    pluginId: 'hugging-face',
    pluginConfigurationComponent: HuggingFaceConfigurationComponent,
    pluginLogoBase64: HUGGING_FACE_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'give-summary': GiveSummaryConfigurationComponent,
        'chat': ChatConfigurationComponent,
    },
    pluginTranslations: {
        nl: {
            title: 'Hugging Face AI',
            'give-summary': 'Vat een lange tekst samen met het BART-model.',
            'chat': 'Stel een vraag aan Google Gemma model',
            url: 'Hugging Face Inference API URL',
            urlTooltip: 'Een URL naar de REST API van Hugging Face.',
            description: 'Interactie met Hugging Face AI-modellen. Vat een lange tekst samen met het BART-model of stel een vraag aan het Google Gemma-model.',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
            token: 'Token',
            tokenTooltip: 'Authenticatie token met vereiste scopes.',
            longText: 'Give a long text input to be summarized',
            longTextTooltip: 'Give a long text input to be summarized',
            question : "Stel een vraag aan het Google Gemma model",
            questionTooltip : "Stel een vraag aan het Google Gemma model",
            caseKey : "Welke case key moet worden gebruikt?",
            caseKeyTooltip : "",
        },
        en: {
            title: 'Hugging Face AI',
            'give-summary': 'Summarize a long text using the BART model',
            'chat': 'Ask a question to the Google Gemma model',
            url: 'API URL',
            urlTooltip: 'A URL to the REST API of HuggingFace',
            description: 'Interact with Hugging Face AI models. Summarize long text using the BART model. Or ask a question to the Google Gemma model.',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
            token: 'Token',
            tokenTooltip: 'Authentication token bearing required scopes.',
            longText: 'Give a long text input to be summarized',
            longTextTooltip: 'Give a long text input to be summarized',
            question : "Ask a question to the Google Gemma model",
            questionTooltip : "Ask a question to the Google Gemma model",
            caseKey : "Which caseKey is to be used to combine with the question?",
            caseKeyTooltip : "lalal",
        }
    },
};

export {huggingFacePluginSpecification};
