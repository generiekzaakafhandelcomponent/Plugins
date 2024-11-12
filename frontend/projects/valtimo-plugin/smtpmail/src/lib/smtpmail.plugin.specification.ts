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
import {SendMailConfigurationComponent} from './components/send-mail/send-mail-configuration.component';

const smtpmailPluginSpecification: PluginSpecification = {
    pluginId: 'smtp-mail',
    pluginConfigurationComponent: SmtpMailPluginConfigurationComponent,
    pluginLogoBase64: SMTP_MAIL_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'send-mail': SendMailConfigurationComponent
    },
    pluginTranslations: {
        nl: {
            title: 'SMTP Mail',
            'send-mail': 'Send mail',
            description: 'Deze plugin maakt het mogelijk om e-mails te versturen via SMTP. De plugin haalt de inhoud en bijlagen van de e-mail op uit de Documenten-API en werkt met proceslinks.',
            host: 'Host',
            port: 'Poort',
            username: 'Gebruikersnaam',
            password: 'Wachtwoord',
            protocol: 'Protocol',
            auth: 'Authenticatie',
            debug: 'Debug',
            startTlsEnable: 'STARTTLS inschakelen',
            sender: 'Afzender',
            senderTooltip: 'Het e-mailadres van de afzender',
            senderPlaceholder: 'noreply@example.com',
            recipients: 'Ontvangers',
            recipientsTooltip: 'Een lijst met ontvangers',
            cc: 'CC',
            ccTooltip: 'Een lijst met CC\'s',
            bcc: 'BCC',
            bccTooltip: 'Een lijst met BCC\'s',
            subject: 'Onderwerp',
            subjectPlaceholder: 'Aanmaning',
            subjectTooltip: 'Het onderwerp van de e-mail',
            attachments: 'Bijlagen',
            attachmentIdsTooltip: 'Een lijst met de bestands-ID\'s van de bijlagen',
            content: 'Inhoud',
            contentId: 'Inhoud-ID',
            contentIdTooltip: 'De inhoud van deze e-mail. Dit veld verwacht een bestands-ID van een bestand met daarin de HTML-inhoud.',
        },
        en: {
            title: 'SMTP Mail',
            'send-mail': 'E-mail verzenden',
            description: 'This plugin allows sending an email via SMTP. The plugin retrieves its email content and attachments from the Documenten API and works with process links.',
            host: 'Host',
            port: 'Port',
            username: 'Username',
            password: 'Password',
            protocol: 'Protocol',
            auth: 'Auth',
            debug: 'Debug',
            startTlsEnable: 'Enable STARTTLS',
            sender: 'Sender',
            senderTooltip: 'The email address of the sender',
            senderPlaceholder: 'noreply@example.com',
            recipients: 'Recipient',
            recipientsTooltip: 'A list of recipients',
            cc: 'CC',
            ccTooltip: 'A list of cc\'s',
            bcc: 'BCC',
            bccTooltip: 'A list of bcc\'s',
            subject: 'Subject',
            subjectPlaceholder: 'Reminder',
            subjectTooltip: 'The subject of the mail',
            attachments: 'A list containing the file ID\'s of attachments',
            attachmentIdsTooltip: 'Content',
            content: 'Content',
            contentId: 'Content ID',
            contentIdTooltip: 'The content/body of this mail. This field expects a file ID of a file containing the HTML content for this mail.',
        },
        de: {
            title: 'SMTP-Mail',
            'send-mail': 'E-Mail senden',
            description: 'Dieses Plugin ermöglicht das Versenden von E-Mails über SMTP. Das Plugin bezieht seine E-Mail-Inhalte und Anhänge aus der Dokumenten-API und arbeitet mit Prozess-Links.',
            host: 'Host',
            port: 'Port',
            username: 'Benutzername',
            password: 'Passwort',
            protocol: 'Protokoll',
            auth: 'Authentifizierung',
            debug: 'Debug',
            startTlsEnable: 'STARTTLS aktivieren',
            sender: 'Absender',
            senderTooltip: 'Die E-Mail-Adresse des Absenders',
            senderPlaceholder: 'noreply@example.com',
            recipients: 'Empfänger',
            recipientsTooltip: 'Eine Liste der Empfänger',
            cc: 'CC',
            ccTooltip: 'Eine Liste der CCs',
            bcc: 'BCC',
            bccTooltip: 'Eine Liste der BCCs',
            subject: 'Betreff',
            subjectPlaceholder: 'Erinnerung',
            subjectTooltip: 'Der Betreff der E-Mail',
            attachments: 'Anhänge',
            attachmentIdsTooltip: 'Eine Liste, die die Datei-IDs der Anhänge enthält',
            content: 'Inhalt',
            contentId: 'Inhalts-ID',
            contentIdTooltip: 'Der Inhalt/Körper dieser E-Mail. Dieses Feld erwartet eine Datei-ID einer Datei, die den HTML-Inhalt für diese E-Mail enthält.',
        },
    },
};

export {smtpmailPluginSpecification};
