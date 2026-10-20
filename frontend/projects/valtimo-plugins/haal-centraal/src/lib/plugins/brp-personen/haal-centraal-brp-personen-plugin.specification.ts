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
 *
 */

import {PluginSpecification} from '@valtimo/plugin';
import {HAALCENTRAAL_BRP_PERSONEN_PLUGIN_LOGO_BASE64} from './assets';
import {
    BrpPersonenPluginConfigurationComponent
} from './components/brp-personen-plugin-configuration/brp-personen-plugin-configuration.component';
import {BrpPersonenRaadpleegBsnComponent} from './components/brp-personen-raadpleeg-bsn/brp-personen-raadpleeg-bsn.component';
import {BrpPersonenZoekGeslachtsnaamGeboortedatumComponent} from './components/brp-personen-zoek-geslachtsnaam-geboortedatum/brp-personen-zoek-geslachtsnaam-geboortedatum.component';
import {BrpPersonenZoekNaamGemeenteComponent} from './components/brp-personen-zoek-naam-gemeente/brp-personen-zoek-naam-gemeente.component';
import {BrpPersonenZoekPostcodeHuisnummerComponent} from './components/brp-personen-zoek-postcode-huisnummer/brp-personen-zoek-postcode-huisnummer.component';
import {BrpPersonenZoekStraatHuisnummerGemeenteComponent} from './components/brp-personen-zoek-straat-huisnummer-gemeente/brp-personen-zoek-straat-huisnummer-gemeente.component';
import {BrpPersonenZoekNummeraanduidingComponent} from './components/brp-personen-zoek-nummeraanduiding/brp-personen-zoek-nummeraanduiding.component';
import {BrpPersonenZoekAdresseerbaarObjectComponent} from './components/brp-personen-zoek-adresseerbaar-object/brp-personen-zoek-adresseerbaar-object.component';

