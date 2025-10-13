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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {GiveSummaryConfig} from '../../models';
import {FunctionConfigurationData} from "@valtimo/plugin/lib/models/plugin";

@Component({
    selector: 'valtimo-give-summary-configuration',
    templateUrl: './give-summary-configuration.component.html',
    styleUrls: ['./give-summary-configuration.component.scss'],
})
export class GiveSummaryConfigurationComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<GiveSummaryConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<GiveSummaryConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: GiveSummaryConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: GiveSummaryConfig): void {
        const valid = !!(formValue.longText, formValue.resultPV);

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    if (valid) {
                        this.configuration.emit(formValue!);
                    }
                });
        });
    }
}
