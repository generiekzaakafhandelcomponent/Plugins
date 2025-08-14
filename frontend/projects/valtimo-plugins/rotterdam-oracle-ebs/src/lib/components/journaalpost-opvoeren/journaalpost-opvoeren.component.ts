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
    FunctionConfigurationComponent,
    FunctionConfigurationData,
    PluginManagementService,
    PluginTranslationService
} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {BoekingType, Grootboek, JournaalpostOpvoerenConfig, SaldoSoort} from '../../models';
import {TranslateService} from "@ngx-translate/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NGXLogger} from "ngx-logger";
import {Toggle} from "carbon-components-angular";
import {EnumUtilsService} from "../../service/enum-utils.service";

@Component({
    selector: 'valtimo-rotterdam-oracle-ebs-journaalpost-opvoeren',
    templateUrl: './journaalpost-opvoeren.component.html',
    styleUrl: './journaalpost-opvoeren.component.scss'
})
export class JournaalpostOpvoerenComponent implements FunctionConfigurationComponent, OnInit, OnDestroy, AfterViewInit {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<JournaalpostOpvoerenConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    @ViewChild('regelsViaResolverToggle') regelsViaResolverToggle: Toggle;

    private readonly formValue$ = new BehaviorSubject<JournaalpostOpvoerenConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly saldoSoortItems: Array<string> = Object.values(SaldoSoort).map(item => (item.toString()));
    readonly grootboekItems: Array<string> = Object.values(Grootboek).map(item => (item.toString()));
    readonly boekingTypeItems: Array<string> = Object.values(BoekingType).map(item => (item.toString()));

    public pluginActionForm: FormGroup;

