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
 *
 */

import {NgModule} from "@angular/core";
import {
    HaalCentraalBagPluginConfigurationComponent
} from "./components/hc-bag-plugin-configuration/haal-centraal-bag-plugin-configuration.component";
import {CommonModule} from "@angular/common";
import {PluginTranslatePipeModule} from "@valtimo/plugin";
import {FormModule, InputModule, RadioModule, SelectModule} from "@valtimo/components";
import {
    HcBagOphalenAdresseerbaarObjectIdentificatieComponent
} from "./components/hc-bag-ophalen-adresseerbaar-object-identificatie/hc-bag-ophalen-adresseerbaar-object-identificatie.component";

@NgModule({
    declarations: [
        HaalCentraalBagPluginConfigurationComponent,
        HcBagOphalenAdresseerbaarObjectIdentificatieComponent
    ],
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        FormModule,
        InputModule,
        SelectModule,
        RadioModule,
    ],
    exports: [
        HaalCentraalBagPluginConfigurationComponent,
        HcBagOphalenAdresseerbaarObjectIdentificatieComponent
    ]
})
export class HaalCentraalBagPluginModule {
}
