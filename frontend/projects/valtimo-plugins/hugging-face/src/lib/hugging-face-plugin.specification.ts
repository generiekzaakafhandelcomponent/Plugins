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
import {ChatConfigurationComponent} from "./components/chat/chat-configuration.component";
import {ChatMemorizeConfigurationComponent} from "./components/chat-memorize/chat-memorize-configuration.component";

const huggingFacePluginSpecification: PluginSpecification = {
        pluginId: 'valtimo-llm-plugin',
        pluginConfigurationComponent: HuggingFaceConfigurationComponent,
        pluginLogoBase64: HUGGING_FACE_PLUGIN_LOGO_BASE64,
        functionConfigurationComponents: {
            'chat': ChatConfigurationComponent,
            'chat-memorize': ChatMemorizeConfigurationComponent,
        },
        pluginTranslations: {
            nl: {
                title: 'Valtimo LLM Plugin',
                chat: 'Geef een opdracht aan een LLM',
                'chat-memorize': 'Geef een reeks aan opdrachten aan een LLM',
                url: 'API-URL',
                urlTooltip: 'URL van de Hugging Face REST-API',
                description:
                    'Deze plugin maakt het mogelijk om opdrachten te laten uitvoeren door een Large Language AI model.',
                configurationTitle: 'Configuratienaam',
                configurationTitleTooltip:
                    'Naam waaronder deze pluginconfiguratie binnen de applicatie beschikbaar is.',
                token: 'Token',
                tokenTooltip: 'Authenticatietoken met de vereiste scopes.',
                longText: 'Tekst om samen te vatten',
                longTextTooltip: 'Voer de tekst in die je wilt samenvatten.',
                question: 'Vraag aan een LLM',
                questionTooltip: 'Voer je vraag voor het LLM in.',
                chatAnswerPV: 'Voer de naam van de PV in waar het antwoord van het LLM in moet worden opgeslagen.',
                chatAnswerPVTooltip: 'Voer de naam van de PV in waar het antwoord van het LLM in moet worden opgeslagen.',
                interpolatedQuestionPV: 'Voer de naam van de PV in waar de vraag van het LLM in moet worden opgeslagen.',
                interpolatedQuestionPVTooltip: 'Voer de naam van de PV in waar de vraag van het LLM in moet worden opgeslagen.',
                previousQuestion: 'Voer de naam van de PV in waar de vorige vraag van het LLM in word opgeslagen.',
                previousQuestionTooltip: 'Voer de naam van de PV in waar de vorige vraag van het LLM in word opgeslagen.',
                previousAnswer: 'Voer de naam van de PV in waar het vorige antwoord van het LLM in word opgeslagen.',
                previousAnswerTooltip: 'Voer de naam van de PV in waar het vorige antwoord van het LLM in word opgeslagen.',
                maxQandASaved: 'Voer het aantal vragen en antwoorden in dat moet worden meegestuurd met de prompt als context.',
                maxQandASavedTooltip: 'Voer het max aantal vragen en antwoorden in dat moet worden meegestuurd met de prompt als context.',
            },
            en: {
                title: 'Valtimo LLM Plugin',
                'give-summary': 'Summarize long text with the BART model',
                chat: 'Give a task to an LLM',
                'chat-memorize': 'Give a series of assignments to an LLM.',
                url: 'API URL',
                urlTooltip: 'URL of the Hugging Face REST API',
                description:
                    'This plugin enables the execution of commands through a large language AI model.',
                configurationTitle: 'Configuration name',
                configurationTitleTooltip:
                    'Name under which this plugin configuration is available in the application.',
                token: 'Token',
                tokenTooltip: 'Authentication token with the required scopes.',
                longText: 'Text to summarize',
                longTextTooltip: 'Enter the text you want summarized.',
                question: 'Question for the LLM',
                questionTooltip: 'Enter your question for the LLM.',
                chatAnswerPV: 'Enter the name of the PV where the LLM\'s answer should be stored.',
                chatAnswerPVTooltip: 'Enter the name of the PV where the LLM\'s answer should be stored.',
                interpolatedQuestionPV: 'Enter the name of the PV where the LLM\'s question should be stored.',
                interpolatedQuestionPVTooltip: 'Enter the name of the PV where the LLM\'s question should be stored.',
                previousQuestion: 'Enter the name of the PV where the LLM\'s previous question is stored.',
                previousQuestionTooltip: 'Enter the name of the PV where the LLM\'s previous question is stored.',
                previousAnswer: 'Enter the name of the PV where the LLM\'s previous answer is stored.',
                previousAnswerTooltip: 'Enter the name of the PV where the LLM\'s previous answer is stored.',
                maxQandASaved: 'Enter the max number of questions and answers to be sent with the prompt as context.',
                maxQandASavedTooltip: 'Enter the max number of questions and answers to be sent with the prompt as context.',
            },
        }
    }
;

export {huggingFacePluginSpecification};
