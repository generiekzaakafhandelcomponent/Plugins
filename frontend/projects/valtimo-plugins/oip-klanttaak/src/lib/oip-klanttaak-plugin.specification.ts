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
      description: 'Delegeer klanttaken naar het Open Inwoner Platform (OIP) portaal zodat deze opgepakt kunnen worden door de gebruikers van dat portaal.',
      'configuration.title': 'Configuratienaam',
      'configuration.titleTooltip': 'De naam van de plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
      'configuration.notificatiesApiPluginConfiguration': 'Notificaties API Plugin',
      'configuration.notificatiesApiPluginConfigurationTooltip': 'Selecteer de Notificaties API plugin configuratie. Wanneer de lijst leeg is, zal er eerst een Notificaties API plugin configuratie aangemaakt moeten worden.',
      'configuration.objectManagementConfiguration': 'Object Management Configuratie',
      'configuration.objectManagementConfigurationTooltip': 'Selecteer de gewenste object management configuratie. Wanneer de lijst leeg is, zal er eerst een object management configuratie aangemaakt moeten worden.',
      'configuration.systemFinalizerProcess': 'Systeem taak-afrondingsproces (Systeem)',
      'configuration.caseFinalizerProcess': 'Dossier specifiek taak-afrondingsproces',
      'configuration.finalizerProcessTooltip': 'Het proces dat een afgeronde taak verwerkt. Wanneer de lijst leeg is, zal er eerst een proces aangemaakt moeten worden.',
      'delegate-task': 'Klanttaak delegeren',
      'delegateTask.betrokkeneIdentifier': 'Betrokkene identificatie (BSN)',
      'delegateTask.betrokkeneIdentifierTooltip': 'De unieke identifier van de persoon die de taak moet oppakken.',
      'delegateTask.levelOfAssurance': 'Level of Assurance (LOA)',
      'delegateTask.levelOfAssuranceTooltip': 'Het identificatie mechanisme dat wordt gebruikt om de betrokkenen te identificeren',
      'delegateTask.formulierUri': 'Formulier URL',
      'delegateTask.formulierUriTooltip': 'De URL naar de formulier definitie in Open formulieren',
      'delegateTask.formulierData': 'Formulier gegevens',
      'delegateTask.formulierDataTooltip': 'De gegevens waarmee het formulier vooraf ingevuld wordt.',
      'delegateTask.formulierDataKey': 'Formulier veld',
      'delegateTask.formulierDataValue': 'Waarde',
      'delegateTask.toelichting': 'Toelichting',
      'delegateTask.toelichtingTooltip': 'Een extra toelichting op de taak',
      'delegateTask.koppelingVanToepassing': 'Koppeling van toepassing',
      'delegateTask.koppelingRegistratie': 'Registratie koppeling',
      'delegateTask.koppelingRegistratieTooltip': 'Geeft het soort koppeling aan; Zaak of Product.',
      'delegateTask.koppelingIdentifier': 'Koppeling identifier',
      'delegateTask.koppelingIdentifierTooltip': 'De unieke identifier van de Zaak of het Product van de koppeling.',
      'delegateTask.verloopdatum': 'Verloopdatum',
      'delegateTask.verloopdatumTooltip': 'De datum en tijd waarop de taak verloopt.',
      'complete-delegated-task': 'Afgeronde klanttaak verwerken',
      'completeDelegatedTask.bewaarIngediendeGegevens': 'Bewaar ingediende gegevens',
      'completeDelegatedTask.ontvangenData': 'Ontvangen formulier gegevens',
      'completeDelegatedTask.ontvangenDataTooltip': 'De gegevens waarmee het formulier werd afgerond.',
      'completeDelegatedTask.ontvangenDataKey': 'Pad van de waarde binnen de ontvangen formulier gegevens',
      'completeDelegatedTask.ontvangenDataValue': 'Uitvoer bestemming',
      'completeDelegatedTask.koppelDocumenten': 'Koppel documenten',
      'completeDelegatedTask.padNaarDocumenten': 'Pad naar geüploade documenten',
      'completeDelegatedTask.padNaarDocumentenTooltip': 'Het pad naar de geüploade documenten binnen de ontvangen formulier gegevens',
      'toggle.ja': 'Ja',
      'toggle.nee': 'Nee',
    },
    en: {
      title: 'Open Inwoner Platform (OIP) - Customer task',
      description: 'Delegate customer tasks to the Open Resident Platform (OIP) portal so that they can be picked up by the users of that portal.',
      'configuration.title': 'Configuration title',
      'configuration.titleTooltip': 'The name of the plugin configuration. This name is how the configuration can be found throughout the application.',
      'configuration.notificatiesApiPluginConfiguration': 'Notification API Plugin',
      'configuration.notificatiesApiPluginConfigurationTooltip': 'Select the Notifications API plugin configuration. If the list is empty, a Notifications API plugin configuration will need to be created first.',
      'configuration.objectManagementConfiguration': 'Object Management Configuration',
      'configuration.objectManagementConfigurationTooltip': 'Select the desired object management configuration. If the list is empty, an object management configuration must first be created.',
      'configuration.systemFinalizerProcess': 'System task-finalizer process',
      'configuration.caseFinalizerProcess': 'Case specific task-finalizer process',
      'configuration.finalizerProcessTooltip': 'The process that processes a completed task. If the list is empty, a process must first be created.',
      'delegate-task': 'Delegate customer task',
      'delegateTask.betrokkeneIdentifier': 'Involved party identifier (BSN)',
      'delegateTask.betrokkeneIdentifierTooltip': 'The unique identifier of the person who should pick up the task.',
      'delegateTask.levelOfAssurance': 'Level of Assurance (LOA)',
      'delegateTask.levelOfAssuranceTooltip': 'The identification mechanism used to identify the involved parties',
      'delegateTask.formulierUri': 'Form URL',
      'delegateTask.formulierUriTooltip': 'The URL to the form definition in Open Forms',
      'delegateTask.formulierData': 'Form data',
      'delegateTask.formulierDataTooltip': 'The data used to pre-fill the form.',
      'delegateTask.formulierDataKey': 'Key',
      'delegateTask.formulierDataValue': 'Value',
      'delegateTask.toelichting': 'Description',
      'delegateTask.toelichtingTooltip': 'Additional explanation or description for the task',
      'delegateTask.koppelingVanToepassing': 'Link applicable',
      'delegateTask.koppelingRegistratie': 'Registration link',
      'delegateTask.koppelingRegistratieTooltip': 'Indicates the type of link; Case or Product.',
      'delegateTask.koppelingIdentifier': 'Link identifier',
      'delegateTask.koppelingIdentifierTooltip': 'The unique identifier of the Case or Product of the link.',
      'delegateTask.verloopdatum': 'Expiration date',
      'delegateTask.verloopdatumTooltip': 'The date and time when the task expires',
      'complete-delegated-task': 'Complete delegated customer task',
      'completeDelegatedTask.bewaarIngediendeGegevens': 'Save submitted data',
      'completeDelegatedTask.ontvangenData': 'Received form data',
      'completeDelegatedTask.ontvangenDataTooltip': 'The data with which the form was completed.',
      'completeDelegatedTask.ontvangenDataKey': 'Path of the value within the received form data',
      'completeDelegatedTask.ontvangenDataValue': 'Output destination',
      'completeDelegatedTask.koppelDocumenten': 'Link documents',
      'completeDelegatedTask.padNaarDocumenten': 'Path to uploaded documents',
      'completeDelegatedTask.padNaarDocumentenTooltip': 'The path to the uploaded documents within the received form data',
      'toggle.ja': 'Yes',
      'toggle.nee': 'No',
    },
    de: {
      title: 'Open Inwoner Platform (OIP) - Kundenaufgabe',
      description: 'Delegieren Sie Aufgaben von Klienten an das Open Resident Platform (OIP)-Portal, damit sie von den Benutzern dieses Portals übernommen werden können.',
      'configuration.title': 'Konfigurationsname',
      'configuration.titleTooltip': 'Der Name der Plugin-Konfiguration. Unter diesem Namen kann die Konfiguration in der gesamten Anwendung gefunden werden.',
      'configuration.notificatiesApiPluginConfiguration': 'Notifications API-Plugin',
      'configuration.notificatiesApiPluginConfigurationTooltip': 'Wählen Sie die Konfiguration des Notifications-API-Plugins aus. Falls die Liste leer ist, muss zunächst eine Konfiguration für das Notifications-API-Plugin erstellt werden.',
      'configuration.objectManagementConfiguration': 'Objektverwaltungskonfiguration',
      'configuration.objectManagementConfigurationTooltip': 'Wählen Sie die gewünschte Objektverwaltungskonfiguration aus. Falls die Liste leer ist, muss zunächst eine Objektverwaltungskonfiguration erstellt werden.',
      'configuration.systemFinalizerProcess': 'System Prozess zur Aufgabenerfüllung',
      'configuration.caseFinalizerProcess': 'Fall-spezifisch Prozess zur Aufgabenerfüllung',
      'configuration.finalizerProcessTooltip': 'Der Prozess, der eine abgeschlossene Aufgabe verarbeitet. Wenn die Liste leer ist, muss zuerst ein Prozess erstellt werden.',
      'delegate-task': 'Kundenaufgabe delegieren',
      'delegateTask.betrokkeneIdentifier': 'Beteiligte Identifikation (BSN)',
      'delegateTask.betrokkeneIdentifierTooltip': 'Die eindeutige Kennung der Person, die die Aufgabe übernehmen soll.',
      'delegateTask.levelOfAssurance': 'Level of Assurance (LOA)',
      'delegateTask.levelOfAssuranceTooltip': 'Der Identifikationsmechanismus, der zur Identifizierung der Beteiligten verwendet wird',
      'delegateTask.formulierUri': 'Formular-URL',
      'delegateTask.formulierUriTooltip': 'Die URL zur Formulardefinition in Open Formulieren',
      'delegateTask.formulierData': 'Formulardaten',
      'delegateTask.formulierDataTooltip': 'Die Daten, mit denen das Formular vorab ausgefüllt wird.',
      'delegateTask.formulierDataKey': 'Schlüssel',
      'delegateTask.formulierDataValue': 'Wert',
      'delegateTask.toelichting': 'Erläuterung',
      'delegateTask.toelichtingTooltip': 'Zusätzliche Erklärung oder Beschreibung für die Aufgabe',
      'delegateTask.koppelingVanToepassing': 'Verknüpfung anwendbar',
      'delegateTask.koppelingRegistratie': 'Registrierungsverknüpfung',
      'delegateTask.koppelingRegistratieTooltip': 'Gibt die Art der Verknüpfung an; Fall oder Produkt.',
      'delegateTask.koppelingIdentifier': 'Verknüpfungskennung',
      'delegateTask.koppelingIdentifierTooltip': 'Die eindeutige Kennung des Falls oder Produkts der Verknüpfung.',
      'delegateTask.verloopdatum': 'Ablaufdatum',
      'delegateTask.verloopdatumTooltip': 'Das Datum und die Uhrzeit, zu der die Aufgabe abläuft',
      'complete-delegated-task': 'Abgeschlossene Kundenaufgabe verarbeiten',
      'completeDelegatedTask.bewaarIngediendeGegevens': 'Eingereichte Daten speichern',
      'completeDelegatedTask.ontvangenData': 'Empfangene Formulardaten',
      'completeDelegatedTask.ontvangenDataTooltip': 'Die Daten, mit denen das Formular abgeschlossen wurde.',
      'completeDelegatedTask.ontvangenDataKey': 'Pfad des Wertes innerhalb der empfangenen Formulardaten',
      'completeDelegatedTask.ontvangenDataValue': 'Ausgabeziel',
      'completeDelegatedTask.koppelDocumenten': 'Dokumente verknüpfen',
      'completeDelegatedTask.padNaarDocumenten': 'Pfad zu hochgeladenen Dokumenten',
      'completeDelegatedTask.padNaarDocumentenTooltip': 'Der Pfad zu den hochgeladenen Dokumenten innerhalb der empfangenen Formulardaten',
      'toggle.ja': 'Ja',
      'toggle.nee': 'Nein',
    }
  }
}

export {oipKlanttaakPluginSpecification};
