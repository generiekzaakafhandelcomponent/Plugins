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

import {PluginConfigurationData} from '@valtimo/plugin';

interface RotterdamEsbConfig extends PluginConfigurationData {
    baseUrl: string;
    mTlsSslContextConfiguration: string
    authenticationEnabled: boolean
}

interface JournaalpostOpvoerenConfig {
    pvResultVariable: string;
    procesCode: string;
    referentieNummer: string;
    sleutel: string;
    boekdatumTijd: string;
    categorie: string;
    saldoSoort: string;
    omschrijving?: string;
    grootboek?: string;
    boekjaar?: string;
    boekperiode?: string;
    regels?: Array<JournaalpostRegel>;
    regelsViaResolver?: string;
}

interface JournaalpostRegel {
    grootboekSleutel: string;
    bronSleutel: string;
    boekingType: string;
    bedrag: string;
    omschrijving?: string;
}

interface VerkoopfactuurOpvoerenConfig {
    pvResultVariable: string;
    procesCode: string;
    referentieNummer: string;
    factuurKlasse: string;
    factuurDatum: string;
    factuurVervaldatum?: string;
    factuurKenmerk?: string;
    factuurAdresType: AdresType;
    factuurAdresLocatie?: AdresLocatie;
    factuurAdresPostbus?: AdresPostbus;
    inkoopOrderReferentie: string;
    relatieType: RelatieType;
    natuurlijkPersoon?: NatuurlijkPersoon;
    nietNatuurlijkPersoon?: NietNatuurlijkPersoon;
    regels?: Array<FactuurRegel>;
    regelsViaResolver?: string;
}

interface Adres {
    naamContactpersoon?: string;
    vestigingsnummerRotterdam?: string;
    postcode: string;
    plaatsnaam: string;
    landcode: string;
}

interface AdresLocatie extends Adres {
    straatnaam: string;
    huisnummer: number;
    huisnummertoevoeging?: string;
}

interface AdresPostbus extends Adres {
    postbus: number;
}

interface NatuurlijkPersoon {
    bsn: string;
    achternaam: string;
    voornamen: string;
}

interface NietNatuurlijkPersoon {
    kvkNummer: string;
    kvkVestigingsnummer: string;
    statutaireNaam: string;
}

interface FactuurRegel {
    hoeveelheid: string;
    tarief: string;
    btwPercentage: string;
    grootboekSleutel: string;
    bronSleutel: string;
    omschrijving: string;
}

enum AdresType {
    LOCATIE = "Locatie",
    POSTBUS = "Postbus"
}

enum RelatieType {
    NATUURLIJK_PERSOON = "Natuurlijk persoon",
    NIET_NATUURLIJK_PERSOON = "Niet natuurlijk persoon"
}

enum FactuurKlasse {
    CREDITNOTA = "Creditnota",
    DEBETNOTA = "Debetnota",
    CORRECTIENOTA = "Correctienota"
}

enum BoekingType {
    CREDIT = "Credit",
    DEBET = "Debet"
}

enum SaldoSoort {
    BUDGET = "Budget",
    RESERVERING = "Reservering",
    WERKELIJK = "Werkelijk"
}

enum Grootboek {
    _100 = "100",
    R10 = "R10"
}

export {
    RotterdamEsbConfig,
    JournaalpostOpvoerenConfig,
    JournaalpostRegel,
    VerkoopfactuurOpvoerenConfig,
    AdresLocatie,
    AdresPostbus,
    NatuurlijkPersoon,
    NietNatuurlijkPersoon,
    FactuurRegel,
    AdresType,
    RelatieType,
    FactuurKlasse,
    BoekingType,
    SaldoSoort,
    Grootboek
}
