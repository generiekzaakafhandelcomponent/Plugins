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

import {NgModule} from '@angular/core';
import {AsyncPipe, CommonModule, NgIf} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {FormModule, InputLabelModule, InputModule} from '@valtimo/components';
import {ConfigurationComponent} from './components/configuration/configuration.component';
import {JournaalpostOpvoerenComponent} from "./components/journaalpost-opvoeren/journaalpost-opvoeren.component";
import {NotificationModule, ToggleModule} from "carbon-components-angular";
import {VerkoopfactuurOpvoerenComponent} from "./components/verkoopfactuur-opvoeren/verkoopfactuur-opvoeren.component";

@NgModule({
    declarations: [
        ConfigurationComponent,
        JournaalpostOpvoerenComponent,
        VerkoopfactuurOpvoerenComponent
    ],
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        FormModule,
        InputModule,
        InputLabelModule,
        AsyncPipe,
        NotificationModule,
        AsyncPipe,
        ToggleModule,
        NgIf,
    ],
    exports: [
        ConfigurationComponent,
        JournaalpostOpvoerenComponent,
        VerkoopfactuurOpvoerenComponent
    ],
})
export class RotterdamOracleEbsPluginModule {
}
