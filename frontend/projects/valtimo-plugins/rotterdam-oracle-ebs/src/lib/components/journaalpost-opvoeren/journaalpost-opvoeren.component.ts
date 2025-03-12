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
import {ListItem} from 'carbon-components-angular';
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

    readonly saldoSoortItems: Array<any> = Object.values(SaldoSoort).map(item => ({
        content: item.toString(),
        selected: false
    }));
    readonly boekingTypeItems: Array<ListItem> = Object.values(BoekingType).map(item => ({
        content: item.toString(),
        selected: false
    }));

    //linesBoekingTypeItems: Array<Array<ListItem>> = []

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
        this.subscribeToFormValueChanges();
        this.subscribeToDisableAndToggleFormState();
        this.subscribeToSave();
        setTimeout(() => this.prefillForm(), 150);
    }

    ngOnDestroy() {
        this.logger.debug('Journaalpost opvoeren - onDestroy');
        this._subscriptions.unsubscribe();
    }

    get lines(): FormArray {
        return this.pluginActionForm.get('regels') as FormArray;
    }

    addLine(): void {
        // add container for this specific line with a deep copy of boekingTypeItems
        //this.linesBoekingTypeItems.push(JSON.parse(JSON.stringify(this.boekingTypeItems)));
        this.lines.push(this.createLineFormGroup());
    }

    removeLine(index: number): void {
        this.lines.removeAt(index);
        // remove the lines specific boekingTypeItems container
        //this.linesBoekingTypeItems.splice(index);
    }

    private initForm() {
        this.pluginActionForm = this.fb.group({
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
                    procesCode: configuration.procesCode,
                    referentieNummer: configuration.referentieNummer,
                    sleutel: configuration.sleutel,
                    boekdatumTijd: configuration.boekdatumTijd,
                    categorie: configuration.categorie,
                    saldoSoort: this.selectedListItem(this.saldoSoortItems, configuration.saldoSoort),
                    omschrijving: configuration.omschrijving,
                    boekjaar: configuration.boekjaar,
                    boekperiode: configuration.boekperiode,
                    regels: configuration.regels.map( regel => ({
                        grootboekSleutel: regel.grootboekSleutel,
                        boekingType: this.selectedListItem(this.boekingTypeItems, regel.boekingType),
                        omschrijving: regel.omschrijving,
                        bedrag: regel.bedrag
                    }))
                });
            }
        })
    }

    private selectedListItem(listItems: ListItem[], selectedValue: string): ListItem {
        let theItem = listItems.find(item => item.content == selectedValue);
        return theItem ? { content: theItem.content, selected: true } : null;
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
                this.logger.debug('pluginActionForm.valid', this.pluginActionForm.valid);
                if (this.pluginActionForm.valid) {
                    // map form values to model
                    this.formValueChange({
                        procesCode: this.pluginActionForm.get('procesCode')?.value,
                        referentieNummer: this.pluginActionForm.get('referentieNummer')?.value,
                        sleutel: this.pluginActionForm.get('sleutel')?.value,
                        boekdatumTijd: this.pluginActionForm.get('boekdatumTijd')?.value,
                        categorie: this.pluginActionForm.get('categorie')?.value,
                        saldoSoort: this.pluginActionForm.get('saldoSoort')?.value ? (this.pluginActionForm.get('saldoSoort').value as ListItem).content as SaldoSoort : null,
                        omschrijving: this.pluginActionForm.get('omschrijving')?.value,
                        boekjaar: this.pluginActionForm.get('boekjaar')?.value,
                        boekperiode: this.pluginActionForm.get('boekperiode')?.value,
                        regels: this.lines.getRawValue().map(line => (
                            {
                                grootboekSleutel: line.grootboekSleutel,
                                boekingType: line.boekingType ? (line.boekingType as ListItem).content as BoekingType : null,
                                omschrijving: line.omschrijving,
                                bedrag: line.bedrag
                            }
                        ))
                    });
                }
            })
        );
    }

    private formValueChange(formValue: JournaalpostOpvoerenConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: JournaalpostOpvoerenConfig): void {
        this.logger.debug('formValue', formValue)
        const valid = !!(
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
        if (valid) {
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
        this.logger.debug('handleValid', 'valid', valid, 'linesValid', linesValid);
        this.valid$.next(valid && linesValid);
        this.valid.emit(valid && linesValid);
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
