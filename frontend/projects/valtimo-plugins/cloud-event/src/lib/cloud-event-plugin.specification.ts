/*
 * Copyright 2026 Ritense BV, the Netherlands.
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
import { CloudEventConfigurationComponent } from "./components/cloud-event-configuration/cloud-event-configuration.component";
import { PublishCloudEventConfigurationComponent } from "./components/publish-cloud-event/publish-cloud-event-configuration.component";
import { ReceiveCloudEventConfigurationComponent } from "./components/receive-cloud-event/receive-cloud-event-configuration.component";
import { CLOUD_EVENT_PLUGIN_LOGO_BASE64 } from "./assets";

const cloudEventPluginSpecification: PluginSpecification = {
  pluginId: "cloud-event",
  pluginConfigurationComponent: CloudEventConfigurationComponent,
  pluginLogoBase64: CLOUD_EVENT_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    "publish-cloud-event": PublishCloudEventConfigurationComponent,
    "receive-cloud-event": ReceiveCloudEventConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      title: "Cloud Event",
      description: "Verstuur en ontvang CloudEvents via RabbitMQ.",
      configurationTitle: "Configuratienaam",
      configurationTitleTooltip:
        "De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.",
      "publish-cloud-event": "Cloud Event publiceren",
      "receive-cloud-event": "Cloud Event ontvangen",
      eventType: "Event type",
      eventTypeTooltip: "Het type van het CloudEvent (bijv. com.example.order.created). Ondersteunt value resolvers.",
      resultType: "Resultaat type",
      resultTypeTooltip: "Optioneel type classificatie voor het resultaat. Ondersteunt value resolvers.",
      resultId: "Resultaat ID",
      resultIdTooltip: "Optionele identificatie van het resultaat. Ondersteunt value resolvers.",
      data: "Data",
      dataTooltip: "Optionele JSON data payload voor het CloudEvent. Ondersteunt value resolvers.",
      receiveEventTypeTooltip: "Optioneel filter op het CloudEvent type. Laat leeg om alle events te ontvangen.",
    },
    en: {
      title: "Cloud Event",
      description: "Send and receive CloudEvents via RabbitMQ.",
      configurationTitle: "Configuration name",
      configurationTitleTooltip:
        "The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.",
      "publish-cloud-event": "Publish Cloud Event",
      "receive-cloud-event": "Receive Cloud Event",
      eventType: "Event type",
      eventTypeTooltip: "The type of the CloudEvent (e.g. com.example.order.created). Supports value resolvers.",
      resultType: "Result type",
      resultTypeTooltip: "Optional type classification for the result. Supports value resolvers.",
      resultId: "Result ID",
      resultIdTooltip: "Optional identifier of the result. Supports value resolvers.",
      data: "Data",
      dataTooltip: "Optional JSON data payload for the CloudEvent. Supports value resolvers.",
      receiveEventTypeTooltip: "Optional filter on CloudEvent type. Leave empty to receive all events.",
    },
  },
};

export { cloudEventPluginSpecification };
