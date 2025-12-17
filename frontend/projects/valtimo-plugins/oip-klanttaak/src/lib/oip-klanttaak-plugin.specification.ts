/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

import {PluginSpecification} from "@valtimo/plugin";
import {PLUGIN_LOGO_BASE64} from "./assets/oip-klanttaak-plugin-logo";
import {
  CompleteOipDelegatedTaskComponent
} from "./components/complete-oip-delegated-task/complete-oip-delegated-task.component";
import {ConfigurationComponent} from "./components/configuration/configuration.component";
import {DelegateTaskToOipComponent} from "./components/delegate-task-to-oip/delegate-task-to-oip.component";

const opiKlanttaakPluginSpecification: PluginSpecification = {
  pluginId: 'oip-klanttaak',
  pluginConfigurationComponent: ConfigurationComponent,
  pluginLogoBase64: PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'delegate-task-to-oip': DelegateTaskToOipComponent,
    'complete-to-oip-delegated-task': CompleteOipDelegatedTaskComponent,
  },
  pluginTranslations: {
    nl: {
      title: '',
      description: '',

    },
    en: {
      title: '',
      description: '',
    },
    de: {
      title: '',
      description: '',
    }
  }
}

export {opiKlanttaakPluginSpecification};
