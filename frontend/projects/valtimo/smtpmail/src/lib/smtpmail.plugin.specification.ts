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
import {SmtpMailPluginConfigurationComponent} from './components/smtp-mail-configuration/smtpmail-plugin-configuration.component';
import {SMTP_MAIL_PLUGIN_LOGO_BASE64} from './assets';
import {SendMailConfigurationComponent} from "./components/send-mail/send-mail-configuration.component";

const smtpmailPluginSpecification: PluginSpecification = {
  pluginId: 'smtp-mail',
  pluginConfigurationComponent: SmtpMailPluginConfigurationComponent,
  pluginLogoBase64: SMTP_MAIL_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'send-mail': SendMailConfigurationComponent
  },
  pluginTranslations: {
    nl: {
      title: "smtp-mail",
      description: "Met deze plugin kan een e-mail via SMTP worden verzonden. De plugin haalt zijn e-mailinhoud en bijlagen op uit de Documenten API en werkt met proceskoppelingen",
      host: "host",
      username: "gebruikersnaam",
      password: "wachtwoord",
      protocol: "protocol",
      auth: "authenticatie",
      debug: "debug",
      startTlsEnable: "startTls inschakelen",
      sender: "afzender",
      recipients: "ontvanger",
      cc: "cc",
      bcc: "bcc",
      subject: "onderwerp",
      attachments: "bijlagen",
      content: "inhoud"
    },
    en: {
      title: "smtp-mail",
      description: "This plugin allows sending an email via SMTP. The plugin retrieves its email content and attachments from the Documenten API and works with process links.",
      host: "host",
      username: "username",
      password: "password",
      protocol: "protocol",
      auth: "auth",
      debug: "debug",
      startTlsEnable: "startTlsEnable",
      sender: "sender",
      recipients: "recipient",
      cc: "cc",
      bcc: "bcc",
      subject: "subject",
      attachments: "attachments",
      content: "content"
    },
    de: {
      title: "smtp-mail",
      description: "Mit diesem Plugin kann eine E-Mail über SMTP gesendet werden. Das Plugin bezieht seinen E-Mail-Inhalt und die Anhänge aus der Dokumenten-API und funktioniert mit Prozessverknüpfungen.",
      host: "Host",
      username: "Benutzername",
      password: "Passwort",
      protocol: "Protokoll",
      auth: "Authentifizierung",
      debug: "Debug",
      startTlsEnable: "StartTLS aktivieren",
      sender: "Absender",
      recipients: "Empfänger",
      cc: "CC",
      bcc: "BCC",
      subject: "Betreff",
      attachments: "Anhänge",
      content: "Inhalt"
    },
  },
};

export {smtpmailPluginSpecification};
