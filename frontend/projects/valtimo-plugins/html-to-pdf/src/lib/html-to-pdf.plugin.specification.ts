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
import {HtmlToPdfConfigurationComponent} from './components/html-to-pdf-configuration/html-to-pdf-configuration.component';
import {HTMLTOPDF_PLUGIN_LOGO_BASE64} from './assets';

const HtmlToPdfPluginSpecification: PluginSpecification = {
    pluginId: 'html-to-pdf',
    pluginConfigurationComponent: HtmlToPdfConfigurationComponent,
    pluginLogoBase64: HTMLTOPDF_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
    },
    pluginTranslations: {
        nl: {
            title: 'html-to-pdf',
            description: 'Met de html-to-pdf plugin worden PDF documenten gegenereerd op basis van HTML',
        },
        en: {
            title: 'html-to-pdf',
            description: 'With the html-to-pdf plugin PDF documents are generated based on HTML',
        },
        de: {
            title: 'html-to-pdf',
            description: 'Con il plugin htmml-to-pdf vengono generati i PDF documenti da HTML'
        },
    },
};

export {HtmlToPdfPluginSpecification};
