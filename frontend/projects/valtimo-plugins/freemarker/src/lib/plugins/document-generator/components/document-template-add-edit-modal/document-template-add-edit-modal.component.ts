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

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TemplateMetadataModal} from '../../../../models';
import {CARBON_CONSTANTS, KeyGeneratorService, ValtimoCdsModalDirectiveModule} from '@valtimo/components';
import {CommonModule} from '@angular/common';
import {ButtonModule, ComboBoxModule, InputModule, ListItem, ModalModule} from 'carbon-components-angular';
import {TranslateModule} from '@ngx-translate/core';
import {DOCUMENT_TYPES} from '../../models';

@Component({
    standalone: true,
    selector: 'valtimo-document-template-add-edit-modal',
    templateUrl: './document-template-add-edit-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ButtonModule,
        TranslateModule,
        ModalModule,
        ReactiveFormsModule,
        InputModule,
        ComboBoxModule,
        ValtimoCdsModalDirectiveModule
    ]
})
export class DocumentTemplateAddEditModalComponent implements OnInit {
    @Input() open = false;
    @Input() modalType: TemplateMetadataModal = 'add';

    @Input() set defaultKeyValue(value: string) {
        this._defaultKeyValue = value;
        this.setDefaultKeyValue(value);
    }

    @Input() set defaultTypeValue(value: string) {
        this._defaultTypeValue = value;
        this.setDefaultTypeValue(value);
    }

    @Output() closeEvent = new EventEmitter<{ key: string; type: string } | null>();

    public form = this.fb.group({
        key: this.fb.control('', Validators.required),
        type: this.fb.control(undefined, Validators.required),
    });

    private _defaultKeyValue!: string;
    private _defaultTypeValue!: string;

    public get key(): AbstractControl<string> {
        const key = this.form?.get('key');
        if (!key?.value) {
            return key;
        }
        key.setValue(this.keyGeneratorService.getUniqueKey(key.value, []));
        return key;
    }

    public get type(): AbstractControl<string> {
        return this.form?.get('type');
    }

    public readonly documentTypeSelectItems: Array<ListItem> = DOCUMENT_TYPES.map(item => ({
        id: item,
        content: item,
        selected: false,
    }));

    constructor(
        private readonly fb: FormBuilder,
        private readonly keyGeneratorService: KeyGeneratorService,
    ) {
    }

    public ngOnInit(): void {
    }

    public onCancel(): void {
        this.closeEvent.emit(null);
        this.resetForm();
    }

    public onConfirm(): void {
        if (!this.key || !this.type) {
            return;
        }

        this.closeEvent.emit({key: this.key.value, type: this.type.value});
        this.resetForm();
    }

    private setDefaultKeyValue(value: string) {
        this.key.setValue(value);
    }

    private setDefaultTypeValue(value: string) {
        this.type.setValue(value);
    }

    private resetForm(): void {
        setTimeout(() => {
            this.form.reset();
            if (this.modalType === 'edit') {
                this.setDefaultKeyValue(this._defaultKeyValue);
                this.setDefaultTypeValue(this._defaultTypeValue);
            }
        }, CARBON_CONSTANTS.modalAnimationMs);
    }
}
