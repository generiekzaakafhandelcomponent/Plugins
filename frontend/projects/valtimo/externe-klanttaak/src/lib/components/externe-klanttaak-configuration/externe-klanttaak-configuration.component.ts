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
import {ExterneKlanttaakPluginConfig} from '../../models';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from '@valtimo/components';
import {ProcessService} from '@valtimo/process';
import {ObjectManagementService, ExterneKlanttaakVersionService} from '../../services';
import {PluginConfigurationComponent, PluginManagementService, PluginTranslationService} from "@valtimo/plugin";

@Component({
    selector: 'valtimo-externe-klanttaak-configuration',
    templateUrl: './externe-klanttaak-configuration.component.html',
    styleUrls: ['./externe-klanttaak-configuration.component.scss'],
})
export class ExterneKlanttaakConfigurationComponent
    implements PluginConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<ExterneKlanttaakPluginConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<ExterneKlanttaakPluginConfig> =
        new EventEmitter<ExterneKlanttaakPluginConfig>();
    readonly notificatiesApiPluginSelectItems$: Observable<Array<SelectItem>> = combineLatest([
        this.pluginManagementService.getPluginConfigurationsByPluginDefinitionKey('notificatiesapi'),
        this.translateService.stream('key'),
    ]).pipe(
        map(([configurations]) =>
            configurations.map(configuration => ({
                id: configuration.id,
                text: `${configuration.title} - ${this.pluginTranslationService.instant(
                    'title',
                    configuration.pluginDefinition.key
                )}`,
            }))
        )
    );
    readonly objectManagementConfigurationItems$: Observable<Array<SelectItem>> = combineLatest([
        this.objectManagementService.getAllObjects(),
        this.translateService.stream('key'),
    ]).pipe(
        map(([objectManagementConfigurations]) =>
            objectManagementConfigurations.map(configuration => ({
                id: configuration.id,
                text: `${configuration.title}`,
            }))
        )
    );
    readonly externeKlanttaakVersionItems$: Observable<Array<SelectItem>> = this.externeKlanttaakVersionService
        .getSupportedVersions()
        .pipe(
            map(versions => (
                versions.map(version => ({
                    id: version,
                    text: version,
                })))
            )
        );

    readonly processSelectItems$: Observable<Array<SelectItem>> = this.processService
        .getProcessDefinitions()
        .pipe(
            map(processDefinitions =>
                processDefinitions.map(processDefinition => ({
                    id: processDefinition.key,
                    text: processDefinition.name,
                }))
            )
        );

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<ExterneKlanttaakPluginConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly objectManagementService: ObjectManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService,
        private readonly externeKlanttaakVersionService: ExterneKlanttaakVersionService,
        private readonly processService: ProcessService
    ) {
    }

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: ExterneKlanttaakPluginConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: ExterneKlanttaakPluginConfig): void {
        const valid = !!(
            formValue.configurationTitle &&
            formValue.notificatiesApiPluginConfiguration &&
            formValue.objectManagementConfigurationId
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
                        this.configuration.emit(formValue);
                    }
                });
        });
    }
}