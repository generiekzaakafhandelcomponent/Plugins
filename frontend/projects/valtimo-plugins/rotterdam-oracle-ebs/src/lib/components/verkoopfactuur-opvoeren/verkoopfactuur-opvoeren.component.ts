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
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
    FunctionConfigurationComponent,
    FunctionConfigurationData,
    PluginManagementService,
    PluginTranslationService
} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {FactuurKlasse, SaldoSoort, VerkoopfactuurOpvoerenConfig} from '../../models';
import {TranslateService} from "@ngx-translate/core";
import {SelectItem} from "@valtimo/components";

@Component({
    selector: 'valtimo-rotterdam-oracle-ebs-verkoopfactuur-opvoeren',
    templateUrl: './verkoopfactuur-opvoeren.component.html',
})
export class VerkoopfactuurOpvoerenComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<VerkoopfactuurOpvoerenConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<VerkoopfactuurOpvoerenConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    protected readonly factuurKlasseItems: Array<SelectItem> = Object.values(FactuurKlasse).map(item => ({
        id: item,
        text: item,
    }));

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService
    ) {}

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: VerkoopfactuurOpvoerenConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: VerkoopfactuurOpvoerenConfig): void {
        const valid = !!(
            formValue.procesCode &&
            formValue.referentieNummer &&
            formValue.factuurKlasse &&
            formValue.natuurlijkPersoon &&
            formValue.natuurlijkPersoon &&
            formValue.inkoopOrderReferentie &&
            formValue.regels.length > 0
        );

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
