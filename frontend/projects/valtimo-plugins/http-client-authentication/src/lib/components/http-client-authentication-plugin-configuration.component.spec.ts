/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {PluginTranslationService} from '@valtimo/plugin';
import {of, Subject} from 'rxjs';
import {HttpClientAuthenticationPluginConfigurationComponent} from './http-client-authentication-plugin-configuration.component';
import {HttpClientAuthenticationPluginModule} from '../http-client-authentication.plugin.module';
import {httpClientAuthenticationPluginSpecification} from '../http-client-authentication.plugin.specification';
import {HttpClientAuthenticationPluginConfig} from '../models/http-client-authentication-plugin-config';

describe('HttpClientAuthenticationPluginConfigurationComponent', () => {
    const certificate = '-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----';
    const renewedCertificate = '-----BEGIN CERTIFICATE-----\nMIIC\n-----END CERTIFICATE-----';
    const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIE\n-----END PRIVATE KEY-----';
    const clientSecret = 'a-client-secret-of-at-least-32-characters';

    let component: HttpClientAuthenticationPluginConfigurationComponent;
    let save$: Subject<void>;
    let validValues: boolean[];

    function create(prefill: Partial<HttpClientAuthenticationPluginConfig> | null = null): void {
        component = new HttpClientAuthenticationPluginConfigurationComponent();
        save$ = new Subject<void>();
        validValues = [];
        component.save$ = save$;
        component.disabled$ = of(false);
        component.pluginId = 'http-client-authentication-plugin';
        component.prefillConfiguration$ = of(prefill as HttpClientAuthenticationPluginConfig);
        component.valid.subscribe(valid => validValues.push(valid));
        component.ngOnInit();
    }

    function isValid(formValue: Partial<HttpClientAuthenticationPluginConfig>): boolean {
        component.formValueChange({configurationTitle: 'Den Bosch gateway', ...formValue});
        return validValues[validValues.length - 1];
    }

    beforeEach(() => create());

    afterEach(() => component.ngOnDestroy());

    it('offers every authentication type', () => {
        expect(component.authenticationTypeOptions.map(option => option.value))
            .toEqual(['BEARER', 'HEADER', 'TOKEN', 'ZGW_JWT', 'NONE']);
    });

    it('requires the fields of the chosen authentication type', () => {
        expect(isValid({authenticationType: 'BEARER', authSecret: 'secret'})).toBeTrue();
        expect(isValid({authenticationType: 'BEARER'})).toBeFalse();
        expect(isValid({authenticationType: 'HEADER', authHeaderName: 'X-Api-Key', authSecret: 'secret'})).toBeTrue();
        expect(isValid({authenticationType: 'HEADER', authSecret: 'secret'})).toBeFalse();
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token'})).toBeTrue();
        expect(isValid({authenticationType: 'TOKEN'})).toBeFalse();
        expect(isValid({authenticationType: 'ZGW_JWT', clientId: 'valtimo_client', authSecret: clientSecret})).toBeTrue();
        expect(isValid({authenticationType: 'ZGW_JWT', clientId: 'valtimo_client', authSecret: 'secret'})).toBeFalse();
        expect(isValid({authenticationType: 'ZGW_JWT', authSecret: clientSecret})).toBeFalse();
        expect(isValid({authenticationType: 'ZGW_JWT', clientId: 'valtimo_client'})).toBeFalse();
        expect(isValid({authenticationType: 'NONE'})).toBeTrue();
    });

    it('keeps the stored secret while the prefilled authentication type is unchanged', () => {
        create({authenticationType: 'ZGW_JWT', clientId: 'valtimo_client'});

        expect(isValid({authenticationType: 'ZGW_JWT', clientId: 'valtimo_client'})).toBeTrue();
        expect(isValid({authenticationType: 'ZGW_JWT', clientId: 'valtimo_client', authSecret: 'secret'})).toBeFalse();
        expect(isValid({authenticationType: 'TOKEN'})).toBeFalse();
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token'})).toBeTrue();
    });

    it('requires a configuration name', () => {
        component.formValueChange({authenticationType: 'NONE'} as HttpClientAuthenticationPluginConfig);

        expect(validValues[validValues.length - 1]).toBeFalse();
    });

    it('requires client certificate and private key together on a new configuration', () => {
        component.tlsEnabledChange(true);

        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token', clientCertificate: certificate, clientPrivateKey: privateKey}))
            .toBeTrue();
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token', clientCertificate: certificate})).toBeFalse();
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token', clientPrivateKey: privateKey})).toBeFalse();
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token', serverCertificate: certificate})).toBeTrue();
    });

    it('keeps the stored private key while the prefilled client certificate is unchanged', () => {
        create({authenticationType: 'TOKEN', clientCertificate: certificate});

        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token', clientCertificate: certificate})).toBeTrue();
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token', clientCertificate: renewedCertificate})).toBeFalse();
        expect(isValid({
            authenticationType: 'TOKEN',
            authSecret: 'token',
            clientCertificate: renewedCertificate,
            clientPrivateKey: privateKey,
        })).toBeTrue();
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token'})).toBeTrue();
    });

    it('turns the certificate toggle on only for a configuration with a certificate', () => {
        expect(component.tlsEnabled$.value).toBeFalse();

        create({authenticationType: 'TOKEN'});
        expect(component.tlsEnabled$.value).toBeFalse();

        create({authenticationType: 'TOKEN', clientCertificate: certificate});
        expect(component.tlsEnabled$.value).toBeTrue();

        create({authenticationType: 'TOKEN', serverCertificate: certificate});
        expect(component.tlsEnabled$.value).toBeTrue();
    });

    it('ignores the certificate fields while the toggle is off', () => {
        component.tlsEnabledChange(true);
        expect(isValid({authenticationType: 'TOKEN', authSecret: 'token', clientCertificate: certificate})).toBeFalse();

        component.tlsEnabledChange(false);
        expect(validValues[validValues.length - 1]).toBeTrue();
    });

    it('leaves the certificate fields out of the saved configuration while the toggle is off', () => {
        create({authenticationType: 'TOKEN', clientCertificate: certificate, serverCertificate: certificate});
        const emitted: HttpClientAuthenticationPluginConfig[] = [];
        component.configuration.subscribe(configuration => emitted.push(configuration));

        component.tlsEnabledChange(false);
        isValid({
            authenticationType: 'TOKEN',
            authSecret: 'token',
            clientCertificate: certificate,
            clientPrivateKey: privateKey,
            serverCertificate: certificate,
        });
        save$.next();

        expect(emitted).toEqual([
            {configurationTitle: 'Den Bosch gateway', authenticationType: 'TOKEN', authSecret: 'token'} as HttpClientAuthenticationPluginConfig,
        ]);
    });

    it('selects the prefilled authentication type', () => {
        create({authenticationType: 'ZGW_JWT'});

        expect(component.selectedAuthType$.value.value).toBe('ZGW_JWT');
    });

    it('emits the configuration on save only when valid', () => {
        const emitted: HttpClientAuthenticationPluginConfig[] = [];
        component.configuration.subscribe(configuration => emitted.push(configuration));
        component.tlsEnabledChange(true);

        isValid({authenticationType: 'TOKEN', clientCertificate: certificate});
        save$.next();
        isValid({authenticationType: 'TOKEN', authSecret: 'token', clientCertificate: certificate, clientPrivateKey: privateKey});
        save$.next();

        expect(emitted.length).toBe(1);
        expect(emitted[0].clientCertificate).toBe(certificate);
    });
});

