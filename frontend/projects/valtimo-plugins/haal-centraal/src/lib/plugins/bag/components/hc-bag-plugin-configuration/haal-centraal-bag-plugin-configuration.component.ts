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

import {PluginConfigurationComponent} from "@valtimo/plugin";
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from "rxjs";
import {BagConfig} from "../../models";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'haal-centraal-bag-plugin-configuration',
    templateUrl: './haal-centraal-bag-plugin-configuration.component.html',
    styleUrls: ['./haal-centraal-bag-plugin-configuration.component.scss']
})
export class HaalCentraalBagPluginConfigurationComponent
    // The component explicitly implements the PluginConfigurationComponent interface
    implements PluginConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string
    // If the plugin had already been saved, a prefilled configuration of the type HaalCentraalBagPluginConfig is expected
    @Input() prefillConfiguration$: Observable<BagConfig>;

    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<BagConfig> =
        new EventEmitter<BagConfig>();
    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<BagConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

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

    private handleValid(formValue: BagConfig): void {
        // The configuration is valid when a configuration title and url are defined
        const valid = !!(
            formValue.configurationTitle &&
            formValue.bagBaseUrl
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
