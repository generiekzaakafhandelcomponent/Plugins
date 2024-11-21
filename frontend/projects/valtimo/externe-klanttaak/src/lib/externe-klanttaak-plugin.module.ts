/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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
import {ExterneKlanttaakConfigurationComponent} from './components/externe-klanttaak-configuration/externe-klanttaak-configuration.component';
import {CommonModule} from '@angular/common';
import {
  CarbonMultiInputModule,
  ComponentsPipesModule,
  FormModule,
  InputModule,
  SelectModule,
} from '@valtimo/components';
import {
  DatePickerModule,
  LoadingModule,
  NotificationModule,
  ToggleModule,
} from 'carbon-components-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {PluginTranslatePipeModule} from "@valtimo/plugin";
import {
  CreateExterneKlanttaakComponent
} from "./components/version/v1x1x0/create-externe-klanttaak/create-externe-klanttaak.component";
import {
  PortalTaskV2FormComponent
} from "./components/version/v1x1x0/create-externe-klanttaak/components/portal-task-v2-form/portal-task-v2-form.component";
import {
  CompleteExterneKlanttaakComponent
} from "./components/version/v1x1x0/complete-externe-klanttaak/complete-externe-klanttaak.component";

@NgModule({
  declarations: [
    ExterneKlanttaakConfigurationComponent,
    CreateExterneKlanttaakComponent,
    PortalTaskV2FormComponent,
    CompleteExterneKlanttaakComponent,
  ],
  imports: [
    CommonModule,
    PluginTranslatePipeModule,
    ComponentsPipesModule,
    FormModule,
    InputModule,
    SelectModule,
    CarbonMultiInputModule,
    FormsModule,
    LoadingModule,
    TranslateModule,
    DatePickerModule,
    ReactiveFormsModule,
    ToggleModule,
    NotificationModule,
    PluginTranslatePipeModule,
  ],
  exports: [
    ExterneKlanttaakConfigurationComponent,
    CreateExterneKlanttaakComponent,
    PortalTaskV2FormComponent,
    CompleteExterneKlanttaakComponent,
  ],
})
export class ExterneKlanttaakPluginModule {}