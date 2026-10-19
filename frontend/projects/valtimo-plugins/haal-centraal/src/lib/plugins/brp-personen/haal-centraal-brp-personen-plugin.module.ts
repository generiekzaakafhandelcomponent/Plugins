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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {FormModule, InputModule, ParagraphModule, SelectModule} from '@valtimo/components';
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

const COMPONENTS = [
    BrpPersonenPluginConfigurationComponent,
    BrpPersonenRaadpleegBsnComponent,
    BrpPersonenZoekGeslachtsnaamGeboortedatumComponent,
    BrpPersonenZoekNaamGemeenteComponent,
    BrpPersonenZoekPostcodeHuisnummerComponent,
    BrpPersonenZoekStraatHuisnummerGemeenteComponent,
    BrpPersonenZoekNummeraanduidingComponent,
    BrpPersonenZoekAdresseerbaarObjectComponent
];

@NgModule({
    declarations: COMPONENTS,
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        FormModule,
        InputModule,
        SelectModule,
        ParagraphModule
    ],
    exports: COMPONENTS
})
export class HaalCentraalBrpPersonenPluginModule {
}
