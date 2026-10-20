/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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
 *
 */

import {Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {SelectItem} from '@valtimo/components';
import {BrpPersonenBaseActionConfig, PERSOON_BEPERKT_FIELDS} from '../models';

const MAX_FIELDS = 130;

@Directive()
export abstract class BrpPersonenBaseActionComponent<T extends BrpPersonenBaseActionConfig>
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<T>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<T> = new EventEmitter<T>();

    protected abstract readonly requiredFields: Array<keyof T>;

    /** The field paths that can be requested; the Zoek* query types only support PersoonBeperkt. */
    protected readonly fieldOptions: ReadonlyArray<string> = PERSOON_BEPERKT_FIELDS;

    private _fieldSelectItems?: Array<SelectItem>;

    get fieldSelectItems(): Array<SelectItem> {
        // Cached, so the select does not receive a new items array on every change detection
        this._fieldSelectItems ??= this.fieldOptions.map(field => ({id: field, text: field}));
        return this._fieldSelectItems;
    }

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<T | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: T): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: T): void {
        const required: Array<keyof T> = [...this.requiredFields, 'resultProcessVariableName'];
        const fields = formValue?.fields ?? [];
        const valid =
            required.every(key => this.hasValue(formValue?.[key])) &&
            fields.length > 0 &&
            fields.length <= MAX_FIELDS;

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private hasValue(value: unknown): boolean {
        return typeof value === 'string' ? value.trim().length > 0 : !!value;
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(() => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    if (valid) {
                        this.configuration.emit(formValue);
                    }
                });
        });
    }
}
