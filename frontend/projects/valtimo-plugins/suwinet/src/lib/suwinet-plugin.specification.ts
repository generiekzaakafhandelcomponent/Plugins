/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {PluginSpecification} from '@valtimo/plugin';
import {SUWINET_PLUGIN_LOGO_BASE64} from './assets';
import {
    SuwinetPluginConfigurationComponent
} from "./components/plugin-configuration/suwinet-plugin-configuration.component";

import {BrpPersoonInfoComponent} from './components/brp-persoon-info/brp-persoon-info.component';
import {BrpPartnerInfoComponent} from './components/brp-partner-info/brp-partner-info.component';
import {BrpKinderenInfoComponent} from './components/brp-kinderen-info/brp-kinderen-info.component';
import {RdwVoertuigenComponent} from "./components/rdw-voertuigen/rdw-voertuigen.component";
import {DuoPersoonsInfoComponent} from "./components/duo-persoons-info/duo-persoons-info.component";
import {SvbPersoonsInfoComponent} from "./components/svb-persoons-info/svb-persoons-info.component";
import {DuoStudiefinancieringComponent} from "./components/duo-studiefinanciering/duo-studiefinanciering.component";
import {UwvInkomstenInfoComponent} from "./components/uwv-inkomsten-persoon-info/uwv-inkomsten-info.component";
import {KadastraleObjectenComponent} from "./components/kadasterobjecten/kadastrale-objecten.component";
import {
    BijstandsregelingenInfoComponent
} from "./components/bijstandsregelingen-info/bijstandsregelingen-info.component";
import {KadastraleAanduidingenComponent} from "./components/kadastrale-aanduidingen/kadastrale-aanduidingen.component";

