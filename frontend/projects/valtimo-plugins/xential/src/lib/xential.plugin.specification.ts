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
import {XentialConfigurationComponent} from './components/xential-configuration/xential-configuration.component';
import {XENTIAL_PLUGIN_LOGO_BASE64} from './assets';
import {
  GenerateDocumentConfigurationComponent
} from './components/generate-document-configuration/generate-document-configuration.component';
import {
  PrepareContentConfigurationComponent
} from './components/prepare-content-configuration/prepare-content-configuration.component';
import {
  ValidateAccessConfigurationComponent
} from './components/validate-access-configuration/validate-access-configuration.component';
import {
  SelectTemplateFolderConfigurationComponent
} from './components/select-template-folder-configuration/select-template-folder-configuration.component';

const xentialPluginSpecification: PluginSpecification = {
  pluginId: 'xential',
  pluginConfigurationComponent: XentialConfigurationComponent,
  pluginLogoBase64: XENTIAL_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'generate-document': GenerateDocumentConfigurationComponent,
    'prepare-content': PrepareContentConfigurationComponent,
    'validate-xential-toegang': ValidateAccessConfigurationComponent,
    'select-template-folder': SelectTemplateFolderConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: 'Xential',
      description: 'Met de Xential plugin worden documenten gegenereerd',
      eventMessageName: 'bpmn event naam als document is ontvangen',
      configurationTitle: 'Configuratie naam',
      baseUrl: 'Base url naar Xential via ESB',
      applicationName: 'Xential applicatie naam',
      applicationPassword: 'Xential applicatie wachtwoord',
      mTlsSslContextAutoConfigurationId: 'mTLS SSL context plugin configuratie',
      'validate-xential-toegang': 'Valideer toegang tot Xential Sjablonen',
      xentialDocumentPropertiesId: 'Document genereren Properties proces variabele',
      xentialGebruikersId: 'Default Xential gebruiker Id',
      toegangResultaatId: 'Toegang tot xential test resultaat proces variabele',
      'prepare-content': 'kies inhoud op basis van een template',
      fileFormat: 'Bestandsformaat',
      informationObjectType: 'Informatie ObjectType',
      firstTemplateGroupId: 'Eerste sjabloongroep',
      secondTemplateGroupId: 'Tweede sjabloongroep',
      thirdTemplateGroupId: 'Derde sjabloongroep',
      xentialDocumentProperties: 'Document genereren Properties',
      'generate-document': 'Genereer document',
      xentialData: 'De inhoud voor het genereren van het document',
      xentialSjabloonId: 'Sjabloon id van het te genereren document',
      'select-template-folder': 'Sjabloonmap selecteren',
      resultProcessVariable: 'Resultaat proces variabele',
      resultProcessVariableTooltip: 'Proces variabele waar het resultaat van de deze plugin actie onder wordt opgeslagen'
    },
    en: {
      title: 'Xential',
      description: 'With the Xential plugin documents are generated',
      eventMessageName: 'bpmn event name when document arrives',
      configurationTitle: 'Configuration name',
      baseUrl: 'Base url to ESB Xential',
      applicationName: 'Xential applicatie name',
      applicationPassword: 'Xential applicatie password',
      mTlsSslContextAutoConfigurationId: 'mTLS SSL context plugin configuration',
      'validate-xential-toegang': 'Validate access to Xential Sjablonen',
      xentialDocumentPropertiesId: 'Generate Document Properties Process Variable',
      xentialGebruikersId: 'Default Xential user Id',
      toegangResultaatId: 'Access to xential test result process variable',
      'prepare-content': 'Generate document content',
      fileFormat: 'File format',
      informationObjectType: 'information ObjectType',
      firstTemplateGroupId: 'First template group',
      secondTemplateGroupId: 'Second template group',
      thirdTemplateGroupId: 'Third template group',
      xentialDocumentProperties: 'Generate Document Properties',
      'generate-document': 'Generate document',
      xentialData: 'content for generating the document',
      xentialSjabloonId: 'Template ID of the document to be generated',
      'select-template-folder': 'Select template folder',
      resultProcessVariable: 'Result process variable',
      resultProcessVariableTooltip: 'Process variable where the result of this plugin action is stored'
    },
  },
};

export {xentialPluginSpecification};
