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
import {FormBuilder, Validators} from '@angular/forms';
import {TemplateMetadataModal} from '../../../../models';
import {CARBON_CONSTANTS, KeyGeneratorService} from '@valtimo/components';

@Component({
    selector: 'valtimo-text-template-add-edit-modal',
    templateUrl: './text-template-add-edit-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTemplateAddEditModalComponent implements OnInit {
    @Input() open = false;
    @Input() type: TemplateMetadataModal = 'add';

    @Input() set defaultKeyValue(value: string) {
        this._defaultKeyValue = value;
        this.setDefaultKeyValue(value);
    }

    @Output() closeEvent = new EventEmitter<{ key: string; metadata?: any } | null>();

    public form = this.fb.group({
        key: this.fb.control('', Validators.required),
    });

    private _defaultKeyValue!: string;

    public get key() {
        const key = this.form?.get('key');
        if (!key?.value) {
            return key
        }
        key.setValue(this.keyGeneratorService.getUniqueKey(key.value, []));
        return key;
    }

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
        if (!this.key) {
            return;
        }

        this.closeEvent.emit({key: this.key.value});
        this.resetForm();
    }

    private setDefaultKeyValue(value: string) {
        this.key.setValue(value);
    }

    private resetForm(): void {
        setTimeout(() => {
            this.form.reset();
            if (this.type === 'edit') {
                this.setDefaultKeyValue(this._defaultKeyValue);
            }
        }, CARBON_CONSTANTS.modalAnimationMs);
    }
}
