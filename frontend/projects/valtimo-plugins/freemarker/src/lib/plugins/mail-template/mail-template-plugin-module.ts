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
import {MailTemplateConfigurationComponent} from './components/mail-template-configuration/mail-template-configuration.component';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {
    CarbonListModule,
    ConfirmationModalModule,
    EditorModule,
    FormModule,
    InputModule as ValtimoInputModule,
    ParagraphModule, RenderInPageHeaderDirectiveModule,
    SelectModule,
} from '@valtimo/components';
import {GenerateMailContentComponent} from './components/generate-mail-content/generate-mail-content.component';
import {GenerateMailFileComponent} from './components/generate-mail-file/generate-mail-file.component';
import {
    ButtonModule,
    DialogModule,
    DropdownModule,
    IconModule,
    InputModule,
    LoadingModule,
    ModalModule,
    NotificationModule, TabsModule,
} from 'carbon-components-angular';import {CASE_MANAGEMENT_TAB_TOKEN} from '@valtimo/config';
import {MailTemplateListComponent} from './components/mail-template-list/mail-template-list.component';
import {MailTemplateAddEditModalComponent} from './components/mail-template-add-edit-modal/mail-template-add-edit-modal.component';
import {MailTemplateEditorComponent} from './components/mail-template-editor/mail-template-editor.component';
import {MailTemplateDeleteModalComponent} from './components/mail-template-delete-modal/mail-template-delete-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TemplateManagementRoutingModule} from './mail-template-management-routing.module';

@NgModule({
    declarations: [
        MailTemplateConfigurationComponent,
        GenerateMailFileComponent,
        GenerateMailContentComponent,
        MailTemplateAddEditModalComponent,
        MailTemplateEditorComponent,
        MailTemplateDeleteModalComponent,
        MailTemplateListComponent,
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
        MailTemplateConfigurationComponent,
        GenerateMailFileComponent,
        GenerateMailContentComponent,
        MailTemplateAddEditModalComponent,
        MailTemplateEditorComponent,
        MailTemplateDeleteModalComponent,
        MailTemplateListComponent,
    ],
    providers: [
        {
            provide: CASE_MANAGEMENT_TAB_TOKEN,
            useValue: {
                translationKey: 'Mail templates',
                component: MailTemplateListComponent,
            },
            multi: true,
        }
    ]
})
export class MailTemplatePluginModule {
}
