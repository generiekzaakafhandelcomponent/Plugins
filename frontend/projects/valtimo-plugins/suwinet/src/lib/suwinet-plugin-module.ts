/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';

import {FormsModule} from '@angular/forms';
import {FormModule, InputModule, ParagraphModule} from '@valtimo/components';
import {SuwinetPluginConfigurationComponent} from './components/plugin-configuration/suwinet-plugin-configuration.component';
import {BrpPersoonInfoComponent} from './components/brp-persoon-info/brp-persoon-info.component';
import {BrpPartnerInfoComponent} from './components/brp-partner-info/brp-partner-info.component';
import {BrpKinderenInfoComponent} from './components/brp-kinderen-info/brp-kinderen-info.component';
import {RdwVoertuigenComponent} from './components/rdw-voertuigen/rdw-voertuigen.component';
import {DuoPersoonsInfoComponent} from "./components/duo-persoons-info/duo-persoons-info.component";
import {DuoStudiefinancieringComponent} from "./components/duo-studiefinanciering/duo-studiefinanciering.component";
import {SvbPersoonsInfoComponent} from "./components/svb-persoons-info/svb-persoons-info.component";
import {UwvInkomstenInfoComponent} from "./components/uwv-inkomsten-persoon-info/uwv-inkomsten-info.component";
import {KadastraleObjectenComponent} from "./components/kadasterobjecten/kadastrale-objecten.component";

@NgModule({
    declarations: [
        SuwinetPluginConfigurationComponent,
        BrpPersoonInfoComponent,
        BrpPartnerInfoComponent,
        BrpKinderenInfoComponent,
        DuoPersoonsInfoComponent,
        DuoStudiefinancieringComponent,
        KadastraleObjectenComponent,
        RdwVoertuigenComponent,
        SvbPersoonsInfoComponent,
        UwvInkomstenInfoComponent
    ],
    imports: [CommonModule, PluginTranslatePipeModule, FormModule, InputModule, FormsModule, PluginTranslatePipeModule, FormModule, FormModule, FormModule, FormModule, ParagraphModule],
    exports: [
        SuwinetPluginConfigurationComponent,
        BrpPersoonInfoComponent,
        BrpPartnerInfoComponent,
        BrpKinderenInfoComponent,
        DuoPersoonsInfoComponent,
        DuoStudiefinancieringComponent,
        KadastraleObjectenComponent,
        RdwVoertuigenComponent,
        SvbPersoonsInfoComponent,
        UwvInkomstenInfoComponent
    ],
})
export class SuwinetPluginModule {
}
