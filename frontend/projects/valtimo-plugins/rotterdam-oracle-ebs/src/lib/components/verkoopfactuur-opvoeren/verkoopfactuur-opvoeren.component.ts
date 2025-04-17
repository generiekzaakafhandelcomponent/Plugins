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
import {FactuurKlasse, VerkoopfactuurOpvoerenConfig} from '../../models';
import {TranslateService} from "@ngx-translate/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NGXLogger} from "ngx-logger";

@Component({
    selector: 'valtimo-rotterdam-oracle-ebs-verkoopfactuur-opvoeren',
    templateUrl: './verkoopfactuur-opvoeren.component.html',
    styleUrls: ['./verkoopfactuur-opvoeren.component.scss']
})
export class VerkoopfactuurOpvoerenComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<VerkoopfactuurOpvoerenConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private readonly formValue$ = new BehaviorSubject<VerkoopfactuurOpvoerenConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly factuurKlasseItems: Array<string> = Object.values(FactuurKlasse).map(item => (item.toString()));

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
        this.logger.debug('Verkoopfactuur opvoeren - onInit');
        this.initForm();
        this.prefillForm();
        this.subscribeToFormValueChanges();
        this.subscribeToDisableAndToggleFormState();
        this.subscribeToSave();
    }

    ngOnDestroy() {
        this.logger.debug('Verkoopfactuur opvoeren - onDestroy');
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
            factuurKlasse: this.fb.control('', Validators.required),
            inkoopOrderReferentie: this.fb.control('', Validators.required),
            natuurlijkPersoonAchternaam: this.fb.control('', Validators.required),
            natuurlijkPersoonVoornamen: this.fb.control('', Validators.required),
            nietNatuurlijkPersoonStatutaireNaam: this.fb.control(null, Validators.required),
            regels: this.fb.array([], Validators.required)
        });
    }

    private createLineFormGroup(): FormGroup {
        this.logger.debug('createLineFormGroup');
        return this.fb.group({
            hoeveelheid: this.fb.control('', Validators.required),
            tarief: this.fb.control('', Validators.required),
            btwPercentage: this.fb.control(null, Validators.required),
            grootboekSleutel: this.fb.control('', Validators.required),
            omschrijving: this.fb.control(''),
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
                    factuurKlasse: configuration.factuurKlasse,
                    inkoopOrderReferentie: configuration.inkoopOrderReferentie,
                    natuurlijkPersoonAchternaam: configuration.natuurlijkPersoon.achternaam,
                    natuurlijkPersoonVoornamen: configuration.natuurlijkPersoon.voornamen,
                    nietNatuurlijkPersoonStatutaireNaam: configuration.nietNatuurlijkPersoon.statutaireNaam,
                    regels: configuration.regels.map( regel => ({
                        hoeveelheid: regel.hoeveelheid,
                        tarief: regel.tarief,
                        btwPercentage: regel.btwPercentage,
                        grootboekSleutel: regel.grootboekSleutel,
                        omschrijving: regel.omschrijving
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

                this.logger.debug('pluginActionForm.rawValue', this.pluginActionForm.getRawValue())

                // map form values to model
                this.formValueChange({
                    pvResultContainer: formValue.pvResultContainer,
                    procesCode: formValue.procesCode,
                    referentieNummer: formValue.referentieNummer,
                    factuurKlasse: this.toFactuurKlasse(formValue.factuurKlasse),
                    inkoopOrderReferentie: formValue.inkoopOrderReferentie,
                    natuurlijkPersoon: {
                        achternaam: formValue.natuurlijkPersoonAchternaam,
                        voornamen: formValue.natuurlijkPersoonVoornamen
                    },
                    nietNatuurlijkPersoon: {
                        statutaireNaam: formValue.nietNatuurlijkPersoonStatutaireNaam
                    },
                    regels: formValue.regels.map(regel => ({
                        hoeveelheid: regel.hoeveelheid,
                        tarief: regel.tarief,
                        btwPercentage: regel.btwPercentage,
                        grootboekSleutel: regel.grootboekSleutel,
                        omschrijving: regel.omschrijving
                    }))
                });
            })
        );
    }

    private toFactuurKlasse(value: string): FactuurKlasse | undefined {
        return Object.values(FactuurKlasse).includes(value as FactuurKlasse) ? (value as FactuurKlasse) : undefined;
    }

    private formValueChange(formValue: VerkoopfactuurOpvoerenConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: VerkoopfactuurOpvoerenConfig): void {
        this.logger.debug('handleValid', formValue);

        const genericFieldsValid = !!(
            formValue.pvResultContainer &&
            formValue.procesCode &&
            formValue.referentieNummer &&
            formValue.factuurKlasse &&
            formValue.inkoopOrderReferentie &&
            formValue.natuurlijkPersoon.voornamen &&
            formValue.natuurlijkPersoon.achternaam &&
            formValue.nietNatuurlijkPersoon.statutaireNaam &&
            formValue.regels.length > 0
        );
        // validate lines
        let linesValid = false
        if (genericFieldsValid) {
            for (let i = 0; i < formValue.regels.length; i++) {
                linesValid = !!(
                    formValue.regels[i].hoeveelheid &&
                    formValue.regels[i].tarief &&
                    formValue.regels[i].btwPercentage &&
                    formValue.regels[i].grootboekSleutel
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
