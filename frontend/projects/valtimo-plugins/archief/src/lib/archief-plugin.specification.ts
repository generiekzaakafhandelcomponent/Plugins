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

import { PluginSpecification } from "@valtimo/plugin";
import { ArchiefConfigurationComponent } from "./components/archief-configuration/archief-configuration.component";
import { DeleteDocumentConfigurationComponent } from "./components/delete-document/delete-document-configuration.component";
import { ZaakInstanceUrlConfigurationComponent } from "./components/zaak-instance-url/zaak-instance-url-configuration.component";
import { ARCHIEF_PLUGIN_LOGO_BASE64 } from "./assets/archief-plugin-logo";

const archiefPluginSpecification: PluginSpecification = {
  pluginId: "archief",
  pluginConfigurationComponent: ArchiefConfigurationComponent,
  pluginLogoBase64: ARCHIEF_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    "delete-document": DeleteDocumentConfigurationComponent,
    "link-process-to-document": ZaakInstanceUrlConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      title: "Archief",
      description: "De Archief-plugin kan archief-eventnotificaties ontvangen en verwerken van de Notificaties API.",
      configurationTitle: "Configuratienaam",
      configurationTitleTooltip:
        "De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.",
      notificatiesApiPluginConfiguration: "Notificaties API-configuratie",
      notificatiesApiPluginConfigurationTooltip:
        "Configuratie van de Notificaties API die wordt gebruikt om te communiceren tussen GZAC en andere applicaties.",
      processToStart: "Proces",
      processToStartTooltip: "Het proces dat gestart wordt wanneer een notificatie binnenkomt.",
      archiefProperties: "Kanalen",
      archiefPropertiesTooltip: "De kanalen en filters waarop geluisterd wordt voor notificaties.",
      addArchiefProperty: "Kanaal toevoegen",
      kanaal: "Kanaal",
      kanaalTooltip: "De naam van het kanaal waarop geluisterd wordt.",
      filters: "Filters",
      filtersTooltip: "Key-value paren die overeenkomen met de kenmerken van de notificatie.",
      filterKey: "Sleutel",
      filterValue: "Waarde",
      deleteDocumentMessage: "Deze actie verwijdert het document dat gekoppeld is aan het huidige proces. Er is geen verdere configuratie nodig.",
      zaakInstanceUrl: "Zaak instantie URL",
      zaakInstanceUrlTooltip: "De URL van de zaak instantie. Gebruik een process variabele zoals pv:zaakInstanceUrl.",
      "delete-document": "Document verwijderen",
      documentId: "Document ID",
      documentIdTooltip: "Het UUID van het document. Gebruik een procesvariabele zoals pv:documentId.",
      linkProcessToDocumentMessage: "Koppelt het huidige systeemproces aan een document. Vul een zaak instantie URL of een document ID in (minimaal één van beide).",
      "link-process-to-document": "Systeemproces koppelen aan document",
    },
    en: {
      title: "Archief",
      description: "The Archief plugin can receive and handle archief event notifications from the Notificaties API.",
      configurationTitle: "Configuration name",
      configurationTitleTooltip:
        "The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.",
      notificatiesApiPluginConfiguration: "Notificaties API configuration",
      notificatiesApiPluginConfigurationTooltip:
        "Configuration of the Notificaties API used to communicate between GZAC and other applications.",
      processToStart: "Process",
      processToStartTooltip: "The process that is started when a notification is received.",
      archiefProperties: "Channels",
      archiefPropertiesTooltip: "The channels and filters to listen on for notifications.",
      addArchiefProperty: "Add channel",
      kanaal: "Channel",
      kanaalTooltip: "The name of the channel to listen on.",
      filters: "Filters",
      filtersTooltip: "Key-value pairs that match the notification attributes.",
      filterKey: "Key",
      filterValue: "Value",
      deleteDocumentMessage: "This action deletes the document associated with the current process. No further configuration is needed.",
      zaakInstanceUrl: "Zaak instance URL",
      zaakInstanceUrlTooltip: "The URL of the zaak instance. Use a process variable such as pv:zaakInstanceUrl.",
      "delete-document": "Delete document",
      documentId: "Document ID",
      documentIdTooltip: "The UUID of the document. Use a process variable such as pv:documentId.",
      linkProcessToDocumentMessage: "Links the current system process to a document. Provide either a zaak instance URL or a document ID (at least one is required).",
      "link-process-to-document": "Link system process to document",
    },
  },
};

export { archiefPluginSpecification };
