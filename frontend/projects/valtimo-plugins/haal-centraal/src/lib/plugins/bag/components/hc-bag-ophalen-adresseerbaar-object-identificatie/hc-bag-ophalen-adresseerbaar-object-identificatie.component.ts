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
 *
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {OphalenAdresseerbaarObjectIdentificatie} from "../../models";
import {RadioValue} from "@valtimo/components";

@Component({
    selector: 'ophalen-adresseerbaar-object-identificatie',
    templateUrl: './hc-bag-ophalen-adresseerbaar-object-identificatie.component.html',
    styleUrls: ['./hc-bag-ophalen-adresseerbaar-object-identificatie.component.scss']
})

export class HcBagOphalenAdresseerbaarObjectIdentificatieComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<OphalenAdresseerbaarObjectIdentificatie>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<OphalenAdresseerbaarObjectIdentificatie> = new EventEmitter<OphalenAdresseerbaarObjectIdentificatie>();

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<OphalenAdresseerbaarObjectIdentificatie | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);
    readonly pluginId$ = new BehaviorSubject<string>('');

    readonly exacteMatchOptions$: Observable<Array<RadioValue>> = this.pluginId$.pipe(
        map(() => [
            { value: true, title: "True" },
            { value: false, title: "False" }
        ])
    );

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: OphalenAdresseerbaarObjectIdentificatie): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: OphalenAdresseerbaarObjectIdentificatie): void {
        const valid = !!(
            formValue.postcode &&
            formValue.huisnummer &&
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
