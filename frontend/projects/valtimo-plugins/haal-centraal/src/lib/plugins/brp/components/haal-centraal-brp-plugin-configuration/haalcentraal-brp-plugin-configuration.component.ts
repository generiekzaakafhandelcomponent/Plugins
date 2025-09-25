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
import {PluginConfigurationComponent, PluginManagementService, PluginTranslationService} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {BrpConfig} from '../../models';
import {TranslateService} from '@ngx-translate/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'zgw-haalcentraal-handelsregister-plugin-configuration',
    templateUrl: './haalcentraal-brp-plugin-configuration.component.html',
    styleUrls: ['./haalcentraal-brp-plugin-configuration.component.scss']
})
export class HaalcentraalBrpPluginConfigurationComponent
    // The component explicitly implements the PluginConfigurationComponent interface
    implements PluginConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    // If the plugin had already been saved, a prefill configuration of the type SuwinetPluginConfig is expected
    @Input() prefillConfiguration$: Observable<BrpConfig>;

    // If the configuration data changes, output whether the data is valid or not
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    // If the configuration is valid, output a configuration of the type SuwinetPluginConfig
    @Output() configuration: EventEmitter<BrpConfig> =
        new EventEmitter<BrpConfig>();

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<BrpConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly authenticationPluginSelectItems$: Observable<Array<{ id: string; text: string }>> =
        combineLatest([
            this.pluginManagementService.getPluginConfigurationsByCategory('haal-centraal-auth'),
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

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService
    ) {
    }

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: any): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: BrpConfig): void {
        // The configuration is valid when a configuration title and url are defined
        const valid = !!(
            formValue.configurationTitle &&
            formValue.brpBaseUrl
        );

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        /*
        If the save observable is triggered, check if the configuration is valid, and if so,
        output the configuration using the configuration EventEmitter.
         */
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
