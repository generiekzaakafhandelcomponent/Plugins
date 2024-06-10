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
import {SPOTLER_PLUGIN_LOGO_BASE64} from './assets';
import {
  SpotlerPluginConfigurationComponent
} from "./components/plugin-configuration/spotler-plugin-configuration.component";
import {
  SendMailActionConfigurationComponent
} from "./components/send-mail-configuration/send-mail-action-configuration.component";

const spotlerPluginSpecification: PluginSpecification = {
  pluginId: 'spotler',
  pluginConfigurationComponent: SpotlerPluginConfigurationComponent,
  pluginLogoBase64: SPOTLER_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    sendMail: SendMailActionConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: 'Spotler',
      description:
          'Met de Spotler plugin kun je in een process emails versturen',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Onder deze naam zal de plugin te herkennen zijn in de rest van de applicatie',
      clientId: 'Client ID',
      clientIdTooltip:
          'Vul hier het uw Spotler clientId in',
      accountId: 'Account ID',
      accountIdTooltip: 'Het ID van uw Spotler account',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Vul de secret in die hoort bij de clientId hierboven',
      toAddress: "Email verzend adres",
      toName: "Naam van ontvanger",
      senderEmail: "Email van afzender",
      senderName: "Naam van afzender",
      emailSubject: "Onderwerp",
      mailTemplateIdentifier: "Spotler Email template ID",
      mailTemplateIdentifierTooltip: "Vul hier de template identifier van uw Spotler email template in",
      recipients: "Ontvangers",
      addRecipient: "Voeg nieuwe ontvanger toe",
      emailType: "Ontvanger type",
      sendMail: "Email verzenden",
      placeholders: "Placeholders",
      addPlaceholder: "Voeg een nieuwe variabele toe",
      placeholderKey: "Variabele",
      placeholderKeyTooltip: "Vul een variabele in die in de Spotler email template staat geconfigureerd.",
      placeholderValue: "Waarde",
      placeholderValueTooltip: "De waarde die in de email ingevuld word. Start met pv: om een process waarde te gebruiken"
    },
    en: {
      title: 'Spotler',
      description:
          'Spotler allows you to send emails from within a process',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Under this name, the plugin will be recognizable in the rest of the application',
      clientId: 'Client ID',
      clientIdTooltip:
          'Enter your Spotler clientId here',
      accountId: 'Account ID',
      accountIdTooltip: 'Fill in the ID of your Spotler account',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Enter the secret associated with the clientId above',
      toAddress: "Email To address",
      toName: "Name of recipient",
      senderEmail: "Sender's email address",
      senderName: "Sender's name",
      emailSubject: "Subject",
      mailTemplateIdentifier: "Spotler Email template ID",
      mailTemplateIdentifierTooltip: "Enter the template identifier of your Spotler email template",
      recipients: "Recipients",
      addRecipient: "Add new recipient",
      emailType: "Recipient type",
      sendMail: "Send an Email",
      placeholders: "Placeholders",
      addPlaceholder: "Add a new placeholder",
      placeholderKey: "Key",
      placeholderKeyTooltip: "Fill in a placeholder name that was referenced in the Spotler email template",
      placeholderValue: "Value",
      placeholderValueTooltip: "The value that will replace the placeholder. Start with pv: to retrieve a process variable"
    },
    de: {
      title: 'Spotler',
      description:
          'Spotler ermöglicht das versenden von E-Mails aus einem prozess heraus',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
          'Unter diesem Namen wird das Plugin im Rest der Anwendung erkennbar sein',
      clientId: 'Client ID',
      clientIdTooltip:
          'Geben Sie hier Ihre Spotler-Client-ID ein',
      accountId: 'Konto-ID',
      accountIdTooltip: 'Geben Sie die ID Ihres Spotler-Kontos ein',
      clientSecret: 'Secret',
      clientSecretTooltip: 'Geben Sie das mit der obigen clientId verknüpfte Geheimnis ein',
      toAddress: "E-Mail-Adresse",
      toName: "Name des Empfängers",
      senderEmail: "E-Mail-Adresse des Absender",
      senderName: "Name des Absender",
      emailSubject: "E-Mail Betreff",
      mailTemplateIdentifier: "Spotler E-Mail-Vorlagen-ID",
      mailTemplateIdentifierTooltip: "Geben Sie die Vorlagenkennung Ihrer Spotler-E-Mail-Vorlage ein",
      recipients: "Empfänger",
      addRecipient: "Neuen Empfänger hinzufügen",
      emailType: "Empfängertyp",
      sendMail: "E-Mail senden",
      placeholders: "Platzhalter",
      addPlaceholder: "Fügen Sie einen neuen Platzhalter hinzu",
      placeholderKey: "Schlüssel",
      placeholderKeyTooltip: "Geben Sie einen Platzhalternamen ein, auf den in der Spotler-E-Mail-Vorlage verwiesen wurde",
      placeholderValue: "Wert",
      placeholderValueTooltip: "Der Wert, der den Platzhalter ersetzt. Beginnen Sie mit pv:, um eine Prozessvariable abzurufen."
    },
  },
};

export {spotlerPluginSpecification};