const suwinetPluginSpecification: PluginSpecification = {
    pluginId: 'suwinet',
    pluginConfigurationComponent: SuwinetPluginConfigurationComponent,
    pluginLogoBase64: SUWINET_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'ophalen-bijstandsregelingen': BijstandsregelingenInfoComponent,
        'get-brp-persoonsgegevens': BrpPersoonInfoComponent,
        'get-brp-partner-persoonsgegevens': BrpPartnerInfoComponent,
        'get-brp-kinderen-persoonsgegevens': BrpKinderenInfoComponent,
        'get-kadastrale-aanduidigen': KadastraleAanduidingenComponent,
        'get-kadastrale-object': KadastraleObjectenComponent,
        'get-rdw-voertuigen': RdwVoertuigenComponent,
        'get-duo-persoonsinfo': DuoPersoonsInfoComponent,
        'get-duo-studiefinanciering': DuoStudiefinancieringComponent,
        'get-svb-persoonsinfo': SvbPersoonsInfoComponent,
        'get-uwv-inkomsten-info': UwvInkomstenInfoComponent,
    },
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'Hier kunt je een eigen naam verzinnen. Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
            title: 'SuwiNet',
            description: 'Plugin om data uit Suwinet op te halen',
            url: 'URL',
            bsn: 'Burgerservicenummer',
            kinderenBsns: 'Kinderen Burgerservicenummers',
            bsnTooltip: 'De burgerservice nummer waarop een zoek gedaan wordt',
            kinderenBsnsTooltip: 'De burgerservicenummers van de kinderen waarop een zoek gedaan wordt',
            suffixTooltip: 'Indien er een suffix na de service naam is, vul die hier in. Bijvoorbeeld /v1',
            dynamicProperties: 'Dynamische eigenschappen',
            kenteken: 'Kenteken',
            codeGemeente: 'Gemeentecode',
            codeGemeenteTooltip: 'De code van de gemeente waarin het kadastrale object zich bevindt',
            gemeentenaam: 'Gemeentenaam',
            gemeentenaamTooltip: 'De naam van de gemeente waarin het kadastrale object zich bevindt',
            sectie: 'Sectie',
            sectieTooltip: 'De sectie van het kadastrale object',
            perceelnr: 'Perceelnummer',
            perceelnrTooltip: 'Het perceelnummer van het kadastrale object',
            volgnrAppartementsrecht: 'Volgnummer appartementsrecht',
            volgnrAppartementsrechtTooltip: 'Het volgnummer van het appartementsrecht (optioneel)',
            pluginActionWarning: 'Vul de verplichte velden in voor deze plugin actie',
            resultProcessVariableName: 'Naam van de proces variabele voor het opslaan van de respons',
            resultProcessVariableNameTooltip:
                'De naam van de proces variabele waar het resultaat in opgeslagen wordt. Zodoende kan deze variabele worden gebruikt in andere BPMN taken.',
            authenticationPluginConfiguration: 'Configuratie authenticatie-plug-in',
            authenticationPluginConfigurationTooltip:
                'Selecteer de plugin die de authenticatie kan afhandelen. Wanneer de selectiebox leeg blijft zal de authenticatie plugin eerst aangemaakt moeten worden',
            baseUrl: 'Base URL',
            suffix: 'Achtervoegsel',
            maxPeriods: 'Maximale perioden',
            connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
            receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
            'get-brp-persoonsgegevens': 'Ophalen BRP Persoonsgegevens',
            'get-brp-partner-persoonsgegevens': 'Ophalen BRP Partner info',
            'get-brp-kinderen-persoonsgegevens': 'Ophalen BRP Kinderen info',
            'ophalen-bijstandsregelingen': 'Ophalen bijstandsregelingen',
            'get-kadastrale-aanduidingen': 'Ophalen kadastrale aanduidingen',
            'get-kadastrale-object': 'Ophalen kadastrale object',
            'get-rdw-voertuigen': 'Ophalen RDW voertuigen',
            'get-duo-persoonsinfo': 'Ophalen DUO persoonsinfo',
            'get-duo-studiefinanciering': 'Ophalen DUO studiefinanciering',
            'get-svb-persoonsinfo': 'Ophalen SVB persoonsinfo',
            'get-uwv-inkomsten-info': 'Ophalen UWV inkomsten info'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Here you can enter a name for the plugin. This name will be used to recognize the plugin throughout the rest of the application',
            title: 'SuwiNet',
            description: 'This plugin makes it possible to communicate with SuwiNet.',
            url: 'URL',
            bsn: 'BSN',
            kinderenBsns: 'Childrens BSNs',
            bsnTooltip: 'The burgerservicenummer for which the request should be made',
            kinderenBsnsTooltip: 'The burgerservicenummers of the children for which the request should be made',
            resultProcessVariableName: 'Process variable name for storing the response',
            resultProcessVariableNameTooltip:
                'The name of the process variable that the response should be saved to. This process variable can be used to access the response in another BPMN task.',
            pluginActionWarning: 'Fill in the required fields for this plugin action',
            codeGemeente: 'Municipality code',
            codeGemeenteTooltip: 'The code of the municipality in which the cadastral object is located',
            gemeentenaam: 'Municipality name',
            gemeentenaamTooltip: 'The name of the municipality in which the cadastral object is located',
            sectie: 'Section',
            sectieTooltip: 'The section of the cadastral object',
            perceelnr: 'Parcel number',
            perceelnrTooltip: 'The parcel number of the cadastral object',
            volgnrAppartementsrecht: 'Apartment right sequence number',
            volgnrAppartementsrechtTooltip: 'The sequence number of the apartment right (optional)',
            suffixTooltip: 'If there is a suffix after the service name, enter it here. For example /v1',
            kenteken: 'License plate',
            authenticationPluginConfiguration: 'Authentication plugin configuration',
            authenticationPluginConfigurationTooltip:
                'Select the plugin that can handle the authentication. If the selection box remains empty, the authentication plugin will have to be created first',
            baseUrl: 'Base URL',
            suffix: 'Suffix',
            dynamicProperties: 'Dynamic properties',
            maxPeriods: 'Maximum periods',
            connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
            receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
            'get-brp-persoonsgegevens': 'Retrieve BRP Personal info',
            'get-brp-partner-persoonsgegevens': 'Retrieve BRP Partner info',
            'get-brp-kinderen-persoonsgegevens': 'Retrieve BRP children info',
            'ophalen-bijstandsregelingen': 'Retrieve welfare schemes',
            'get-kadastrale-objecten': 'Retrieve cadastral objects',
            'get-rdw-voertuigen': 'Retrieve RDW vehicles',
            'get-duo-persoonsinfo': 'Retrieve DUO personal information',
            'get-duo-studiefinanciering': 'Retrieve DUO student finance information',
            'get-svb-persoonsinfo': 'Retrieve SVB personal information',
            'get-uwv-inkomsten-info': 'Retrieve UWV income information'
        },
        de: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Here you can enter a name for the plugin. This name will be used to recognize the plugin throughout the rest of the application',
            title: 'SuwiNet',
            description: 'This plugin makes it possible to communicate with SuwiNet.',
            url: 'URL',
            bsn: 'BSN',
            kinderenBsns: 'Steueridentifikationsnummer der Kinder',
            bsnTooltip: 'Die Bürgerservicenummer, für die die Anfrage gestellt werden soll',
            kinderenBsnsTooltip: 'Die Bürgerservicenummer der Kinder, nach denen gesucht wird',
            resultProcessVariableName: 'Process variable name for storing the response',
            resultProcessVariableNameTooltip:
                'The name of the process variable that the response should be saved to. This process variable can be used to access the response in another BPMN task.',
            pluginActionWarning: 'Füllen Sie die Pflichtfelder für diese Plugin-Aktion aus',
            codeGemeente: 'Gemeindecode',
            codeGemeenteTooltip: 'Der Code der Gemeinde, in der sich das Katasterobjekt befindet',
            gemeentenaam: 'Gemeindename',
            gemeentenaamTooltip: 'Der Name der Gemeinde, in der sich das Katasterobjekt befindet',
            sectie: 'Sektion',
            sectieTooltip: 'Die Sektion des Katasterobjekts',
            perceelnr: 'Flurstücknummer',
            perceelnrTooltip: 'Die Flurstücknummer des Katasterobjekts',
            volgnrAppartementsrecht: 'Wohnungseigentumsrecht Folgenummer',
            volgnrAppartementsrechtTooltip: 'Die Folgenummer des Wohnungseigentumsrechts (optional)',
            suffixTooltip: 'Wenn nach dem Dienstnamen ein Suffix vorhanden ist, geben Sie es hier ein. Zum Beispiel /v1',
            kenteken: 'Kennzeichen',
            authenticationPluginConfiguration: 'Authentifizierungs-Plugin-Konfiguration',
            authenticationPluginConfigurationTooltip:
                'Wählen Sie das Plugin aus, das die Authentifizierung verarbeiten kann. Bleibt das Auswahlfeld leer, muss zunächst das Authentifizierungs-Plugin erstellt werden',
            baseUrl: 'Base URL',
            suffix: 'Suffix',
            dynamicProperties: 'Dynamische Eigenschaften',
            maxPeriods: 'Maximale Perioden',
            connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
            receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
            'get-brp-persoonsgegevens': 'Abrufen BRP Personal info',
            'get-brp-partner-persoonsgegevens': 'Abrufen BRP Partner info',
            'get-brp-kinderen-persoonsgegevens': 'Abrufen BRP kinder info',
            'ophalen-bijstandsregelingen': 'Abrufen Wohlfahrtssysteme',
            'get-kadastrale-objecten': 'Abrufen von Katasterobjekten',
            'get-rdw-voertuigen': 'Abrufen von RDW-Fahrzeugen',
            'get-duo-persoonsinfo': 'Abrufen von DUO-Personeninformationen',
            'get-duo-studiefinanciering': 'Abrufen von DUO-Studienfinanzierungsinformationen',
            'get-svb-persoonsinfo': 'Abrufen von SVB-Personeninformationen',
            'get-uwv-inkomsten-info': 'Abrufen von UWV-Einkommensinformationen'
        },
    },
};

export {suwinetPluginSpecification};
