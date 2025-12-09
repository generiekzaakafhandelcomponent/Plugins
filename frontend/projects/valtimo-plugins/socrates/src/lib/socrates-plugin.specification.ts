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
import {SocratesConfigurationComponent} from './components/socrates-configuration/socrates-configuration.component';
import {DienstAanmakenComponent} from "./components/dienst-aanmaken/dienst-aanmaken.component";
import {SOCRATES_PLUGIN_LOGO_BASE64} from "./assets";


const socratesPluginSpecification: PluginSpecification = {
    pluginId: 'socrates',
    pluginConfigurationComponent: SocratesConfigurationComponent,
    pluginLogoBase64: SOCRATES_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'dienst-aanmaken': DienstAanmakenComponent
    },
    pluginTranslations: {
        nl: {
            title: 'Socrates',
            description: 'Koppel met Socrates via deze plugin.',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
            socratesApiUrl: 'Socrates URL',
            socratesApiUrlTooltip: 'URL waar Socrates is te bereiken',
            'dienst-aanmaken': 'Maak dienst aan in Socrates',
            zaakId: 'Zaak ID',
            zaakIdTooltip: 'Het Id van de Zaak, meestal ZAAK-XXX',
            inputVariabeleName: 'input process variabele voor Socrates',
            inputVariabeleNaamTooltip: 'Naam van de process variabele met input voor Socrates',
            variabeleNaamTooltip: 'Naam van de process variabele die de Socrates respons bevat',
        },
        en: {
            title: 'Socrates',
            description: 'Integrate with Socrates using this plugin.',
            configurationTitle: 'Configuratiename',
            configurationTitleTooltip:
                'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
            socratesApiUrl: 'Socrates URL',
            socratesApiUrlTooltip: 'URL to integrate with Socrates',
            'dienst-aanmaken': 'Maak dienst aan in Socrates',
            zaakId: 'Zaak ID',
            zaakIdTooltip: 'The Id if a cae, usually ZAAK-XXX',
            inputVariabeleName: 'input process variabele for Socrates',
            inputVariabeleNaamTooltip: 'Name of the process variabele with input for Socrates',
            variabeleNaamTooltip: 'Name of the process variable containing the Socrates response',
        },
        de: {
            title: 'Socrates',
            description: 'Verbinde dich über dieses Plugin mit Socrates.',
            configurationTitle: 'Konfigurationsname',
            configurationTitleTooltip:
                'Der Name der aktuellen Plugin-Konfiguration. Dieser Name wird verwendet, um die Konfiguration innerhalb der gesamten Anwendung zu finden.',
            socratesApiUrl: 'Socrates URL',
            socratesApiUrlTooltip: 'URL waar Socrates is te bereiken',
            'dienst-aanmaken': 'Dienst in Socrates erstellen',
            zaakId: 'Zaak ID',
            zaakIdTooltip: 'Das Id von der Zaak, meistens ZAAK-XXX',
            inputVariabeleName: 'Eingabeprozessvariable für Sokrates',
            inputVariabeleNaamTooltip: 'Name der Prozessvariablen mit Eingabe für Sokrates',
            variabeleNaamTooltip: 'Name der Prozessvariablen, die die Sokrates-Antwort enthält',
        },
    },
};

export {socratesPluginSpecification};