describe('HttpClientAuthenticationPluginConfigurationComponent screen', () => {
    const translations = httpClientAuthenticationPluginSpecification.pluginTranslations;

    function render(language: 'nl' | 'en'): ComponentFixture<HttpClientAuthenticationPluginConfigurationComponent> {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [HttpClientAuthenticationPluginModule, TranslateModule.forRoot()],
            providers: [
                {
                    provide: PluginTranslationService,
                    useValue: {translate: (key: string) => of(translations[language][key])},
                },
            ],
        });
        const fixture = TestBed.createComponent(HttpClientAuthenticationPluginConfigurationComponent);
        fixture.componentInstance.save$ = new Subject<void>();
        fixture.componentInstance.disabled$ = of(false);
        fixture.componentInstance.pluginId = 'http-client-authentication-plugin';
        fixture.componentInstance.prefillConfiguration$ = of(null as unknown as HttpClientAuthenticationPluginConfig);
        fixture.detectChanges();
        return fixture;
    }

    function inputNames(fixture: ComponentFixture<HttpClientAuthenticationPluginConfigurationComponent>): string[] {
        return Array.from(fixture.nativeElement.querySelectorAll('v-input'))
            .map((element: Element) => element.getAttribute('name') as string);
    }

    function select(fixture: ComponentFixture<HttpClientAuthenticationPluginConfigurationComponent>, value: string): void {
        fixture.componentInstance.radioValueChange(value);
        fixture.detectChanges();
    }

    function clickTlsToggle(fixture: ComponentFixture<HttpClientAuthenticationPluginConfigurationComponent>): void {
        fixture.nativeElement.querySelector('cds-toggle button').click();
        fixture.detectChanges();
    }

    afterEach(() => TestBed.resetTestingModule());

    it('shows the fields of the chosen authentication type', () => {
        const fixture = render('en');

        select(fixture, 'BEARER');
        expect(inputNames(fixture)).toEqual(['configurationTitle', 'authSecret']);
        select(fixture, 'HEADER');
        expect(inputNames(fixture)).toEqual(['configurationTitle', 'authHeaderName', 'authSecret']);
        select(fixture, 'TOKEN');
        expect(inputNames(fixture)).toEqual(['configurationTitle', 'authSecret']);
        select(fixture, 'ZGW_JWT');
        expect(inputNames(fixture)).toEqual(['configurationTitle', 'clientId', 'authSecret']);
        select(fixture, 'NONE');
        expect(inputNames(fixture)).toEqual(['configurationTitle']);
    });

    it('shows the certificate fields only while the toggle is on', () => {
        const fixture = render('en');
        select(fixture, 'TOKEN');

        clickTlsToggle(fixture);
        expect(inputNames(fixture)).toEqual(['configurationTitle', 'authSecret', 'clientCertificate', 'clientPrivateKey', 'serverCertificate']);
        clickTlsToggle(fixture);
        expect(inputNames(fixture)).toEqual(['configurationTitle', 'authSecret']);
    });

    it('shows the certificate fields as multi-line text', () => {
        const fixture = render('en');
        clickTlsToggle(fixture);

        const textareas = Array.from(fixture.nativeElement.querySelectorAll('textarea'))
            .map((element: Element) => element.closest('v-input')?.getAttribute('name'));

        expect(textareas).toEqual(['clientCertificate', 'clientPrivateKey', 'serverCertificate']);
    });

    for (const language of ['nl', 'en'] as const) {
        it(`shows a placeholder in every field in ${language}`, () => {
            const fixture = render(language);
            clickTlsToggle(fixture);
            const t = translations[language];
            expect(t.clientCertificatePlaceholder).toMatch(/^-----BEGIN CERTIFICATE-----\n\S+\n\.\.\.\n-----END CERTIFICATE-----$/);
            expect(t.clientPrivateKeyPlaceholder).toMatch(/^-----BEGIN PRIVATE KEY-----\n\S+\n\.\.\.\n-----END PRIVATE KEY-----$/);
            const expected: Record<string, [string, string][]> = {
                HEADER: [
                    ['configurationTitle', t.configurationTitlePlaceholder],
                    ['authHeaderName', t.authHeaderNamePlaceholder],
                    ['authSecret', t.authSecretPlaceholder],
                ],
                ZGW_JWT: [
                    ['configurationTitle', t.configurationTitlePlaceholder],
                    ['clientId', t.clientIdPlaceholder],
                    ['authSecret', t.clientSecretPlaceholder],
                ],
            };

            for (const authenticationType of Object.keys(expected)) {
                select(fixture, authenticationType);
                fixture.detectChanges();

                const placeholders = Array.from(fixture.nativeElement.querySelectorAll('v-input'))
                    .map((element: Element) => [
                        element.getAttribute('name'),
                        element.querySelector('input, textarea')?.getAttribute('placeholder'),
                    ]);

                expect(placeholders).toEqual([
                    ...expected[authenticationType],
                    ['clientCertificate', t.clientCertificatePlaceholder],
                    ['clientPrivateKey', t.clientPrivateKeyPlaceholder],
                    ['serverCertificate', t.serverCertificatePlaceholder],
                ]);
            }
        });

        it(`labels every field in ${language}`, () => {
            const fixture = render(language);
            select(fixture, 'ZGW_JWT');
            clickTlsToggle(fixture);

            const text = fixture.nativeElement.textContent as string;

            for (const key of ['clientId', 'clientSecret', 'tlsEnabled', 'tlsEnabled.toggleOn', 'clientCertificate', 'clientPrivateKey', 'serverCertificate']) {
                expect(translations[language][key]).toBeTruthy();
                expect(text).toContain(translations[language][key]);
            }
        });
    }
});
