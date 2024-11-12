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
import {PublictaskPluginConfigurationComponent} from './components/public-task-configuration/publictask-plugin-configuration.component';
import {PUBLIC_TASK_PLUGIN_LOGO_BASE64} from './assets';
import {CreatePublicTaskConfigurationComponent} from "./components/create-public-task/create-public-task-configuration.component";

const publictaskPluginSpecification: PluginSpecification = {
  pluginId: 'public-task',
  pluginConfigurationComponent: PublictaskPluginConfigurationComponent,
  pluginLogoBase64: PUBLIC_TASK_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'create-public-task': CreatePublicTaskConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: "public-task",
      configurationTitle: "De naam van de plugin",
      description: "Met deze plugin kan een Usertask beschikbaar worden gemaakt buiten de Valtimo UI",
      pvAssigneeCandidateContactData: "de process variable waarin de assignee Candidate wordt bewaard. Start met pv:",
      timeToLive: "Time To Live voor de URL. Default is 28 dagen"
    },
    en: {
      title: "public-task",
      configurationTitle: "The name of the plugin",
      description: "The Public Task plugin module contains a plugin for making user tasks available outside the Valtimo UI",
      pvAssigneeCandidateContactData: "the process variable in which the assignee Candidate is saved. Start with pv:",
      timeToLive: "Time To Live of the URL. Default is 28 days"
    },
    de: {
      title: "public-task",
      configurationTitle: "Der Name des Plugins",
      description: "Das Public Task Plugin-Modul enthält ein Plugin, um Benutzeraufgaben außerhalb der Valtimo-Oberfläche verfügbar zu machen",
      pvAssigneeCandidateContactData: "Die Prozessvariable, in der der assignee Candidate gespeichert wird. Start mit pv: ",
      timeToLive: "Time To Live fur der URL. Standardmäßig sind es 28 Tage"
    }
  },
};

export {publictaskPluginSpecification};
