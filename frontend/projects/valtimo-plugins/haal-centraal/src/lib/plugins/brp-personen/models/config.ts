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

import {PluginConfigurationData} from '@valtimo/plugin';

interface BrpPersonenConfig extends PluginConfigurationData {
    brpPersonenBaseUrl: string;
    authenticationPluginConfiguration: string;
}

/*
 * All values except `fields` are strings, so they can also contain a value resolver such as `doc:/bsn` or `pv:bsn`.
 */
interface BrpPersonenBaseActionConfig {
    fields: Array<string>;
    resultProcessVariableName: string;
}

interface RaadpleegMetBsnConfig extends BrpPersonenBaseActionConfig {
    burgerservicenummer: string;
    gemeenteVanInschrijving?: string;
}

interface ZoekMetGeslachtsnaamEnGeboortedatumConfig extends BrpPersonenBaseActionConfig {
    geslachtsnaam: string;
    geboortedatum: string;
    geslacht?: string;
    voorvoegsel?: string;
    voornamen?: string;
    inclusiefOverledenPersonen?: string;
    gemeenteVanInschrijving?: string;
}

interface ZoekMetNaamEnGemeenteConfig extends BrpPersonenBaseActionConfig {
    geslachtsnaam: string;
    voornamen: string;
    gemeenteVanInschrijving: string;
    geslacht?: string;
    voorvoegsel?: string;
    inclusiefOverledenPersonen?: string;
}

interface ZoekMetPostcodeEnHuisnummerConfig extends BrpPersonenBaseActionConfig {
    postcode: string;
    huisnummer: string;
    huisletter?: string;
    huisnummertoevoeging?: string;
    geboortedatum?: string;
    geslachtsnaam?: string;
    inclusiefOverledenPersonen?: string;
    gemeenteVanInschrijving?: string;
}

interface ZoekMetStraatHuisnummerEnGemeenteConfig extends BrpPersonenBaseActionConfig {
    straat: string;
    huisnummer: string;
    gemeenteVanInschrijving: string;
    huisletter?: string;
    huisnummertoevoeging?: string;
    inclusiefOverledenPersonen?: string;
}

interface ZoekMetNummeraanduidingConfig extends BrpPersonenBaseActionConfig {
    nummeraanduidingIdentificatie: string;
    inclusiefOverledenPersonen?: string;
    gemeenteVanInschrijving?: string;
}

interface ZoekMetAdresseerbaarObjectConfig extends BrpPersonenBaseActionConfig {
    adresseerbaarObjectIdentificatie: string;
    inclusiefOverledenPersonen?: string;
    gemeenteVanInschrijving?: string;
}

export {
    BrpPersonenConfig,
    BrpPersonenBaseActionConfig,
    RaadpleegMetBsnConfig,
    ZoekMetGeslachtsnaamEnGeboortedatumConfig,
    ZoekMetNaamEnGemeenteConfig,
    ZoekMetPostcodeEnHuisnummerConfig,
    ZoekMetStraatHuisnummerEnGemeenteConfig,
    ZoekMetNummeraanduidingConfig,
    ZoekMetAdresseerbaarObjectConfig,
};
