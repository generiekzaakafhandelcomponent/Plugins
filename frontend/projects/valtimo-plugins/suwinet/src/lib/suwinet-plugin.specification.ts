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

const suwinetPluginSpecification: PluginSpecification = {
  pluginId: 'suwinet',
  pluginConfigurationComponent: SuwinetPluginConfigurationComponent,
  pluginLogoBase64: SUWINET_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'get-brp-persoonsgegevens': BrpPersoonInfoComponent,
    'get-brp-partner-persoonsgegevens': BrpPartnerInfoComponent,
    'get-brp-kinderen-persoonsgegevens': BrpKinderenInfoComponent
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
      kenteken: 'Kenteken',
      bsnTooltip: 'De burgerservice nummer waarop een zoek gedaan wordt',
      pluginActionWarning: 'Fill in the required fields for this plugin action',
      resultProcessVariableName: 'Naam van de proces variabele voor het opslaan van de respons',
      resultProcessVariableNameTooltip:
          'De naam van de proces variabele waar het resultaat in opgeslagen wordt. Zodoende kan deze variabele worden gebruikt in andere BPMN taken.',
      keystorePath: 'Keystore certificate path',
      keystoreSecret: 'Keystore certificate key',
      truststorePath: 'Truststore certificate path',
      truststoreSecret: 'Truststore certificate key',
      basicAuthName: 'Basic Authorization name',
      basicAuthSecret: 'Basic Authorization password',
      baseUrl: 'Base URL',
      connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
      receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
      'get-brp-persoonsgegevens': 'Ophalen BRP Persoonsgegevens',
      'get-brp-partner-persoonsgegevens': 'Ophalen BRP Partner info',
      'get-brp-kinderen-persoonsgegevens': 'Ophalen BRP Kinderen info'
    },
    en: {
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Here you can enter a name for the plugin. This name will be used to recognize the plugin throughout the rest of the application',
      title: 'SuwiNet',
      description: 'This plugin makes it possible to communicate with SuwiNet.',
      url: 'URL',
      bsn: 'BSN',
      bsnTooltip: 'The burgerservicenummer for which the request should be made',
      resultProcessVariableName: 'Process variable name for storing the response',
      resultProcessVariableNameTooltip:
          'The name of the process variable that the response should be saved to. This process variable can be used to access the response in another BPMN task.',
      keystorePath: 'Keystore certificate path',
      keystoreSecret: 'Keystore certificate key',
      truststorePath: 'Truststore certificate path',
      truststoreSecret: 'Truststore certificate key',
      basicAuthName: 'Basic Authorization name',
      basicAuthSecret: 'Basic Authorization password',
      baseUrl: 'Base URL',
      connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
      receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
      'get-brp-persoonsgegevens': 'Retrieve BRP Personal info',
      'get-brp-partner-persoonsgegevens': 'Retrieve BRP Partner info',
      'get-brp-kinderen-persoonsgegevens': 'Retrieve BRP children info'
    },
    de: {
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Here you can enter a name for the plugin. This name will be used to recognize the plugin throughout the rest of the application',
      title: 'SuwiNet',
      description: 'This plugin makes it possible to communicate with SuwiNet.',
      url: 'URL',
      bsn: 'BSN',
      bsnTooltip: 'The burgerservicenummer for which the request should be made',
      resultProcessVariableName: 'Process variable name for storing the response',
      resultProcessVariableNameTooltip:
          'The name of the process variable that the response should be saved to. This process variable can be used to access the response in another BPMN task.',
      keystorePath: 'Keystore certificate path',
      keystoreSecret: 'Keystore certificate key',
      truststorePath: 'Truststore certificate path',
      truststoreSecret: 'Truststore certificate key',
      basicAuthName: 'Basic Authorization name',
      basicAuthSecret: 'Basic Authorization password',
      baseUrl: 'Base URL',
      connectionTimeout: 'connectionTimeout: Specifies the amount of time, in seconds, that the consumer will attempt to establish a connection before it times out. 0 is infinite',
      receiveTimeout: 'receiveTimeout: Specifies the amount of time, in seconds, that the consumer will wait for a response before it times out. 0 is infinite.',
      'get-brp-persoonsgegevens': 'Retrieve BRP Personal info',
      'get-brp-partner-persoonsgegevens': 'Retrieve BRP Partner info',
      'get-brp-kinderen-persoonsgegevens': 'Retrieve BRP children info'
    },
  },
};

export {suwinetPluginSpecification};