const haalCentraalBrpPersonenPluginSpecification: PluginSpecification = {
    pluginId: 'haalcentraalbrppersonen',
    pluginConfigurationComponent: BrpPersonenPluginConfigurationComponent,
    pluginLogoBase64: HAALCENTRAAL_BRP_PERSONEN_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'hc-brp-personen-raadpleeg-bsn': BrpPersonenRaadpleegBsnComponent,
        'hc-brp-personen-zoek-geslachtsnaam-geboortedatum': BrpPersonenZoekGeslachtsnaamGeboortedatumComponent,
        'hc-brp-personen-zoek-naam-gemeente': BrpPersonenZoekNaamGemeenteComponent,
        'hc-brp-personen-zoek-postcode-huisnummer': BrpPersonenZoekPostcodeHuisnummerComponent,
        'hc-brp-personen-zoek-straat-huisnummer-gemeente': BrpPersonenZoekStraatHuisnummerGemeenteComponent,
        'hc-brp-personen-zoek-nummeraanduiding': BrpPersonenZoekNummeraanduidingComponent,
        'hc-brp-personen-zoek-adresseerbaar-object': BrpPersonenZoekAdresseerbaarObjectComponent
    },
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip: 'Haal Centraal BRP Personen plugin',
            title: 'Haal Centraal BRP Personen API',
            description: 'API voor het zoeken en raadplegen van actuele gegevens van personen uit de BRP, inclusief kinderen, partners en ouders.',
            brpPersonenBaseUrl: 'Base url naar BRP Personen service',
            authenticationPluginConfiguration: 'Configuratie authenticatie-plug-in',
            'hc-brp-personen-raadpleeg-bsn': 'Raadpleeg personen met burgerservicenummer',
            'hc-brp-personen-zoek-geslachtsnaam-geboortedatum': 'Zoek personen met geslachtsnaam en geboortedatum',
            'hc-brp-personen-zoek-naam-gemeente': 'Zoek personen met naam en gemeente van inschrijving',
            'hc-brp-personen-zoek-postcode-huisnummer': 'Zoek personen met postcode en huisnummer',
            'hc-brp-personen-zoek-straat-huisnummer-gemeente': 'Zoek personen met straat, huisnummer en gemeente van inschrijving',
            'hc-brp-personen-zoek-nummeraanduiding': 'Zoek personen met nummeraanduiding identificatie',
            'hc-brp-personen-zoek-adresseerbaar-object': 'Zoek personen met adresseerbaar object identificatie',
            burgerservicenummer: 'Burgerservicenummer(s)',
            burgerservicenummerTooltip: 'Eén of meer BSN\'s, gescheiden door komma\'s (max. 20)',
            fields: 'Velden',
            fieldsTooltip: 'Selecteer de gewenste velden (max. 130). Een bovenliggend veld, bv. naam, levert alle onderliggende velden.',
            geslachtsnaam: 'Geslachtsnaam',
            geboortedatum: 'Geboortedatum (yyyy-mm-dd)',
            geslacht: 'Geslacht (M/V/O)',
            voorvoegsel: 'Voorvoegsel',
            voornamen: 'Voornamen',
            gemeenteVanInschrijving: 'Gemeente van inschrijving (gemeentecode)',
            postcode: 'Postcode',
            huisnummer: 'Huisnummer',
            huisletter: 'Huisletter',
            huisnummertoevoeging: 'Huisnummertoevoeging',
            straat: 'Straat',
            nummeraanduidingIdentificatie: 'Nummeraanduiding identificatie',
            adresseerbaarObjectIdentificatie: 'Adresseerbaar object identificatie',
            inclusiefOverledenPersonen: 'Inclusief overleden personen (true/false of value resolver)',
            resultProcessVariableName: 'Result proces variabele naam'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'Haal Centraal BRP Personen plugin',
            title: 'Haal Centraal BRP Personen API',
            description: 'API for searching and retrieving current data of persons from the BRP, including children, partners and parents.',
            brpPersonenBaseUrl: 'Base url to BRP Personen service',
            authenticationPluginConfiguration: 'Authentication plugin configuration',
            'hc-brp-personen-raadpleeg-bsn': 'Retrieve persons by citizen service number',
            'hc-brp-personen-zoek-geslachtsnaam-geboortedatum': 'Search persons by surname and date of birth',
            'hc-brp-personen-zoek-naam-gemeente': 'Search persons by name and municipality of registration',
            'hc-brp-personen-zoek-postcode-huisnummer': 'Search persons by postal code and house number',
            'hc-brp-personen-zoek-straat-huisnummer-gemeente': 'Search persons by street, house number and municipality of registration',
            'hc-brp-personen-zoek-nummeraanduiding': 'Search persons by address identification',
            'hc-brp-personen-zoek-adresseerbaar-object': 'Search persons by addressable object identification',
            burgerservicenummer: 'Citizen service number(s)',
            burgerservicenummerTooltip: 'One or more BSNs, comma separated (max. 20)',
            fields: 'Fields',
            fieldsTooltip: 'Select the requested fields (max. 130). A parent field, e.g. naam, returns all of its sub fields.',
            geslachtsnaam: 'Surname',
            geboortedatum: 'Date of birth (yyyy-mm-dd)',
            geslacht: 'Gender (M/V/O)',
            voorvoegsel: 'Prefix',
            voornamen: 'First names',
            gemeenteVanInschrijving: 'Municipality of registration (code)',
            postcode: 'Postal code',
            huisnummer: 'House number',
            huisletter: 'House letter',
            huisnummertoevoeging: 'House number addition',
            straat: 'Street',
            nummeraanduidingIdentificatie: 'Address identification',
            adresseerbaarObjectIdentificatie: 'Addressable object identification',
            inclusiefOverledenPersonen: 'Include deceased persons (true/false or value resolver)',
            resultProcessVariableName: 'Result process variable name'
        }
    }
};

export {haalCentraalBrpPersonenPluginSpecification};
