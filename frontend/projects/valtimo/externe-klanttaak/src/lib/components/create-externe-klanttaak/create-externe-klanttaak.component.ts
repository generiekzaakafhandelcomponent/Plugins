/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';

import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {CreateExterneKlanttaakConfig, ExterneKlanttaakPluginConfig, ExterneKlanttaakVersion} from "../../models";
import {ExterneKlanttaakVersionService} from "../../services";

@Component({
    selector: 'valtimo-create-externe-klanttaak',
    templateUrl: './create-externe-klanttaak.component.html',
    styleUrls: ['./create-externe-klanttaak.component.scss'],
})
export class CreateExterneKlanttaakComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() selectedPluginConfiguration$: Observable<ExterneKlanttaakPluginConfig>;
    @Input() prefillConfiguration$: Observable<CreateExterneKlanttaakConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<CreateExterneKlanttaakConfig> =
        new EventEmitter<CreateExterneKlanttaakConfig>();
    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<CreateExterneKlanttaakConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);
    protected readonly externeKlanttaakVersion = new BehaviorSubject<ExterneKlanttaakVersion>(ExterneKlanttaakVersion.V1x1x0);
    protected readonly ExterneKlanttaakVersion = ExterneKlanttaakVersion;

    constructor(
        private readonly externeKlanttaakService: ExterneKlanttaakVersionService
    ) {
    }

    ngOnInit(): void {
        this.externeKlanttaakService.detectVersion(this.selectedPluginConfiguration$,this.prefillConfiguration$)
            .subscribe(
                externeKlanttaakVersion => this.externeKlanttaakVersion.next(externeKlanttaakVersion)
            );
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(() => {
            combineLatest([this.externeKlanttaakVersion, this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([externeKlanttaakVersion, formValue, valid]) => {
                    if (valid) {
                        this.configuration.emit({
                            externeKlanttaakVersion: externeKlanttaakVersion,
                            ...formValue
                        });
                    }
                });
        });
    }

    handleFormValue(actionConfiguration: CreateExterneKlanttaakConfig): void {
        this.formValue$.next(actionConfiguration);
    }

    handleFormValid(isValid: boolean): void {
        this.valid$.next(isValid);
        this.valid.emit(isValid);
    }
}