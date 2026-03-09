/*
 * Copyright 2015-2020 Ritense BV, the Netherlands.
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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {UwvInkomstenPersoonInfoConfig} from '../../models';

@Component({
    selector: 'uwv-inkomsten-persoon-info',
    templateUrl: './uwv-inkomsten-info.component.html',
    styleUrls: ['./uwv-inkomsten-info.component.scss'],
})

export class UwvInkomstenInfoComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<UwvInkomstenPersoonInfoConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<UwvInkomstenPersoonInfoConfig> = new EventEmitter<UwvInkomstenPersoonInfoConfig>();

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<UwvInkomstenPersoonInfoConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    defaultValues$;

    ngOnInit(): void {
        this.openSaveSubscription();
        this.defaultValues$ = this.prefillConfiguration$.pipe(
            map(config => config?.dynamicProperties?.map(value => ({key: value, value: value})))
        );
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: UwvInkomstenPersoonInfoConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: UwvInkomstenPersoonInfoConfig): void {
        const valid = !!(
            formValue.bsn &&
            formValue.resultProcessVariableName
        );

        this.valid$.next(valid);
        this.valid.emit(valid);
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
