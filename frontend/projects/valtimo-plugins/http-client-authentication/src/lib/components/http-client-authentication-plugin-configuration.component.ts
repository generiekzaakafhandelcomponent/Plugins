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
    styles: ['.tls-toggle { margin-block-end: var(--v-input-margin); }'],
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
    readonly tokenRadio = {value: 'TOKEN', title: 'Token'};
    readonly zgwJwtRadio = {value: 'ZGW_JWT', title: 'Client ID / secret (ZGW JWT)'};
    readonly noneRadio = {value: 'NONE', title: 'None'};

    readonly authenticationTypeOptions = [
        this.bearerRadio,
        this.headerRadio,
        this.tokenRadio,
        this.zgwJwtRadio,
        this.noneRadio,
    ];

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<HttpClientAuthenticationPluginConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    // The private key is a secret and never sent back, so an unchanged certificate keeps its stored key
    private prefilledClientCertificate = '';

    // Secrets are never sent back either, so an unchanged authentication type keeps its stored secret
    private prefilledAuthenticationType = '';

    selectedAuthType$ = new BehaviorSubject(this.bearerRadio)

    // Frontend-only switch: the certificate fields are shown, validated and saved only while it is on
    readonly tlsEnabled$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.prefillConfiguration$.pipe(map(config => {
            this.prefilledClientCertificate = config?.clientCertificate?.trim() ?? '';
            this.prefilledAuthenticationType = config?.authenticationType ?? '';
            this.tlsEnabled$.next(!!(this.prefilledClientCertificate || config?.serverCertificate?.trim()));
            this.selectAuthType(config?.authenticationType);
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
        this.selectAuthType(radioValue);
    }

    tlsEnabledChange(tlsEnabled: boolean): void {
        this.tlsEnabled$.next(tlsEnabled);
        const formValue = this.formValue$.getValue();
        if (formValue) {
            this.handleValid(formValue);
        }
    }

    private selectAuthType(authenticationType: string | undefined): void {
        const option = this.authenticationTypeOptions.find(option => option.value === authenticationType);
        if (option) {
            this.selectedAuthType$.next(option);
        }
    }

    private handleValid(formValue: HttpClientAuthenticationPluginConfig): void {
        const valid = !!formValue.configurationTitle
            && this.authenticationValid(formValue)
            && (!this.tlsEnabled$.getValue() || this.certificatesValid(formValue));

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private authenticationValid(formValue: HttpClientAuthenticationPluginConfig): boolean {
        const secretValid = !!formValue.authSecret || formValue.authenticationType === this.prefilledAuthenticationType;
        switch (formValue.authenticationType) {
            case this.bearerRadio.value:
            case this.tokenRadio.value:
                return secretValid;
            case this.headerRadio.value:
                return !!formValue.authHeaderName && secretValid;
            case this.zgwJwtRadio.value:
                return !!formValue.clientId && secretValid && (!formValue.authSecret || formValue.authSecret.length >= 32);
            case this.noneRadio.value:
                return true;
            default:
                return false;
        }
    }

    private certificatesValid(formValue: HttpClientAuthenticationPluginConfig): boolean {
        const clientCertificate = formValue.clientCertificate?.trim() ?? '';
        const clientPrivateKey = formValue.clientPrivateKey?.trim() ?? '';
        if (!clientCertificate) {
            return !clientPrivateKey;
        }
        return !!clientPrivateKey || clientCertificate === this.prefilledClientCertificate;
    }

    private withoutDisabledFields(formValue: HttpClientAuthenticationPluginConfig): HttpClientAuthenticationPluginConfig {
        if (this.tlsEnabled$.getValue()) {
            return formValue;
        }
        const {clientCertificate, clientPrivateKey, serverCertificate, ...withoutTlsFields} = formValue;
        return withoutTlsFields;
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
                        this.configuration.emit(this.withoutDisabledFields(formValue));
                    }
                });
        });
    }
}
