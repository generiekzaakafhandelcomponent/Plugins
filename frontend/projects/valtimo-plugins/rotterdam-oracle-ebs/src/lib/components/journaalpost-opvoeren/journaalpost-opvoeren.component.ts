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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
    FunctionConfigurationComponent,
    FunctionConfigurationData,
    PluginManagementService,
    PluginTranslationService
} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {BoekingType, JournaalpostOpvoerenConfig, SaldoSoort} from '../../models';
import {TranslateService} from "@ngx-translate/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NGXLogger} from "ngx-logger";

@Component({
    selector: 'valtimo-rotterdam-oracle-ebs-journaalpost-opvoeren',
    templateUrl: './journaalpost-opvoeren.component.html',
    styleUrl: './journaalpost-opvoeren.component.scss'
})
export class JournaalpostOpvoerenComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<JournaalpostOpvoerenConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private readonly formValue$ = new BehaviorSubject<JournaalpostOpvoerenConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly saldoSoortItems: Array<string> = Object.values(SaldoSoort).map(item => (item.toString()));
    readonly boekingTypeItems: Array<string> = Object.values(BoekingType).map(item => (item.toString()));

    public pluginActionForm: FormGroup;

    private readonly _subscriptions = new Subscription();

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService,
        private readonly logger: NGXLogger,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.logger.debug('Journaalpost opvoeren - onInit');
        this.initForm();
        this.prefillForm();
        this.subscribeToFormValueChanges();
        this.subscribeToDisableAndToggleFormState();
        this.subscribeToSave();
    }

    ngOnDestroy() {
        this.logger.debug('Journaalpost opvoeren - onDestroy');
        this._subscriptions.unsubscribe();
    }

    get lines(): FormArray {
        return this.pluginActionForm.get('regels') as FormArray;
    }

    addLine(): void {
        this.lines.push(this.createLineFormGroup());
    }

    removeLine(index: number): void {
        this.lines.removeAt(index);
    }

    private initForm() {
        this.logger.debug('initForm');
        this.pluginActionForm = this.fb.group({
            pvResultContainer: this.fb.control('', Validators.required),
            procesCode: this.fb.control('', Validators.required),
            referentieNummer: this.fb.control('', Validators.required),
            sleutel: this.fb.control('', Validators.required),
            boekdatumTijd: this.fb.control('', Validators.required),
            categorie: this.fb.control('', Validators.required),
            saldoSoort: this.fb.control(null, Validators.required),
            omschrijving: this.fb.control('', Validators.required),
            boekjaar: this.fb.control('', Validators.required),
            boekperiode: this.fb.control('', Validators.required),
            regels: this.fb.array([], Validators.required)
        });
    }

    private createLineFormGroup(): FormGroup {
        this.logger.debug('createLineFormGroup');
        return this.fb.group({
            grootboekSleutel: this.fb.control('', Validators.required),
            boekingType: this.fb.control(null, Validators.required),
            omschrijving: this.fb.control(''),
            bedrag: this.fb.control('', Validators.required),
        });
    }

    private prefillForm(): void {
        this.prefillConfiguration$.subscribe(configuration => {
            if (configuration) {
                this.logger.debug('Prefilling form - configuration', configuration);
                // add lines
                configuration.regels.forEach( () => this.addLine());
                // prefill form values
                this.pluginActionForm.patchValue({
                    pvResultContainer: configuration.pvResultContainer,
                    procesCode: configuration.procesCode,
                    referentieNummer: configuration.referentieNummer,
                    sleutel: configuration.sleutel,
                    boekdatumTijd: configuration.boekdatumTijd,
                    categorie: configuration.categorie,
                    saldoSoort: configuration.saldoSoort,
                    omschrijving: configuration.omschrijving,
                    boekjaar: configuration.boekjaar,
                    boekperiode: configuration.boekperiode,
                    regels: configuration.regels.map( regel => ({
                        grootboekSleutel: regel.grootboekSleutel,
                        boekingType: regel.boekingType,
                        omschrijving: regel.omschrijving,
                        bedrag: regel.bedrag
                    }))
                });
            }
        })
    }

    private subscribeToDisableAndToggleFormState(): void {
        this._subscriptions.add(
            this.disabled$.subscribe(isDisabled =>
                this.updateInputState(isDisabled)
            )
        )
    }

    private subscribeToFormValueChanges(): void {
        this._subscriptions.add(
            this.pluginActionForm.valueChanges.subscribe(formValue => {
                // map form values to model
                this.formValueChange({
                    pvResultContainer: formValue.pvResultContainer,
                    procesCode: formValue.procesCode,
                    referentieNummer: formValue.referentieNummer,
                    sleutel: formValue.sleutel,
                    boekdatumTijd: formValue.boekdatumTijd,
                    categorie: formValue.categorie,
                    saldoSoort: this.toSaldoSoort(formValue.saldoSoort),
                    omschrijving: formValue.omschrijving,
                    boekjaar: formValue.boekjaar,
                    boekperiode: formValue.boekperiode,
                    regels: formValue.regels.map(regel => ({
                        grootboekSleutel: regel.grootboekSleutel,
                        boekingType: this.toBoekingType(regel.boekingType),
                        omschrijving: regel.omschrijving,
                        bedrag: regel.bedrag
                    }))
                });
            })
        );
    }

    private toSaldoSoort(value: string): SaldoSoort | undefined {
        return Object.values(SaldoSoort).includes(value as SaldoSoort) ? (value as SaldoSoort) : undefined;
    }

    private toBoekingType(value: string): BoekingType | undefined {
        return Object.values(BoekingType).includes(value as BoekingType) ? (value as BoekingType) : undefined;
    }

    private formValueChange(formValue: JournaalpostOpvoerenConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: JournaalpostOpvoerenConfig): void {
        const genericFieldsValid = !!(
            formValue.pvResultContainer &&
            formValue.procesCode &&
            formValue.referentieNummer &&
            formValue.sleutel &&
            formValue.boekdatumTijd &&
            formValue.categorie &&
            formValue.saldoSoort &&
            formValue.regels.length > 0
        );
        // validate lines
        let linesValid = false
        if (genericFieldsValid) {
            for (let i = 0; i < formValue.regels.length; i++) {
                linesValid = !!(
                    formValue.regels[i].grootboekSleutel &&
                    formValue.regels[i].boekingType &&
                    formValue.regels[i].bedrag
                )
                if (!linesValid)
                    break;
            }
        }
        this.logger.debug('handleValid', 'genericFieldsValid', genericFieldsValid, 'linesValid', linesValid);
        this.valid$.next(genericFieldsValid && linesValid);
        this.valid.emit(genericFieldsValid && linesValid);
    }

    private subscribeToSave(): void {
        this._subscriptions.add(
            this.save$?.subscribe(save => {
                combineLatest([this.formValue$, this.valid$])
                    .pipe(take(1))
                    .subscribe(([formValue, valid]) => {
                        if (valid) {
                            this.configuration.emit(formValue!);
                        }
                    });
                }
            )
        );
    }

    private updateInputState(isDisabled: boolean): void {
        if (isDisabled) {
            this.pluginActionForm.disable();
        } else {
            this.pluginActionForm.enable();
        }
    }
}
