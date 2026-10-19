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
            sender: 'Mail adres afzender',
            senderTooltip: 'Het e-mailadres van de afzender',
            senderPlaceholder: 'noreply@example.com',
            fromName: 'Naam afzender',
            fromNamePlaceholder: 'Naam afzender',
            fromNameTooltip: 'De naam van de afzender',
            recipients: 'Ontvangers',
            recipientsTooltip: 'Eén of meer ontvangers, gescheiden door een komma of een puntkomma',
            cc: 'CC',
            ccTooltip: 'Eén of meer CC-ontvangers, gescheiden door een komma of een puntkomma',
            bcc: 'BCC',
            bccTooltip: 'Eén of meer BCC-ontvangers, gescheiden door een komma of een puntkomma',
            subject: 'Onderwerp',
            subjectPlaceholder: 'Aanmaning',
            subjectTooltip: 'Het onderwerp van de e-mail',
            attachments: 'Bijlagen',
            attachmentIdsTooltip: 'Een lijst met de bestands-ID\'s van de bijlagen',
            content: 'Tekst van de e-mail',
            contentTooltip: 'Vul hier de tekst van de e-mail zelf in. Meestal is dat pv:mailContent: de tekst die een eerdere stap met de actie \'Generate Mail Content\' heeft gemaakt. U kunt ook zelf een vaste tekst typen.',
            contentInputType: 'Waar komt de tekst van de e-mail vandaan?',
            contentInputTypeTooltip: 'Kies \'Uit een gemaakt e-mailbestand\' als een eerdere stap de e-mail met de actie \'Generate Mail File\' heeft klaargezet. Kies \'Uit de tekst zelf\' als een eerdere stap de tekst met \'Generate Mail Content\' heeft gemaakt, bijvoorbeeld zodat een collega de e-mail eerst kan nakijken.',
            contentInputTypeFile: 'Uit een gemaakt e-mailbestand',
            contentInputTypeText: 'Uit de tekst zelf',
            contentId: 'Verwijzing naar het e-mailbestand',
            contentIdTooltip: 'Vul hier niet de tekst van de e-mail in, maar een verwijzing naar het bestand waarin de tekst staat. Meestal is dat pv:contentId: het bestand dat een eerdere stap met de actie \'Generate Mail File\' heeft gemaakt.',
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
            sender: 'sender\'s email address',
            senderTooltip: 'The email address of the sender',
            senderPlaceholder: 'noreply@example.com',
            fromName: 'Sender name',
            fromNamePlaceholder: 'Sender name',
            fromNameTooltip: 'the name of the sender',
            recipients: 'Recipient',
            recipientsTooltip: 'One or more recipients, separated by a comma or a semicolon',
            cc: 'CC',
            ccTooltip: 'One or more cc recipients, separated by a comma or a semicolon',
            bcc: 'BCC',
            bccTooltip: 'One or more bcc recipients, separated by a comma or a semicolon',
            subject: 'Subject',
            subjectPlaceholder: 'Reminder',
            subjectTooltip: 'The subject of the mail',
            attachments: 'Attachments',
            attachmentIdsTooltip: 'A list containing the file ID\'s of attachments',
            content: 'Text of the mail',
            contentTooltip: 'Fill in the text of the mail itself. Usually this is pv:mailContent: the text that an earlier step made with the \'Generate Mail Content\' action. You can also type a fixed text yourself.',
            contentInputType: 'Where does the text of the mail come from?',
            contentInputTypeTooltip: 'Choose \'From a prepared mail file\' when an earlier step prepared the mail with the \'Generate Mail File\' action. Choose \'From the text itself\' when an earlier step made the text with \'Generate Mail Content\', for example so a colleague can check the mail first.',
            contentInputTypeFile: 'From a prepared mail file',
            contentInputTypeText: 'From the text itself',
            contentId: 'Reference to the mail file',
            contentIdTooltip: 'Do not fill in the text of the mail here, but a reference to the file that holds the text. Usually this is pv:contentId: the file that an earlier step made with the \'Generate Mail File\' action.',
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
            sender: 'E-Mail-Adresse des Absenders',
            senderTooltip: 'Die E-Mail-Adresse des Absenders',
            senderPlaceholder: 'noreply@example.com',
            fromName: 'Absendername',
            fromNamePlaceholder: 'Absendername',
            fromNameTooltip: 'Der Name des Absenders',
            recipients: 'Empfänger',
            recipientsTooltip: 'Ein oder mehrere Empfänger, getrennt durch ein Komma oder ein Semikolon',
            cc: 'CC',
            ccTooltip: 'Ein oder mehrere CC-Empfänger, getrennt durch ein Komma oder ein Semikolon',
            bcc: 'BCC',
            bccTooltip: 'Ein oder mehrere BCC-Empfänger, getrennt durch ein Komma oder ein Semikolon',
            subject: 'Betreff',
            subjectPlaceholder: 'Erinnerung',
            subjectTooltip: 'Der Betreff der E-Mail',
            attachments: 'Anhänge',
            attachmentIdsTooltip: 'Eine Liste, die die Datei-IDs der Anhänge enthält',
            content: 'Text der E-Mail',
            contentTooltip: 'Tragen Sie hier den Text der E-Mail selbst ein. Meist ist das pv:mailContent: der Text, den ein früherer Schritt mit der Aktion \'Generate Mail Content\' erstellt hat. Sie können auch selbst einen festen Text eingeben.',
            contentInputType: 'Woher kommt der Text der E-Mail?',
            contentInputTypeTooltip: 'Wählen Sie \'Aus einer vorbereiteten E-Mail-Datei\', wenn ein früherer Schritt die E-Mail mit der Aktion \'Generate Mail File\' vorbereitet hat. Wählen Sie \'Aus dem Text selbst\', wenn ein früherer Schritt den Text mit \'Generate Mail Content\' erstellt hat, zum Beispiel damit ein Kollege die E-Mail zuerst prüfen kann.',
            contentInputTypeFile: 'Aus einer vorbereiteten E-Mail-Datei',
            contentInputTypeText: 'Aus dem Text selbst',
            contentId: 'Verweis auf die E-Mail-Datei',
            contentIdTooltip: 'Tragen Sie hier nicht den Text der E-Mail ein, sondern einen Verweis auf die Datei, in der der Text steht. Meist ist das pv:contentId: die Datei, die ein früherer Schritt mit der Aktion \'Generate Mail File\' erstellt hat.',
        },
    },
};

export {smtpmailPluginSpecification};
