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
  CompleteDelegatedTaskComponent
} from "./components/complete-delegated-task/complete-delegated-task.component";
import {ConfigurationComponent} from "./components/configuration/configuration.component";
import {DelegateTaskComponent} from "./components/delegate-task/delegate-task.component";

const oipKlanttaakPluginSpecification: PluginSpecification = {
  pluginId: 'oip-klanttaak',
  pluginConfigurationComponent: ConfigurationComponent,
  pluginLogoBase64: PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'complete-delegated-task': CompleteDelegatedTaskComponent,
    'delegate-task': DelegateTaskComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Open Inwoner Platform (OIP) - Klanttaak',
      description: 'Delegeer gebruikerstaken naar het Open Inwoner Platform portaal zodat deze opgepakt kunnen worden door de gebruikers van dat portaal.',
      'configuration.title': 'Configuratienaam',
      'configuration.titleTooltip': 'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
      'configuration.notificatiesApiPlugin': 'Notificaties API Plugin',
      'configuration.notificatiesApiPluginTooltip': 'Selecteer de Notificaties API plugin. Wanneer de selectiebox leeg is, zal de notificatie API plugin eerst aangemaakt moeten worden.',
      'configuration.objectManagement': 'Object Management Configuratie',
      'configuration.objectManagementTooltip': 'Selecteer de gewenste object management configuratie. Wanneer de selectiebox leeg is, zal er eerst een object management configuratie aangemaakt moeten worden.',
      'configuration.finalizerProcess': 'Taak-afrondingsproces',
      'configuration.finalizerProcessTooltip': 'Het proces dat een afgeronde taak verwerkt.',
    },
    en: {
      title: 'Open Inwoner Platform (OIP) - Klanttaak',
      description: 'Delegate user tasks to the Open Inwoner Platform portal so these can be picked up by the registered users of that portal.',
      'configuration.title': 'Configuration title',
      'configuration.titleTooltip': 'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
      'configuration.notificatiesApiPlugin': 'Notification API Plugin',
      'configuration.notificatiesApiPluginTooltip': 'Select the Notificaties API plugin. If the selection box remains empty, the Notificaties API plugin will have to be created first.',
      'configuration.objectManagement': 'Object Management Configuration',
      'configuration.objectManagementTooltip': 'Select the desired object management configuration. If the selection box is empty, an object management configuration must first be created.',
      'configuration.finalizerProcess': 'Task-finalizer process',
      'configuration.finalizerProcessTooltip': 'The process that processes a completed task.',
    },
    de: {
      title: 'Open Inwoner Platform (OIP) - Klanttaak',
      description: 'Delegieren Sie Benutzeraufgaben an das Open Resident Platform-Portal, damit diese von den Benutzern dieses Portals übernommen werden können.',
      'configuration.title': 'Konfigurationsname',
      'configuration.titleTooltip': 'Der Name der aktuellen Plugin-Konfiguration. Dieser Name wird verwendet, um die Konfiguration innerhalb der gesamten Anwendung zu finden.',
      'configuration.notificatiesApiPlugin': 'Notifications API-Plugin',
      'configuration.notificatiesApiPluginTooltip': 'Wählen Sie das Notifications API-Plugin aus. Falls das Auswahlfeld leer ist, muss das Notifications API-Plugin zuerst erstellt werden.',
      'configuration.objectManagement': 'Objektverwaltungskonfiguration',
      'configuration.objectManagementTooltip': 'Wählen Sie die gewünschte Objektverwaltungskonfiguration aus. Wenn das Auswahlfeld leer ist, muss zuerst eine Objektverwaltungskonfiguration erstellt werden.',
      'configuration.finalizerProcess': 'Prozess zur Aufgabenerfüllung',
      'configuration.finalizerProcessTooltip': 'Der Prozess, der eine abgeschlossene Aufgabe verarbeitet.',
    }
  }
}

export {oipKlanttaakPluginSpecification};
