/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {RdwVoertuigConfig} from '../../models/';

@Component({
    selector: 'rdw-voertuig-configuration',
    templateUrl: './rdw-voertuig.component.html',
    styleUrls: ['./rdw-voertuig.component.scss'],
})
export class RdwVoertuigComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<RdwVoertuigConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<RdwVoertuigConfig> = new EventEmitter<RdwVoertuigConfig>();

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<RdwVoertuigConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    defaultValues$;

    ngOnInit(): void {
        this.openSaveSubscription();
        this.defaultValues$ = this.prefillConfiguration$.pipe(
            map(config => {
                return config.dynamicProperties
                    ? config.dynamicProperties.map(value => ({key: value, value: value}))
                    : [];
            })
        );
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: RdwVoertuigConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: RdwVoertuigConfig): void {
        const valid = !!(
            formValue.kenteken &&
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
