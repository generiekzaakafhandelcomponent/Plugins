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
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {BoekingType, JournaalpostOpvoerenConfig, SaldoSoort} from '../../models';
import {TranslateService} from "@ngx-translate/core";
// import {SelectItem} from "@valtimo/components";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListItem} from 'carbon-components-angular';

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

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<JournaalpostOpvoerenConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    // protected readonly saldoSoortSelectItems: Array<SelectItem> = Object.values(SaldoSoort).map(item => ({
    //     id: item,
    //     text: item,
    // }));
    protected readonly saldoSoortItems: Array<ListItem> = Object.values(SaldoSoort).map(item => ({
        content: item,
        selected: false,
    }));
    protected readonly boekingTypeItems: Array<ListItem> = Object.values(BoekingType).map(item => ({
        content: item,
        selected: false
    }));

    public pluginActionForm: FormGroup = this.fb.group({
        procesCode: this.fb.control('', Validators.required),
        referentieNummer: this.fb.control('', Validators.required),
        sleutel: this.fb.control('', Validators.required),
        boekdatum: this.fb.control('', Validators.required),
        categorie: this.fb.control('', Validators.required),
        saldoSoort: this.fb.control('', Validators.required),
        omschrijving: this.fb.control('', Validators.required),
        boekjaar: this.fb.control('', Validators.required),
        boekperiode: this.fb.control('', Validators.required),
        regels: this.fb.array([])
    });

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService,
        private fb: FormBuilder
    ) {
        this.addLine()
    }

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: JournaalpostOpvoerenConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: JournaalpostOpvoerenConfig): void {
        const valid = !!(
            formValue.procesCode &&
            formValue.referentieNummer &&
            formValue.sleutel &&
            formValue.boekdatumTijd &&
            formValue.categorie &&
            formValue.saldoSoort &&
            formValue.regels.length > 0
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
                        this.configuration.emit(formValue!);
                    }
                });
        });
    }

    submitForm(): void {
        if (this.pluginActionForm.valid) {
          console.log(this.pluginActionForm.value);
        }
    }

    get lines(): FormArray {
        return this.pluginActionForm.get('regels') as FormArray;
    }

    createLine(): FormGroup {
        return this.fb.group({
            grootboekSleutel: ['', Validators.required],
            boekingType: ['', [Validators.required]],
            omschrijving: [''],
            bedrag: [0, [Validators.required, Validators.min(0)]],
        });
    }

    addLine(): void {
        this.lines.push(this.createLine());
    }

    removeLine(index: number): void {
        this.lines.removeAt(index);
    }
}
