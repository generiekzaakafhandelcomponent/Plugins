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
    pluginId: 'smart-task-plugin',
    pluginConfigurationComponent: HuggingFaceConfigurationComponent,
    pluginLogoBase64: HUGGING_FACE_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'give-summary': GiveSummaryConfigurationComponent,
        'chat': ChatConfigurationComponent,
    },
    pluginTranslations: {
        nl: {
            title: 'Smart Task Plugin',
            'give-summary': 'Vat een lange tekst samen met het BART-model',
            chat: 'Stel een vraag aan een chatmodel',
            url: 'API-URL',
            urlTooltip: 'URL van de Hugging Face REST-API',
            description:
                'Interactie met Hugging Face-modellen: vat tekst samen met het BART-model of stel vragen aan een chatmodel.',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'Naam waaronder deze pluginconfiguratie binnen de applicatie beschikbaar is.',
            token: 'Token',
            tokenTooltip: 'Authenticatietoken met de vereiste scopes.',
            longText: 'Tekst om samen te vatten',
            longTextTooltip: 'Voer de tekst in die je wilt samenvatten.',
            question: 'Vraag aan een chatmodel',
            questionTooltip: 'Voer je vraag voor het chatmodel in.',
        },
        en: {
            title: 'Smart Task Plugin',
            'give-summary': 'Summarize long text with the BART model',
            chat: 'Ask a question to a chat model',
            url: 'API URL',
            urlTooltip: 'URL of the Hugging Face REST API',
            description:
                'Interact with Hugging Face models: summarize text with the BART model or ask questions to a chat model.',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Name under which this plugin configuration is available in the application.',
            token: 'Token',
            tokenTooltip: 'Authentication token with the required scopes.',
            longText: 'Text to summarize',
            longTextTooltip: 'Enter the text you want summarized.',
            question: 'Question for the chat model',
            questionTooltip: 'Enter your question for the chat model.',
        },
    }
};

export {huggingFacePluginSpecification};
