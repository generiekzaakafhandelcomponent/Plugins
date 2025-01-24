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
import {XentialConfigurationComponent} from './components/xential-configuration/xential-configuration.component';
import {XENTIAL_PLUGIN_LOGO_BASE64} from './assets';
import {
    GenerateDocumentConfigurationComponent
} from "./components/generate-document-configuration/generate-document-configuration.component";
import {
    PrepareContentConfigurationComponent
} from "./components/prepare-content-configuration/prepare-content-configuration.component";

const XentialPluginSpecification: PluginSpecification = {
    pluginId: 'xential',
    pluginConfigurationComponent: XentialConfigurationComponent,
    pluginLogoBase64: XENTIAL_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'generate-document': GenerateDocumentConfigurationComponent,
        'prepare-content': PrepareContentConfigurationComponent
    },
    pluginTranslations: {
        nl: {
            title: 'Xential',
            description: 'Met de Xential plugin worden documenten gegenereerd',
            contentProcessVariable: 'Document content process variable',
            eventMessageName: 'bpmn event naam als document is ontvangen',
            verzendAdresData: 'geadresseerde data',
            colofonData: 'colofon data',
            documentDetailsData: 'Document details data',
            configurationTitle: 'Configuratie naam',
            clientId: 'Taak applicatie naam',
            clientPassword: 'Taak applicatie wachtwoord',
            'generate-document': 'Genereer document',
            'prepare-content': 'Genereren document content',
            templateId: 'Template ID',
            fileFormat: 'Bestandsformaat',
            documentId: 'Document kenmerk',
            templateData: 'Sjabloon vuldata',
            applicationName: 'Xential Taakapplicatie naam',
            applicationPassword: 'Xential Taakapplicatie wachtwoord',
            baseUrl: 'Base url naar Xential via ESB',
            serverCertificate: 'Server certificaat als Base64 encoded string',
            clientPrivateKey: 'Client private key als Base64 encoded string',
            clientCertificate: 'Client certificaat als Base64 encoded string',
            xentialContentId: 'document content proces variabele'
        },
        en: {
            title: 'Xential',
            description: 'With the Xential plugin documents are generated',
            contentProcessVariable: 'Document content process variable',
            eventMessageName: 'bpmn event name when document arrives',
            verzendAdresData: 'addressee data',
            colofonData: 'colophon data',
            documentDetailsData: 'Document details data',
            configurationTitle: 'Configuration name',
            clientId: 'Client ID',
            clientPassword: 'Client password',
            'generate-document': 'Generate document',
            'prepare-content': 'Generate document content',
            templateId: 'Sjabloon ID',
            fileFormat: 'File format',
            documentId: 'Document ID',
            templateData: 'Template data',
            applicationName: 'Xential Taakapplicatie name',
            applicationPassword: 'Xential Taakapplicatie password',
            baseUrl: 'Base url to ESB Xential',
            serverCertificate: 'Server certificate as Base64 encoded string',
            clientPrivateKey: 'Client private key as Base64 encoded string',
            clientCertificate: 'Client certificate as Base64 encoded string',
            xentialContentId: 'document content process variable'
        },
        de: {
            title: 'Xential',
            description: 'Con il plugin Xential vengono generati i documenti',
            configurationTitle: 'Konfigurationsname',
            clientId: 'Kunden-ID',
            clientPassword: 'Kundenpasswort',
            'generate-document': 'Dokument generieren',
            templateId: 'Vorlage ID',
            fileFormat: 'Dateiformat',
            documentId: 'Dokument-ID',
            templateData: 'Vorlagendaten',
            applicationName: 'Xential Taakapplicatie Name',
            applicationPassword: 'Xential Taakapplicatie Passwort',
            baseUrl: 'Base url nach Xential via ESB',
            serverCertificate: 'Server Zertifikat als Base64 kodierter String',
            clientPrivateKey: 'Client private key als Base64 kodierter String',
            clientCertificate: 'Client Zertifikat als Base64 kodierter String',
            xentialContentId: 'Dokumentinhalt verarbeitet Variablen'
        },
    },
};

export {XentialPluginSpecification};
