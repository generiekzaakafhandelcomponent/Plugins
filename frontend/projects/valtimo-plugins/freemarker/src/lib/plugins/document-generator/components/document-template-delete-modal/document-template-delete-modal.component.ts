/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfirmationModalModule} from '@valtimo/components';

@Component({
    standalone: true,
    selector: 'valtimo-document-template-delete-modal',
    templateUrl: './document-template-delete-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ConfirmationModalModule
    ]
})
export class DocumentTemplateDeleteModalComponent {
  @Input() deleteRowKeys: Array<string>;
  @Input() showDeleteModal$: Observable<boolean>;
  @Output() deleteEvent = new EventEmitter<Array<any>>();

  public onDelete(templates: Array<any>): void {
    this.deleteEvent.emit(templates);
  }
}
