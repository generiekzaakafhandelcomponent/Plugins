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
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {FormModule, InputModule, ParagraphModule} from '@valtimo/components';
import {NotifyNlConfigurationComponent} from "./components/notify-nl-configuration/notify-nl-configuration.component";
import {SendSmsConfigurationComponent} from "./components/send-sms/send-sms-configuration.component";
import {SendEmailConfigurationComponent} from "./components/send-email/send-email-configuration.component";
import {GetMessageConfigurationComponent} from "./components/get-message/get-message-configuration.component";
import {GetTemplateConfigurationComponent} from "./components/get-template/get-template-configuration.component";
import {
    GetAllTemplatesConfigurationComponent
} from "./components/get-all-templates/get-all-templates-configuration.component";
import {SendLetterConfigurationComponent} from "./components/send-letter/send-letter-configuration.component";

@NgModule({
  declarations: [
    NotifyNlConfigurationComponent,
    SendSmsConfigurationComponent,
    SendEmailConfigurationComponent,
    SendLetterConfigurationComponent,
    GetMessageConfigurationComponent,
    GetTemplateConfigurationComponent,
    GetAllTemplatesConfigurationComponent
  ],
  imports: [CommonModule, PluginTranslatePipeModule, FormModule, InputModule, ParagraphModule],
  exports: [
    NotifyNlConfigurationComponent,
    SendSmsConfigurationComponent,
    SendEmailConfigurationComponent,
    SendLetterConfigurationComponent,
    GetMessageConfigurationComponent,
    GetTemplateConfigurationComponent,
    GetAllTemplatesConfigurationComponent
  ],
})
export class NotifyNlPluginModule {}