    private readonly _subscriptions = new Subscription();

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService,
        private readonly logger: NGXLogger,
        private fb: FormBuilder,
        private enumSvc: EnumUtilsService
    ) { }

    ngOnInit(): void {
        this.logger.debug('Journaalpost opvoeren - onInit');
        this.initForm();
        this.prefillForm();
    }

    ngAfterViewInit(): void {
        this.regelsViaResolverToggle.checked = this.pluginActionForm.get('regelsViaResolver').getRawValue() != null
        this.subscribeToFormValueChanges();
        this.subscribeToDisableAndToggleFormState();
        this.subscribeToSave();
    }

    ngOnDestroy() {
        this.logger.debug('Journaalpost opvoeren - onDestroy');
        this._subscriptions.unsubscribe();
    }

    onCheckedChanged(checked: boolean): void {
        this.logger.debug('toggle changed to', checked)
        this.pluginActionForm.get('regelsViaResolverToggle')?.setValue(checked);
        if (checked == true) {
            this.lines.clear();
            this.pluginActionForm.get('regels')?.setValue([]);
        } else {
            this.pluginActionForm.get('regelsViaResolver')?.setValue(null);
        }
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
            pvResultVariable: this.fb.control('', Validators.required),
            procesCode: this.fb.control('', Validators.required),
            referentieNummer: this.fb.control('', Validators.required),
            sleutel: this.fb.control('', Validators.required),
            boekdatumTijd: this.fb.control('', Validators.required),
            categorie: this.fb.control('', Validators.required),
            saldoSoort: this.fb.control(null, Validators.required),
            omschrijving: this.fb.control('', Validators.required),
            grootboek: this.fb.control(null, Validators.required),
            boekjaar: this.fb.control('', Validators.required),
            boekperiode: this.fb.control('', Validators.required),
            regelsViaResolverToggle: this.fb.control(''),
            regels: this.fb.array([], Validators.required),
            regelsViaResolver: this.fb.control(null)
        });
    }

    private createLineFormGroup(): FormGroup {
        this.logger.debug('Create Line FormGroup');
        return this.fb.group({
            grootboekSleutel: this.fb.control('', Validators.required),
            bronSleutel: this.fb.control(''),
            boekingType: this.fb.control(null, Validators.required),
            omschrijving: this.fb.control(''),
            bedrag: this.fb.control('', Validators.required),
        });
    }

    private prefillForm(): void {
        this._subscriptions.add(
            this.prefillConfiguration$.subscribe(configuration => {
                if (configuration) {
                    this.logger.debug('Prefilling form - configuration', configuration);
                    // add lines
                    if (configuration.regels != undefined) {
                        configuration.regels.forEach( () => this.addLine());
                    }
                    // prefill form values
                    this.pluginActionForm.patchValue({
                        pvResultVariable: configuration.pvResultVariable,
                        procesCode: configuration.procesCode,
                        referentieNummer: configuration.referentieNummer,
                        sleutel: configuration.sleutel,
                        boekdatumTijd: configuration.boekdatumTijd,
                        categorie: configuration.categorie,
                        saldoSoort: this.fromSaldoSoort(configuration.saldoSoort),
                        omschrijving: configuration.omschrijving,
                        grootboek: this.fromGrootboek(configuration.grootboek),
                        boekjaar: configuration.boekjaar,
                        boekperiode: configuration.boekperiode,
                        regels: (configuration.regels != undefined) ? configuration?.regels?.map( regel => ({
                            grootboekSleutel: regel.grootboekSleutel,
                            bronSleutel: regel.bronSleutel,
                            boekingType: this.fromBoekingType(regel.boekingType),
                            omschrijving: regel.omschrijving,
                            bedrag: regel.bedrag
                        })) : null,
                        regelsViaResolver: configuration.regelsViaResolver
                    });
                }
            })
        )
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
                    pvResultVariable: formValue.pvResultVariable,
                    procesCode: formValue.procesCode,
                    referentieNummer: formValue.referentieNummer,
                    sleutel: formValue.sleutel,
                    boekdatumTijd: formValue.boekdatumTijd,
                    categorie: formValue.categorie,
                    saldoSoort: this.toSaldoSoort(formValue.saldoSoort),
                    omschrijving: formValue.omschrijving,
                    grootboek: this.toGrootboek(formValue.grootboek),
                    boekjaar: formValue.boekjaar,
                    boekperiode: formValue.boekperiode,
                    regels: (formValue.regels != undefined) ? formValue.regels.map(regel => ({
                        grootboekSleutel: regel.grootboekSleutel,
                        bronSleutel: regel.bronSleutel,
                        boekingType: this.toBoekingType(regel.boekingType),
                        omschrijving: regel.omschrijving,
                        bedrag: regel.bedrag
                    })) : null,
                    regelsViaResolver: (formValue.regelsViaResolver != undefined) ? formValue.regelsViaResolver : null
                });
            })
        );
    }

    private fromSaldoSoort(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            return this.enumSvc.getEnumValue(SaldoSoort, value);
        }
    }

    private toSaldoSoort(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            return this.enumSvc.getEnumKey(SaldoSoort, value);
        }
    }

    private fromGrootboek(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            // If a numeric-like key (e.g., "100") is provided, treat it as "_100"
            const normalizedKey = (/^\d/.test(value) && !value.startsWith('_')) ? `_${value}` : value;
            return this.enumSvc.getEnumValue(Grootboek, normalizedKey);
        }
    }

    private toGrootboek(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            // If a numeric-like key, strip _ prefix from the key
            return this.enumSvc.getEnumKey(Grootboek, value).replace(/^_/, '');
        }
    }

    private fromBoekingType(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            return this.enumSvc.getEnumValue(BoekingType, value);
        }
    }

    private toBoekingType(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            return this.enumSvc.getEnumKey(BoekingType, value);
        }
    }

    private isValueResolverPrefix(value: string): boolean {
        return (
            value.startsWith('case:')
            ||
            value.startsWith('doc:')
            ||
            value.startsWith('pv:')
        )
    }

    private formValueChange(formValue: JournaalpostOpvoerenConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: JournaalpostOpvoerenConfig): void {
        this.logger.debug('handleValid', formValue);

        const genericFieldsValid = !!(
            formValue.pvResultVariable &&
            formValue.procesCode &&
            formValue.referentieNummer &&
            formValue.sleutel &&
            formValue.boekdatumTijd &&
            formValue.categorie &&
            formValue.saldoSoort &&
            (
                (this.regelsViaResolverToggle.checked == true && formValue.regelsViaResolver)
                ||
                (this.regelsViaResolverToggle.checked == false && formValue.regels.length > 0)
            )
        );
        // validate lines
        let linesValid = false
        if (this.regelsViaResolverToggle.checked) {
            linesValid = formValue.regelsViaResolver != undefined
        } else {
            if (genericFieldsValid) {
                for (let i = 0; i < formValue.regels.length; i++) {
                    linesValid = !!(
                        (formValue.regels[i].grootboekSleutel || formValue.regels[i].bronSleutel) &&
                        formValue.regels[i].boekingType &&
                        formValue.regels[i].bedrag
                    )
                    if (!linesValid)
                        break;
                }
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
                            this.configuration.emit({
                                regels: this.regelsViaResolverToggle.checked ? null : formValue.regels,
                                regelsViaResolver: this.regelsViaResolverToggle.checked ? formValue.regelsViaResolver : null,
                                ...formValue
                            }!);
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
