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

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    CarbonListModule,
    ConfirmationModalModule,
    EditorModule,
    FormModule,
    InputModule as ValtimoInputModule,
    ParagraphModule, RenderInPageHeaderDirectiveModule,
    SelectModule,
} from '@valtimo/components';
import {
    ButtonModule,
    DialogModule,
    DropdownModule,
    IconModule,
    InputModule,
    LoadingModule,
    ModalModule,
    NotificationModule, TabsModule,
} from 'carbon-components-angular';
import {
    ValueMapperConfigurationComponent
} from "./components/value-mapper-configuration/value-mapper-configuration.component";
import {ProcessMappingComponent} from "./components/process-mapping/process-mapping.component";
import {ValueMapperListComponent} from "./components/value-mapper-list/value-mapper-list.component";
import {ValueMapperManagementRoutingModule} from "./value-mapper-management-routing.module";
import {ValueMapperEditorComponent} from "./components/value-mapper-editor/value-mapper-editor.component";
import {GenerateValueMapperComponent} from "./components/generate-value-mapping-file/generate-value-mapper.component";
import {
    ValueMapperAddEditModalComponent
} from "./components/value-mapper-add-edit-modal/value-mapper-add-edit-modal.component";
import {
    ValueMapperDeleteModalComponent
} from "./components/value-mapper-delete-modal/value-mapper-delete-modal.component";
import {CASE_MANAGEMENT_TAB_TOKEN} from "@valtimo/config";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ValueMapperConfigurationComponent,
      ProcessMappingComponent,
      ValueMapperListComponent,
      ValueMapperEditorComponent,
      GenerateValueMapperComponent,
      ValueMapperAddEditModalComponent,
      ValueMapperDeleteModalComponent
  ],
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        ValueMapperManagementRoutingModule,
        FormModule,
        ParagraphModule,
        SelectModule,
        ConfirmationModalModule,
        TranslateModule,
        ReactiveFormsModule,
        CarbonListModule,
        EditorModule,
        ValtimoInputModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        IconModule,
        InputModule,
        LoadingModule,
        ModalModule,
        NotificationModule,
        RenderInPageHeaderDirectiveModule,
        TabsModule,
    ],
  exports: [
    ValueMapperConfigurationComponent,
      ProcessMappingComponent,
      ValueMapperListComponent,
      ValueMapperEditorComponent,
      GenerateValueMapperComponent,
      ValueMapperAddEditModalComponent
  ],
    providers: [
    {
        provide: CASE_MANAGEMENT_TAB_TOKEN,
        useValue: {
            translationKey: 'Value mapper templates',
            component: ValueMapperListComponent,
        },
        multi: true,
    }
]
})
export class ValueMapperPluginModule {}
