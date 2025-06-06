/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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
import {TextTemplateConfigurationComponent} from './components/text-template-configuration/text-template-configuration.component';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {
    CarbonListModule,
    ConfirmationModalModule,
    EditorModule,
    FormModule,
    InputModule as ValtimoInputModule,
    ParagraphModule,
    RenderInPageHeaderDirectiveModule,
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
    NotificationModule,
    TabsModule,
} from 'carbon-components-angular';
import {CASE_MANAGEMENT_TAB_TOKEN} from '@valtimo/shared';
import {TextTemplateListComponent} from './components/text-template-list/text-template-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TemplateManagementRoutingModule} from './text-template-management-routing.module';
import {GenerateTextFileComponent} from './components/generate-text-file/generate-text-file.component';

@NgModule({
    declarations: [
        GenerateTextFileComponent,
        TextTemplateConfigurationComponent,
    ],
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        TemplateManagementRoutingModule,
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
        GenerateTextFileComponent,
    ],
    providers: [
        {
            provide: CASE_MANAGEMENT_TAB_TOKEN,
            useValue: {
                translationKey: 'text-template',
                component: TextTemplateListComponent,
            },
            multi: true,
        }
    ]
})
export class TextTemplatePluginModule {
}
