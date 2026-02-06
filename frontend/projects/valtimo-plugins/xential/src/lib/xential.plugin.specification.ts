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

const XentialPluginSpecification: PluginSpecification = {
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
      'generate-document': 'Genereer document',
      'prepare-content': 'kies inhoud op basis van een template',
      'validate-xential-toegang': 'Valideer toegang tot Xential Sjablonen',
      fileFormat: 'Bestandsformaat',
      xentialGebruikersId: 'Default Xential gebruiker Id',
      applicationName: 'Xential Taakapplicatie naam',
      applicationPassword: 'Xential Taakapplicatie wachtwoord',
      baseUrl: 'Base url naar Xential via ESB',
      xentialDocumentPropertiesId: 'Document genereren Properties proces variabele',
      xentialDocumentProperties: 'Document genereren Properties',
      xentialData: 'De inhoud voor het genereren van het document',
      xentialSjabloonId: 'Sjabloon id van het te genereren document',
      toegangResultaatId: 'Toegang tot xential test resultaat proces variabele',
      documentFilename: 'Document bestandsnaam',
      informationObjectType: 'Informatie ObjectType',
      mTlsSslContextAutoConfigurationId: 'mTLS SSL context plugin configuratie',
      firstTemplateGroupId: 'Eerste sjabloongroep',
      secondTemplateGroupId: 'Tweede sjabloongroep',
      thirdTemplateGroupId: 'Derde sjabloongroep',
      'select-template-folder': 'Sjabloonmap selecteren',
      resultProcessVariable: 'Resultaat proces variabele',
      resultProcessVariableTooltip: 'Proces variabele waar het resultaat van de deze plugin actie onder wordt opgeslagen'
    },
    en: {
      title: 'Xential',
      description: 'With the Xential plugin documents are generated',
      eventMessageName: 'bpmn event name when document arrives',
      configurationTitle: 'Configuration name',
      'generate-document': 'Generate document',
      'prepare-content': 'Generate document content',
      'validate-xential-toegang': 'Validate access to Xential Sjablonen',
      fileFormat: 'File format',
      documentFilename: 'document filename',
      xentialGebruikersId: 'Default Xential user Id',
      informationObjectType: 'information ObjectType',
      applicationName: 'Xential Taakapplicatie name',
      applicationPassword: 'Xential Taakapplicatie password',
      baseUrl: 'Base url to ESB Xential',
      xentialDocumentPropertiesId: 'Generate Document Properties Process Variable',
      xentialDocumentProperties: 'Generate Document Properties',
      xentialData: 'content for generating the document',
      xentialSjabloonId: 'Template ID of the document to be generated',
      toegangResultaatId: 'Access to xential test result process variable',
      mTlsSslContextAutoConfigurationId: 'mTLS SSL context plugin configuration',
      firstTemplateGroupId: 'First template group',
      secondTemplateGroupId: 'Second template group',
      thirdTemplateGroupId: 'Third template group',
      'select-template-folder': 'Select template folder',
      resultProcessVariable: 'Result process variable',
      resultProcessVariableTooltip: 'Process variable where the result of this plugin action is stored'
    },
  },
};

export {XentialPluginSpecification};
