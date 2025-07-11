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
import {
    HuggingFaceConfigurationComponent
} from './components/hugging-face-configuration/hugging-face-configuration.component';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {FormModule, InputModule, ParagraphModule} from '@valtimo/components';
import {GiveSummaryConfigurationComponent} from './components/give-summary/give-summary-configuration.component';
import {ChatConfigurationComponent} from "./components/chat/chat-configuration.component";
import {ChatMemorizeConfigurationComponent} from "./components/chat-memorize/chat-memorize-configuration.component";

@NgModule({
    declarations: [
        HuggingFaceConfigurationComponent,
        GiveSummaryConfigurationComponent,
        ChatConfigurationComponent,
        ChatMemorizeConfigurationComponent,
    ],
    imports: [CommonModule, PluginTranslatePipeModule, FormModule, InputModule, ParagraphModule],
    exports: [
        HuggingFaceConfigurationComponent,
        GiveSummaryConfigurationComponent,
        ChatConfigurationComponent,
        ChatMemorizeConfigurationComponent,
    ],
})
export class HuggingFacePluginModule {
}
