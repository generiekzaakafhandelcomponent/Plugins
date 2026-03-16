/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

const xentialPluginSpecification: PluginSpecification = {
  pluginId: 'xential',
  pluginConfigurationComponent: XentialConfigurationComponent,
  pluginLogoBase64: XENTIAL_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'generate-document': GenerateDocumentConfigurationComponent,
    'prepare-content': PrepareContentConfigurationComponent,
    'validate-xential-toegang': ValidateAccessConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Xential',
      description: 'Met de Xential plugin worden documenten gegenereerd',
      eventMessageName: 'De BPMN event naam als document is ontvangen',
      configurationTitle: 'Configuratie naam',
      baseUrl: 'Base url naar Xential via ESB',
      applicationName: 'Xential applicatie naam',
      applicationPassword: 'Xential applicatie wachtwoord',
      mTlsSslContextAutoConfigurationId: 'mTLS SSL context plugin configuratie',
      xentialDocumentPropertiesVariableName: 'Document properties proces variabele',
      xentialDocumentPropertiesVariableNameTooltip: 'De naam van de proces variabele waar de document properties zijn/worden opgeslagen.',
      xentialGebruikersId: 'Xential gebruikers ID',
      xentialGebruikersIdTooltip: 'Vul hier het Xential gebruikers ID in. Dit kan een vaste waarde zijn maar ook een van de Valtimo value-resolvers (case:, doc: of pv:)',
      'validate-xential-toegang': 'Valideer toegang tot Xential Sjablonen',
      toegangResultaatId: 'Proces variable referentie',
      toegangResultaatIdTooltip: 'De naam van de proces variable waar het resultaat van de toegangstest tot Xential in wordt opgeslagen',
      'prepare-content': 'Document inhoud voorbereiden',
      firstTemplateGroupId: 'Eerste sjabloongroep',
      secondTemplateGroupId: 'Tweede sjabloongroep',
      thirdTemplateGroupId: 'Derde sjabloongroep',
      'generate-document': 'Genereer document',
      xentialData: 'De inhoud voor het genereren van het document',
      xentialSjabloonId: 'Sjabloon id van het te genereren document',
      xentialSjabloonIdTooltip: 'Vul hier het Xential Sjabloon ID in. Dit kan een vaste waarde zijn maar ook een van de Valtimo value-resolvers (case:, doc: of pv:)',
      fileFormat: 'Bestandsformaat',
      fileFormatTooltip: 'Vul hier het bestandsformaat [PDF | WORD] in. Dit kan een vaste waarde zijn maar ook een van de Valtimo value-resolvers (case:, doc: of pv:)',
    },
    en: {
      title: 'Xential',
      description: 'With the Xential plugin documents are generated',
      eventMessageName: 'The BPMN event name when document has been generated',
      configurationTitle: 'Configuration name',
      baseUrl: 'Base url to ESB Xential',
      applicationName: 'Xential applicatie name',
      applicationPassword: 'Xential applicatie password',
      mTlsSslContextAutoConfigurationId: 'mTLS SSL context plugin configuration',
      xentialDocumentPropertiesVariableName: 'Document properties process variable',
      xentialDocumentPropertiesVariableNameTooltip: 'The name of the proces variabele where/in which the document properties are stored.',
      xentialGebruikersId: 'Xential user ID',
      xentialGebruikersIdTooltip: 'Enter the Xential user ID here. This can be a fixed value or one of the Valtimo value-resolvers (case:, doc: or pv:)',
      'validate-xential-toegang': 'Validate access to Xential Sjablonen',
      toegangResultaatId: 'Proces variable reference',
      toegangResultaatIdTooltip: 'The name of the process variable in which the result of the access test to Xential is stored',
      'prepare-content': 'Prepare document content',
      firstTemplateGroupId: 'First template group',
      secondTemplateGroupId: 'Second template group',
      thirdTemplateGroupId: 'Third template group',
      'generate-document': 'Generate document',
      xentialData: 'Content for generating the document',
      xentialSjabloonId: 'Template ID of the document to be generated',
      xentialSjabloonIdTooltip: 'Enter the Xential template ID here. This can be a fixed value or one of the Valtimo value-resolvers (case:, doc: or pv:)',
      fileFormat: 'File format',
      fileFormatTooltip: 'Enter the file format [PDF | WORD] here. This can be a fixed value or one of the Valtimo value-resolvers (case:, doc: or pv:)',
    },
  },
};

export {xentialPluginSpecification};
