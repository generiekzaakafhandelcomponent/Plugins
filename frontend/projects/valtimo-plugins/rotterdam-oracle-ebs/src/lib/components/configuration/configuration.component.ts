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

import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
    PluginConfigurationComponent,
    PluginConfigurationData,
    PluginManagementService,
    PluginTranslationService
} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {RotterdamEsbConfig} from '../../models';
import {TranslateService} from "@ngx-translate/core";
import {Toggle} from "carbon-components-angular";
import {NGXLogger} from "ngx-logger";

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

    readonly mTlsSllContextConfigurationItems$: Observable<Array<{ id: string; text: string }>> =
        combineLatest([
            this.pluginManagementService.getPluginConfigurationsByCategory('mtls-sslcontext-plugin'),
            this.translateService.stream('key'),
        ]).pipe(
            map(([configurations]) =>
                configurations.map(configuration => ({
                    id: configuration.id,
                    text: `[${this.pluginTranslationService.instant('title', configuration.pluginDefinition.key)}] ${configuration.title}`,
                }))
            )
        );

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService,
        private readonly logger: NGXLogger
    ) {}

    ngOnInit(): void {
        this.logger.debug('Plugin configuration - onInit');
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.logger.debug('Plugin configuration - onDestroy');
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: RotterdamEsbConfig): void {
        this.logger.debug('formValueChange', formValue);
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: RotterdamEsbConfig): void {
        const valid = !!(
            formValue.configurationTitle &&
            formValue.baseUrl &&
            formValue.mTlsSslContextConfiguration
        );
        this.logger.debug('handleValid', valid);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    this.logger.debug('formValue', formValue);
                    if (valid) {
                        this.configuration.emit({
                            authenticationEnabled: this.authenticationEnabled.checked,
                            ...formValue
                        }!);
                    }
                });
        });
    }
}
