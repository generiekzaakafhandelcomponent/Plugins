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
import {BehaviorSubject, combineLatest, map, Observable, Subscription} from 'rxjs';
import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {CompleteExterneKlanttaakConfig, ExterneKlanttaakPluginConfig, ExterneKlanttaakVersion} from "../../models";

@Component({
    selector: 'valtimo-complete-externe-klanttaak',
    templateUrl: './complete-externe-klanttaak.component.html',
    styleUrls: ['./complete-externe-klanttaak.component.scss'],
})
export class CompleteExterneKlanttaakComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() selectedPluginConfiguration$: Observable<ExterneKlanttaakPluginConfig>;
    @Input() prefillConfiguration$: Observable<CompleteExterneKlanttaakConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<any> = new EventEmitter<any>();
    private saveSubscription!: Subscription;
    protected readonly externeKlanttaakVersion = new BehaviorSubject<ExterneKlanttaakVersion>(ExterneKlanttaakVersion.V1x1x0);
    private readonly formValue$ = new BehaviorSubject<CompleteExterneKlanttaakConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.detectVersion();
        this.openSaveSubscription();
        this.valid.emit(true);
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    private detectVersion() {
        combineLatest({
            pluginVersion: this.selectedPluginConfiguration$.pipe(
                map(pluginProperties => (pluginProperties ? pluginProperties.pluginVersion : undefined))
            ),
            prefillVersion: this.prefillConfiguration$.pipe(
                map(config => (config ? config.externeKlanttaakVersion : undefined))
            ),
        })
            .pipe(map(versions => versions.prefillVersion || versions.pluginVersion))
            .subscribe(externeKlanttaakVersion => this.externeKlanttaakVersion.next(externeKlanttaakVersion));
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            this.configuration.emit({});
        });
    }

    protected readonly ExterneKlanttaakVersion = ExterneKlanttaakVersion;

    handleFormValue(actionConfiguration: CompleteExterneKlanttaakConfig): void {
        this.formValue$.next(actionConfiguration);
    }

    handleFormValid(isValid: boolean): void {
        this.valid$.next(isValid);
        this.valid.emit(isValid);
    }
}