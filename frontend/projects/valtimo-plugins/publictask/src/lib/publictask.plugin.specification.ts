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
      description: "Laat iemand zonder Valtimo-account een usertask invullen via een link",
      baseUrl: "URL van deze omgeving",
      baseUrlTooltip: "Waarmee elke link naar een publieke taak begint: het adres waarop deze omgeving voor de ontvanger bereikbaar is, inclusief https://. Leeg betekent dat de instelling van de omgeving zelf (valtimo.url of valtimo.app.hostname) wordt gebruikt; is die er ook niet, dan kan er geen link worden aangemaakt.",
      baseUrlPlaceholder: "https://mijn-omgeving.example.com",
      pvAssigneeCandidateContactData: "de process variable waarin de assignee Candidate wordt bewaard. Start met pv:",
      timeToLive: "Time To Live voor de URL. Default is 28 dagen",
      maxAttachments: "Maximum aantal bijlagen",
      maxAttachmentsTooltip: "Hoeveel bestanden er via deze publieke taak geüpload mogen worden. Leeg betekent 10. Een verwijderd bestand geeft zijn plaats niet terug; kies dus ruim genoeg voor iemand die het verkeerde bestand kiest en het opnieuw doet.",
      maxAttachmentSizeInBytes: "Maximale bestandsgrootte (bytes)",
      maxAttachmentSizeInBytesTooltip: "Hoe groot één bestand mag zijn. Leeg betekent 10485760 (10 MB). De applicatie ontvangt nooit meer dan spring.servlet.multipart.max-file-size, hoeveel hier ook staat.",
      acceptedMimeTypes: "Toegestane bestandstypen",
      acceptedMimeTypesTooltip: "Kommagescheiden mimetypes. Leeg betekent dat alleen valtimo.upload.accepted-mime-types en het bestandspatroon van het uploadveld nog beperken. Het type wordt aan de inhoud van het bestand bepaald, niet aan de naam.",
      acceptedMimeTypesPlaceholder: "application/pdf,image/jpeg",
      documentMetadata: "Metadata van bijlagen",
      documentMetadataTooltip: "Waarmee elke bijlage van deze publieke taak wordt vastgelegd, voor wat het bestand daarna oppakt. Voor de Documenten API zijn informatieobjecttype en titel nodig; die kan die API niet zelf invullen. De waarde kan een vaste tekst zijn of een verwijzing naar zaakgegevens of een procesvariabele, bijvoorbeeld doc:aanvraag.onderwerp of pv:informatieobjecttypeUrl. Sleutels die de plugin zelf zet (filename, contentType, user, documentId) worden genegeerd.",
      documentMetadataKey: "Sleutel",
      documentMetadataValue: "Waarde",
      documentMetadataAddRow: "Metadata toevoegen"
    },
    en: {
      title: "public-task",
      configurationTitle: "The name of the plugin",
      description: "Lets someone without a Valtimo account fill in a user task via a link",
      baseUrl: "URL of this environment",
      baseUrlTooltip: "What every link to a public task starts with: the address this environment is reachable at for the person receiving it, including https://. Empty means the environment's own setting (valtimo.url or valtimo.app.hostname) is used; without either, no link can be created.",
      baseUrlPlaceholder: "https://my-app.example.com",
      pvAssigneeCandidateContactData: "the process variable in which the assignee Candidate is saved. Start with pv:",
      timeToLive: "Time To Live of the URL. Default is 28 days",
      maxAttachments: "Maximum number of attachments",
      maxAttachmentsTooltip: "How many files may be uploaded through this public task. Empty means 10. A file that is removed does not give its place back, so leave room for an applicant who picks the wrong file and does it again.",
      maxAttachmentSizeInBytes: "Maximum file size (bytes)",
      maxAttachmentSizeInBytesTooltip: "How large a single file may be. Empty means 10485760 (10 MB). The application never receives more than its spring.servlet.multipart.max-file-size, whatever is entered here.",
      acceptedMimeTypes: "Accepted file types",
      acceptedMimeTypesTooltip: "Comma separated mime types. Empty leaves it to valtimo.upload.accepted-mime-types and to the file pattern of the upload field. The type is taken from the content of the file, not from its name.",
      acceptedMimeTypesPlaceholder: "application/pdf,image/jpeg",
      documentMetadata: "Attachment metadata",
      documentMetadataTooltip: "What every attachment of this public task is filed with, for whatever picks the file up. The Documenten API needs an informatieobjecttype and a titel, which it cannot default. A value is either fixed text or a reference to case data or a process variable, for example doc:aanvraag.onderwerp or pv:informatieobjecttypeUrl. Keys the plugin sets itself (filename, contentType, user, documentId) are ignored.",
      documentMetadataKey: "Key",
      documentMetadataValue: "Value",
      documentMetadataAddRow: "Add metadata"
    },
    de: {
      title: "public-task",
      configurationTitle: "Der Name des Plugins",
      description: "Lässt jemanden ohne Valtimo-Konto eine Benutzeraufgabe über einen Link ausfüllen",
      baseUrl: "URL dieser Umgebung",
      baseUrlTooltip: "Womit jeder Link zu einer öffentlichen Aufgabe beginnt: die Adresse, unter der diese Umgebung für den Empfänger erreichbar ist, einschließlich https://. Leer bedeutet, dass die Einstellung der Umgebung selbst (valtimo.url oder valtimo.app.hostname) verwendet wird; fehlt auch diese, kann kein Link erstellt werden.",
      baseUrlPlaceholder: "https://meine-umgebung.example.com",
      pvAssigneeCandidateContactData: "Die Prozessvariable, in der der assignee Candidate gespeichert wird. Start mit pv: ",
      timeToLive: "Time To Live fur der URL. Standardmäßig sind es 28 Tage",
      maxAttachments: "Maximale Anzahl an Anhängen",
      maxAttachmentsTooltip: "Wie viele Dateien über diese öffentliche Aufgabe hochgeladen werden dürfen. Leer bedeutet 10. Eine entfernte Datei gibt ihren Platz nicht zurück, also genug Raum lassen für jemanden, der die falsche Datei wählt und es noch einmal versucht.",
      maxAttachmentSizeInBytes: "Maximale Dateigröße (Bytes)",
      maxAttachmentSizeInBytesTooltip: "Wie groß eine einzelne Datei sein darf. Leer bedeutet 10485760 (10 MB). Die Anwendung empfängt nie mehr als ihr spring.servlet.multipart.max-file-size, was hier auch eingetragen ist.",
      acceptedMimeTypes: "Zugelassene Dateitypen",
      acceptedMimeTypesTooltip: "Kommagetrennte MIME-Typen. Leer überlässt es valtimo.upload.accepted-mime-types und dem Dateimuster des Upload-Feldes. Der Typ wird aus dem Inhalt der Datei bestimmt, nicht aus ihrem Namen.",
      acceptedMimeTypesPlaceholder: "application/pdf,image/jpeg",
      documentMetadata: "Metadaten der Anhänge",
      documentMetadataTooltip: "Womit jeder Anhang dieser öffentlichen Aufgabe abgelegt wird, für das, was die Datei danach übernimmt. Die Documenten API benötigt einen informatieobjecttype und einen titel, die sie nicht selbst setzen kann. Ein Wert ist entweder fester Text oder ein Verweis auf Fallakten oder eine Prozessvariable, zum Beispiel doc:aanvraag.onderwerp oder pv:informatieobjecttypeUrl. Schlüssel, die das Plugin selbst setzt (filename, contentType, user, documentId), werden ignoriert.",
      documentMetadataKey: "Schlüssel",
      documentMetadataValue: "Wert",
      documentMetadataAddRow: "Metadaten hinzufügen"
    }
  },
};

export {publictaskPluginSpecification};
