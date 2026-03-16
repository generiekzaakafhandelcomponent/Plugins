/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from "rxjs";
import {
    HttpClientAuthenticationPluginConfig
} from "../models/http-client-authentication-plugin-config";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'http-client-authentication-plugin-configuration',
    templateUrl: './http-client-authentication-plugin-configuration.component.html',
})
export class HttpClientAuthenticationPluginConfigurationComponent
    // The component explicitly implements the PluginConfigurationComponent interface
    implements PluginConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string
    // If the plugin had already been saved, a prefilled configuration of the type HttpClientAuthenticationPluginConfig is expected
    @Input() prefillConfiguration$: Observable<HttpClientAuthenticationPluginConfig>;

    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<HttpClientAuthenticationPluginConfig> =
        new EventEmitter<HttpClientAuthenticationPluginConfig>();

    readonly bearerRadio = {value: 'BEARER', title: 'Bearer'};
    readonly headerRadio = {value: 'HEADER', title: 'Header'};
    readonly noneRadio = {value: 'NONE', title: 'None'};

    readonly authenticationTypeOptions = [this.bearerRadio, this.headerRadio, this.noneRadio];

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<HttpClientAuthenticationPluginConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    selectedAuthType$ = new BehaviorSubject(this.bearerRadio)

    ngOnInit(): void {
        this.prefillConfiguration$.pipe(map(config => {
            if (config?.authenticationType) {
                if (config.authenticationType === this.bearerRadio.value) {
                    this.selectedAuthType$.next(this.bearerRadio)
                } else if (config.authenticationType === this.headerRadio.value) {
                    this.selectedAuthType$.next(this.headerRadio)
                } else if (config.authenticationType === this.noneRadio.value) {
                    this.selectedAuthType$.next(this.noneRadio)
                }
            }
        })).subscribe();
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: any): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    radioValueChange(radioValue: string): void {
        if (radioValue) {
            if (radioValue === this.bearerRadio.value) {
                this.selectedAuthType$.next(this.bearerRadio)
            } else if (radioValue === this.headerRadio.value) {
                this.selectedAuthType$.next(this.headerRadio)
            } else if (radioValue === this.noneRadio.value) {
                this.selectedAuthType$.next(this.noneRadio)
            }
        }
    }

    private handleValid(formValue: HttpClientAuthenticationPluginConfig): void {
        let valid = false
        if (formValue.authenticationType === this.bearerRadio.value) {
            valid = !!(formValue.authSecret
                && formValue.configurationTitle)
        } else if (formValue.authenticationType === this.headerRadio.value) {
            valid = !!(formValue.authHeaderName
                && formValue.authSecret
                && formValue.configurationTitle)
        } else if (formValue.authenticationType === this.noneRadio.value) {
            valid = !!(formValue.configurationTitle)
        }

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
