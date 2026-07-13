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

import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Page} from '@valtimo/config';
import {TemplateListItem} from '../../../../models';
import {GenerateTemplateConfigurationComponent} from '../../../shared/generate-template/generate-template-configuration.component';

@Component({
    standalone: false,
    selector: 'valtimo-generate-mail-file-configuration',
    templateUrl: '../../../shared/generate-template/generate-template-configuration.component.html',
})
export class GenerateMailFileComponent extends GenerateTemplateConfigurationComponent {
    readonly keyFieldName = 'mailTemplateKey';
    readonly defaultProcessVariableName = 'contentId';
    readonly descriptionKey = 'generateMailFileDescription';
    readonly keyTitleKey = 'mailTemplateKey';
    readonly keyTooltipKey = 'mailTemplateKeyTooltip';

    protected fetchTemplates(documentDefinitionName: string): Observable<Page<TemplateListItem>> {
        return this.templateService.getAllMailTemplates(documentDefinitionName);
    }
}
