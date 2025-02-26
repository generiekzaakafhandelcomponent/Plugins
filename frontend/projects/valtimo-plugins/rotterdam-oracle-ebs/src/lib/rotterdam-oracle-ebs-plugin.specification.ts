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

import {PluginSpecification} from '@valtimo/plugin';
import {ROTTERDAM_ORACLE_EBS_PLUGIN_LOGO_BASE64} from './assets';
import {ConfigurationComponent} from "./components/configuration/configuration.component";
import {JournaalpostOpvoerenComponent} from "./components/journaalpost-opvoeren/journaalpost-opvoeren.component";
import {VerkoopfactuurOpvoerenComponent} from "./components/verkoopfactuur-opvoeren/verkoopfactuur-opvoeren.component";

const rotterdamOracleEbsPluginSpecification: PluginSpecification = {
    pluginId: 'rotterdam-oracle-ebs',
    pluginConfigurationComponent: ConfigurationComponent,
    pluginLogoBase64: ROTTERDAM_ORACLE_EBS_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'journaalpost-opvoeren': JournaalpostOpvoerenComponent,
        'verkoopfactuur-opvoeren': VerkoopfactuurOpvoerenComponent,
    },
    pluginTranslations: {
        nl: {
            title: 'Gemeente Rotterdam: Oracle E-Business Suite koppeling',
            description: 'Oracle E-Business Suite plugin voor o.a. het Opvoeren van een Journaalpost',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip: 'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
            baseUrl: 'ESB Url',
            baseUrlTooltip: 'De URL van de Gemeente Rotterdam (Opentunnel) ESB',
            authenticationEnabled: 'Schakel Client Certificate Authenticatie (mTLS) in',
            'toggle.yes': 'Ja',
            'toggle.no': 'Nee',
            certificateConfigurationInfo: 'Na opslaan wordt onderstaande informatie niet meer getoond bij opnieuw openen van het configuratie formulier.',
            serverCertificate: 'Server certificaat',
            serverCertificateTooltip: 'Het certificaat in Base64 formaat',
            clientCertificate: 'Client certificaat',
            clientCertificateTooltip: 'Het certificaat in Base64 formaat',
            clientPrivateKey: 'Private key',
            clientPrivateKeyTooltip: 'De private key in Base64 formaat',
            procesCode: 'Proces code',
            procesCodeTooltip: '',
            referentieNummer: 'Referentienummer',
            referentieNummerTooltip: '',
            sleutel: 'Sleutel',
            sleutelTooltip: '',
            boekdatum: 'Boekdatum',
            boekdatumTooltip: '',
            categorie: 'Categorie',
            categorieTooltip: '',
            saldoSoort: 'Saldosoort',
            saldoSoortTooltip: '',
            omschrijving: 'Omschrijving',
            omschrijvingTooltip: '',
            boekjaar: 'Boekjaar',
            boekjaarTooltip: '',
            boekperiode: 'Boekperiode',
            boekperiodeTooltip: '',
            journaalpostRegels: 'Regels',
            journaalpostRegelsTooltip: '',
            verkoopFactuurRegels: '',
            verkoopFactuurTooltip: '',
            grootboekSleutel: 'Grootboek sleutel',
            boekingType: 'Boekingtype',
            regelOmschrijving: 'Omschrijving',
            bedrag: 'Bedrag',
            regelToevoegen: 'Regel toevoegen',
            regelVerwijderen: 'Regel verwijderen'
        },
        en: {
            title: 'Municipality of Rotterdam: Oracle E-Business Suite connection',
            description: 'Oracle E-Business Suite plugin for, among other things, entering a journal entry',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
            baseUrl: 'ESB Url',
            baseUrlTooltip: 'The URL of the Municipality of Rotterdam (Opentunnel) ESB',
            authenticationEnabled: 'Enable Client Certificate Authenticatie (mTLS)',
            'toggle.yes': 'Yes',
            'toggle.no': 'No',
            certificateConfigurationInfo: 'After saving, the information below will no longer be shown when reopening the configuration form.',
            serverCertificate: 'Server certificate',
            serverCertificateTooltip: 'The certificate in Base64 format',
            clientCertificate: 'Client certificate',
            clientCertificateTooltip: 'The certifcate in Base64 format',
            clientPrivateKey: 'Private key',
            clientPrivateKeyTooltip: 'The private key in Base64 format',
            procesCode: 'Proces code',
            procesCodeTooltip: '',
            grootboekSleutel: 'Grootboek sleuten',
            grootboekSleutelTooltip: '',
            sleutel: 'Journaalpost sleutel',
            sleutelTooltip: '',
            categorie: 'Journaalpost categorie',
            categorieTooltip: ''
        },
        de: {
            title: 'Gemeinde Rotterdam: Oracle E-Business Suite-Anbindung',
            description: 'Oracle E-Business Suite Plugin, u.a. zur Erfassung eines Journaleintrags',
            configurationTitle: 'Konfigurationsname',
            configurationTitleTooltip: 'Der Name der aktuellen Plugin-Konfiguration. Unter diesem Namen ist die Konfiguration im weiteren Verlauf der Anwendung zu finden.',
            baseUrl: 'ESB Url',
            baseUrlTooltip: 'De URL van de Gemeinde Rotterdam (Opentunnel) ESB',
            authenticationEnabled: 'Client-Zertifikatauthentifizierung (mTLS) aktivieren',
            'toggle.yes': 'Ja',
            'toggle.no': 'Nein',
            certificateConfigurationInfo: 'Nach dem Speichern werden die untenstehenden Informationen beim erneuten Öffnen des Konfigurationsformulars nicht mehr angezeigt.',
            serverCertificate: 'Serverzertifikat',
            serverCertificateTooltip: 'Zertifikat im Base64-Format',
            clientCertificate: 'Client-Zertifikat',
            clientCertificateTooltip: 'Zertifikat im Base64-Format',
            clientPrivateKey: 'Privater Schlüssel',
            clientPrivateKeyTooltip: 'Privater Schlüssel im Base64-Format',
            procesCode: 'Proces code',
            procesCodeTooltip: '',
            grootboekSleutel: 'Grootboek sleuten',
            grootboekSleutelTooltip: '',
            sleutel: 'Journaalpost sleutel',
            sleutelTooltip: '',
            categorie: 'Journaalpost categorie',
            categorieTooltip: ''
        },
    },
};

export {rotterdamOracleEbsPluginSpecification};
