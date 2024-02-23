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
import {PRINTSTRAAT_PLUGIN_LOGO_BASE64} from './assets';
import {
  PrintstraatPluginConfigurationComponent
} from "./components/printstraat-configuration/printstraat-plugin-configuration.component";
import {
  SendDocumentToPrintstraatConfigurationComponent
} from "./components/send-document-to-printstraat/send-document-to-printstraat-configuration.component";

const printstraatPluginSpecification: PluginSpecification = {
  pluginId: 'printstraat',
  pluginLogoBase64: PRINTSTRAAT_PLUGIN_LOGO_BASE64,
  pluginConfigurationComponent: PrintstraatPluginConfigurationComponent,
  functionConfigurationComponents: {
    'send-document-to-printstraat' : SendDocumentToPrintstraatConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: "printstraat",
      description: "Met deze plugin kan je documenten naar de printstraat versturen",
      url: "url",
      token: "token",
      zaaknummerVariable: "zaaknummer variable",
      tempFileIdVariable: "temp file id variable",
      'send-document-to-printstraat': "Stuur het document naar de printstraat"
    },
    en: {
      title: "printstraat",
      description: "With this plugin you can send documents to the printing station",
      url: "url",
      token: "token",
      zaaknummerVariable: "casenumber variable",
      tempFileIdVariable: "temp file id variable",
      'send-document-to-printstraat': "Send the document to the printing station"
    },
    de: {
      title: "printstraat",
      description: "Mit diesem Plugin können Sie Dokumente an die Druckstation senden",
      url: "url",
      token: "token",
      zaaknummerVariable: "Fallnummer variable",
      tempFileIdVariable: "temp file id variable",
      'send-document-to-printstraat': "Senden Sie das Dokument an die Druckstation"
    },
  },
};

export {printstraatPluginSpecification};
