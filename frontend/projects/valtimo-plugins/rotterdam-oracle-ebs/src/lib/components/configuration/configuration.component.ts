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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
    PluginConfigurationComponent,
    PluginConfigurationData,
    PluginManagementService,
    PluginTranslationService
} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {RotterdamEsbConfig} from '../../models';
import {TranslateService} from "@ngx-translate/core";
import {Toggle} from "carbon-components-angular";

@Component({
    selector: 'valtimo-rotterdam-oracle-ebs-configuration',
    templateUrl: './configuration.component.html',
    styleUrl: 'configuration.component.scss'
})
export class ConfigurationComponent implements PluginConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<RotterdamEsbConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<PluginConfigurationData> = new EventEmitter<PluginConfigurationData>();
    @ViewChild('authenticationEnabled') authenticationEnabled: Toggle;

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<RotterdamEsbConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

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

    formValueChange(formValue: RotterdamEsbConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: RotterdamEsbConfig): void {
        const valid = !!(
            formValue.configurationTitle &&
            formValue.baseUrl
        );

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    console.log('formValue', formValue)
                    if (valid) {
                        if (this.authenticationEnabled.checked) {
                            this.configuration.emit({
                                authenticationEnabled: true,
                                ...formValue
                            }!);
                        } else {
                            this.configuration.emit({
                                authenticationEnabled: false,
                                base64ServerCertificate: "",
                                base64ClientPrivateKey: "",
                                base64ClientCertificate: "",
                                ...formValue
                            }!);
                        }
                    }
                });
        });
    }
}
