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
import {AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64} from './assets';
import {
    ValueMapperConfigurationComponent
} from "./components/valuemapper-configuration/valuemapper-configuration.component";
import {ProcessMappingComponent} from "./components/process-mapping/process-mapping.component";

const valueMapperPluginSpecification: PluginSpecification = {
  pluginId: 'value-mapper',
  pluginConfigurationComponent: ValueMapperConfigurationComponent,
  pluginLogoBase64: AMSTERDAM_EMAILAPI_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'process-mapping-instructions': ProcessMappingComponent
  },
  pluginTranslations: {
    nl: {
      title: 'Amsterdam Email API',
      description:
          'Met de Amsterdam Email API plugin kun je in een process emails versturen',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
    },
    en: {
      title: 'Amsterdam Email API',
      description:
          'Alfresco is a document management system that implements the Document API standard for case-oriented working (the ZGW APIs). With this plugin you can use OAuth client credentials to link with Alfresco',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
    },
    de: {
      title: 'Amsterdam Email API',
      description:
          'OpenNotificaties ist eine document management system, die den Document API-Standard für fallorientiertes Arbeiten (die ZGW-APIs) implementiert. Mit diesem Plugin können Sie Client-Zugangsdaten über OAuth mit Alfresco verknüpfen',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
    },
  },
};

export {valueMapperPluginSpecification};
