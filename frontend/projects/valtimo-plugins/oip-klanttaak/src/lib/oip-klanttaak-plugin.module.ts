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
import {CarbonMultiInputModule, FormModule, InputModule, SelectModule} from '@valtimo/components';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {NotificationModule, ToggleModule} from 'carbon-components-angular';
import {CompleteDelegatedTaskComponent} from './components/complete-delegated-task/complete-delegated-task.component';
import {ConfigurationComponent} from './components/configuration/configuration.component';
import {DelegateTaskComponent} from './components/delegate-task/delegate-task.component';

@NgModule({
  declarations: [
    CompleteDelegatedTaskComponent,
    ConfigurationComponent,
    DelegateTaskComponent,
  ],
    imports: [
        AsyncPipe,
        CarbonMultiInputModule,
        CommonModule,
        FormModule,
        InputModule,
        NgIf,
        PluginTranslatePipeModule,
        SelectModule,
        ToggleModule,
        NotificationModule,
    ],
  exports: []
})
export class OipKlanttaakPluginModule { }
