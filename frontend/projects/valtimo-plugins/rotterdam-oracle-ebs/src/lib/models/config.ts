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
    boekjaar?: string;
    boekperiode?: string;
    regels?: Array<JournaalpostRegel>;
    regelsViaResolver?: string;
}

interface JournaalpostRegel {
    grootboekSleutel: string;
    boekingType: string;
    bedrag: string;
    omschrijving?: string;
}

interface VerkoopfactuurOpvoerenConfig {
    pvResultVariable: string;
    procesCode: string;
    referentieNummer: string;
    factuurKlasse: string;
    inkoopOrderReferentie: string;
    natuurlijkPersoon: NatuurlijkPersoon;
    nietNatuurlijkPersoon: NietNatuurlijkPersoon;
    regels?: Array<FactuurRegel>;
    regelsViaResolver?: string;
}

interface NatuurlijkPersoon {
    achternaam: string;
    voornamen: string;
}

interface NietNatuurlijkPersoon {
    statutaireNaam: string;
}

interface FactuurRegel {
    hoeveelheid: string;
    tarief: string;
    btwPercentage: string;
    grootboekSleutel: string;
    omschrijving: string;
}

enum FactuurKlasse {
    Creditnota = "Creditnota",
    Debetnota = "Debetnota",
    Correctienota = "Correctienota"
}

enum BoekingType {
    Credit = "Credit",
    Debet = "Debet"
}

enum SaldoSoort {
    Budget = "Budget",
    Reservering = "Reservering",
    Werkelijk = "Werkelijk"
}

export {
    RotterdamEsbConfig,
    JournaalpostOpvoerenConfig,
    JournaalpostRegel,
    VerkoopfactuurOpvoerenConfig,
    NatuurlijkPersoon,
    NietNatuurlijkPersoon,
    FactuurRegel,
    FactuurKlasse,
    BoekingType,
    SaldoSoort
}
