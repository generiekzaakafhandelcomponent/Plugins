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
import {AdresType, FactuurKlasse, RelatieType, VerkoopfactuurOpvoerenConfig} from '../../models';
import {TranslateService} from "@ngx-translate/core";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NGXLogger} from "ngx-logger";
import {Toggle} from "carbon-components-angular";
import {EnumUtilsService} from "../../service/enum-utils.service";

@Component({
    selector: 'valtimo-rotterdam-oracle-ebs-verkoopfactuur-opvoeren',
    templateUrl: './verkoopfactuur-opvoeren.component.html',
    styleUrls: ['./verkoopfactuur-opvoeren.component.scss']
})
export class VerkoopfactuurOpvoerenComponent implements FunctionConfigurationComponent, OnInit, OnDestroy, AfterViewInit {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<VerkoopfactuurOpvoerenConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    @ViewChild('regelsViaResolverToggle') regelsViaResolverToggle: Toggle;

    private readonly formValue$ = new BehaviorSubject<VerkoopfactuurOpvoerenConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly adresTypeItems: Array<string> = Object.values(AdresType).map(item => (item.toString()));
    readonly relatieTypeItems: Array<string> = Object.values(RelatieType).map(item => (item.toString()));
    readonly factuurKlasseItems: Array<string> = Object.values(FactuurKlasse).map(item => (item.toString()));

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
        this.logger.debug('Verkoopfactuur opvoeren - onInit');
        this.initForm();
        this.prefillForm();
    }

    ngAfterViewInit(): void {
        this.regelsViaResolverToggle.checked = this.pluginActionForm.get('regelsViaResolver').getRawValue() != null
        this.subscribeToFormValueChanges();
        this.subscribeToDisableAndToggleFormState();
        this.subscribeToSave();
    }

    ngOnDestroy(): void {
        this.logger.debug('Verkoopfactuur opvoeren - onDestroy');
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

    get factuurAdresType(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresType')
    }

    get factuurAdresNaamContactpersoon(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresNaamContactpersoon')
    }

    get factuurAdresVestigingsnummerRotterdam(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresVestigingsnummerRotterdam')
    }

    get factuurAdresStraatnaam(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresStraatnaam')
    }

    get factuurAdresHuisnummer(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresHuisnummer')
    }

    get factuurAdresHuisnummertoevoeging(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresHuisnummertoevoeging')
    }

    get factuurAdresPostbus(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresPostbus')
    }

    get factuurAdresPostcode(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresPostcode')
    }

    get factuurAdresPlaatsnaam(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresPlaatsnaam')
    }

    get factuurAdresLandcode(): AbstractControl {
        return this.pluginActionForm.get('factuurAdresLandcode')
    }

    get relatieType(): AbstractControl {
        return this.pluginActionForm.get('relatieType')
    }

    get natuurlijkPersoonBsn(): AbstractControl {
        return this.pluginActionForm.get('natuurlijkPersoonBsn')
    }

    get natuurlijkPersoonAchternaam(): AbstractControl {
        return this.pluginActionForm.get('natuurlijkPersoonAchternaam')
    }

    get natuurlijkPersoonVoornamen(): AbstractControl {
        return this.pluginActionForm.get('natuurlijkPersoonVoornamen')
    }

    get nietNatuurlijkPersoonKvkNummer(): AbstractControl {
        return this.pluginActionForm.get('nietNatuurlijkPersoonKvkNummer')
    }

    get nietNatuurlijkPersoonKvkVestigingsnummer(): AbstractControl {
        return this.pluginActionForm.get('nietNatuurlijkPersoonKvkVestigingsnummer')
    }

    get nietNatuurlijkPersoonStatutaireNaam(): AbstractControl {
        return this.pluginActionForm.get('nietNatuurlijkPersoonStatutaireNaam')
    }

    private initForm() {
        this.logger.debug('Initialising Form');
        this.pluginActionForm = this.fb.group({
            pvResultVariable: this.fb.control('', Validators.required),
            procesCode: this.fb.control('', Validators.required),
            referentieNummer: this.fb.control('', Validators.required),
            factuurKlasse: this.fb.control('', Validators.required),
            factuurDatum: this.fb.control('', Validators.required),
            factuurVervaldatum: this.fb.control(''),
            factuurKenmerk: this.fb.control(''),
            factuurAdresType: this.fb.control('', Validators.required),
            factuurAdresNaamContactpersoon: this.fb.control(''),
            factuurAdresVestigingsnummerRotterdam: this.fb.control(''),
            factuurAdresStraatnaam: this.fb.control('', Validators.required),
            factuurAdresHuisnummer: this.fb.control('', Validators.required),
            factuurAdresHuisnummertoevoeging: this.fb.control(''),
            factuurAdresPostbus: this.fb.control('', Validators.required),
            factuurAdresPostcode: this.fb.control('', Validators.required),
            factuurAdresPlaatsnaam: this.fb.control('', Validators.required),
            factuurAdresLandcode: this.fb.control('', Validators.required),
            inkoopOrderReferentie: this.fb.control('', Validators.required),
            relatieType: this.fb.control('', Validators.required),
            natuurlijkPersoonBsn: this.fb.control(''),
            natuurlijkPersoonAchternaam: this.fb.control(''),
            natuurlijkPersoonVoornamen: this.fb.control(''),
            nietNatuurlijkPersoonKvkNummer: this.fb.control(''),
            nietNatuurlijkPersoonKvkVestigingsnummer: this.fb.control(''),
            nietNatuurlijkPersoonStatutaireNaam: this.fb.control(''),
            regelsViaResolverToggle: this.fb.control(''),
            regels: this.fb.array([]),
            regelsViaResolver: this.fb.control(null)
        });
        this._subscriptions.add(
            this.pluginActionForm.get('factuurAdresType').valueChanges.subscribe(value => {
                this.logger.debug('Factuur adres type changed', value);
                const factuurAdresType = this.toAdresType(value);
                if (factuurAdresType == AdresType.LOCATIE) {
                    this.factuurAdresPostbus.patchValue('')
                } else if (factuurAdresType == AdresType.POSTBUS) {
                    this.factuurAdresStraatnaam.patchValue('')
                    this.factuurAdresHuisnummer.patchValue('')
                    this.factuurAdresHuisnummertoevoeging.patchValue('')
                } else {

                }
            })
        )
        this._subscriptions.add(
            this.pluginActionForm.get('relatieType').valueChanges.subscribe(value => {
                this.logger.debug('Relatie type changed', value);
                const relatieType = this.toRelatieType(value);
                if (relatieType == RelatieType.NATUURLIJK_PERSOON) {
                    this.nietNatuurlijkPersoonKvkNummer.patchValue('')
                    this.nietNatuurlijkPersoonKvkVestigingsnummer.patchValue('')
                    this.nietNatuurlijkPersoonStatutaireNaam.patchValue('')
                } else if (relatieType == RelatieType.NIET_NATUURLIJK_PERSOON) {
                    this.natuurlijkPersoonBsn.patchValue('')
                    this.natuurlijkPersoonAchternaam.patchValue('')
                    this.natuurlijkPersoonVoornamen.patchValue('')
                } else {
                    this.nietNatuurlijkPersoonStatutaireNaam.patchValue('')
                }
            })
        )
    }

    private createLineFormGroup(): FormGroup {
        this.logger.debug('Create Line FormGroup');
        return this.fb.group({
            hoeveelheid: this.fb.control('', Validators.required),
            tarief: this.fb.control('', Validators.required),
            btwPercentage: this.fb.control(null, Validators.required),
            grootboekSleutel: this.fb.control(''),
            bronSleutel: this.fb.control(''),
            omschrijving: this.fb.control('')
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
                        factuurKlasse: this.fromFactuurKlasse(configuration.factuurKlasse),
                        factuurDatum: configuration.factuurDatum,
                        factuurVervaldatum: configuration.factuurVervaldatum,
                        factuurKenmerk: configuration.factuurKenmerk,
                        factuurAdresType:  configuration.factuurAdresType,
                        inkoopOrderReferentie: configuration.inkoopOrderReferentie,
                        relatieType: configuration.relatieType,
                        regels: (configuration.regels != undefined) ? configuration.regels.map( regel => ({
                            hoeveelheid: regel.hoeveelheid,
                            tarief: regel.tarief,
                            btwPercentage: regel.btwPercentage,
                            grootboekSleutel: regel.grootboekSleutel,
                            bronSleutel: regel.bronSleutel,
                            omschrijving: regel.omschrijving
                        })) : null,
                        regelsViaResolver: configuration.regelsViaResolver
                    });
                    this.patchFactuurAdres(configuration)
                    this.patchRelatie(configuration)
                }
            })
        )
    }

    private patchFactuurAdres(configuration: VerkoopfactuurOpvoerenConfig) {
        const adresType = this.toAdresType(configuration.factuurAdresType)
        if (adresType == AdresType.LOCATIE || configuration.factuurAdresLocatie != undefined) {
             this.pluginActionForm.patchValue({
                factuurAdresNaamContactpersoon:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.naamContactpersoon : null,
                factuurAdresVestigingsnummerRotterdam:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.vestigingsnummerRotterdam : null,
                factuurAdresStraatnaam:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.straatnaam : null,
                factuurAdresHuisnummer:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.huisnummer : null,
                factuurAdresHuisnummertoevoeging:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.huisnummertoevoeging : null,
                factuurAdresPostcode:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.postcode : null,
                factuurAdresPlaatsnaam:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.plaatsnaam : null,
                factuurAdresLandcode:
                    (configuration.factuurAdresLocatie != undefined) ? configuration.factuurAdresLocatie.landcode : null
             })
        }
        if (adresType == AdresType.POSTBUS || configuration.factuurAdresPostbus != undefined) {
            this.pluginActionForm.patchValue({
                factuurAdresNaamContactpersoon:
                    (configuration.factuurAdresPostbus != undefined) ? configuration.factuurAdresPostbus.naamContactpersoon : null,
                factuurAdresVestigingsnummerRotterdam:
                    (configuration.factuurAdresPostbus != undefined) ? configuration.factuurAdresPostbus.vestigingsnummerRotterdam : null,
                factuurAdresPostbus:
                    (configuration.factuurAdresPostbus != undefined) ? configuration.factuurAdresPostbus.postbus : null,
                factuurAdresPostcode:
                    (configuration.factuurAdresPostbus != undefined) ? configuration.factuurAdresPostbus.postcode : null,
                factuurAdresPlaatsnaam:
                    (configuration.factuurAdresPostbus != undefined) ? configuration.factuurAdresPostbus.plaatsnaam : null,
                factuurAdresLandcode:
                    (configuration.factuurAdresPostbus != undefined) ? configuration.factuurAdresPostbus.landcode : null
            })
        }
    }

    private patchRelatie(configuration: VerkoopfactuurOpvoerenConfig) {
        const relatieType = this.toRelatieType(configuration.relatieType)
        if (relatieType == RelatieType.NATUURLIJK_PERSOON || configuration.natuurlijkPersoon != undefined) {
            this.pluginActionForm.patchValue({
                natuurlijkPersoonBsn:
                    (configuration.natuurlijkPersoon != undefined) ? configuration.natuurlijkPersoon.bsn : null,
                natuurlijkPersoonAchternaam:
                    (configuration.natuurlijkPersoon != undefined) ? configuration.natuurlijkPersoon.achternaam : null,
                natuurlijkPersoonVoornamen:
                    (configuration.natuurlijkPersoon != undefined) ? configuration.natuurlijkPersoon.voornamen : null,
            })
        }
        if (relatieType == RelatieType.NIET_NATUURLIJK_PERSOON || configuration.nietNatuurlijkPersoon != undefined) {
            this.pluginActionForm.patchValue({
                nietNatuurlijkPersoonKvkNummer:
                    (configuration.nietNatuurlijkPersoon != undefined) ? configuration.nietNatuurlijkPersoon.kvkNummer : null,
                nietNatuurlijkPersoonKvkVestigingsnummer:
                    (configuration.nietNatuurlijkPersoon != undefined) ? configuration.nietNatuurlijkPersoon.kvkVestigingsnummer : null,
                nietNatuurlijkPersoonStatutaireNaam:
                    (configuration.nietNatuurlijkPersoon != undefined) ? configuration.nietNatuurlijkPersoon.statutaireNaam : null,
            })
        }
    }

    private subscribeToDisableAndToggleFormState(): void {
        this.logger.debug('Subscribing to forms disabled state');
        this._subscriptions.add(
            this.disabled$.subscribe(isDisabled =>
                this.updateInputState(isDisabled)
            )
        )
    }

    private subscribeToFormValueChanges(): void {
        this.logger.debug('Subscribing to form value changes');
        this._subscriptions.add(
            this.pluginActionForm.valueChanges.subscribe(formValue => {
                this.logger.debug('pluginActionForm.rawValue', this.pluginActionForm.getRawValue());

                let newFormValue: VerkoopfactuurOpvoerenConfig = {
                    pvResultVariable: formValue.pvResultVariable,
                    procesCode: formValue.procesCode,
                    referentieNummer: formValue.referentieNummer,
                    factuurKlasse: this.toFactuurKlasse(formValue.factuurKlasse),
                    factuurDatum: formValue.factuurDatum,
                    factuurVervaldatum: (formValue.factuurVervaldatum != undefined) ? formValue.factuurVervaldatum : null,
                    factuurKenmerk: (formValue.factuurKenmerk != undefined) ? formValue.factuurKenmerk : null,
                    factuurAdresType: this.toAdresType(formValue.factuurAdresType),
                    inkoopOrderReferentie: formValue.inkoopOrderReferentie,
                    relatieType: this.toRelatieType(formValue.relatieType),
                    regels: (formValue.regels != undefined) ? formValue.regels.map(regel => ({
                        hoeveelheid: regel.hoeveelheid,
                        tarief: regel.tarief,
                        btwPercentage: regel.btwPercentage,
                        grootboekSleutel: regel.grootboekSleutel,
                        bronSleutel: regel.bronSleutel,
                        omschrijving: regel.omschrijving
                    })) : null,
                    regelsViaResolver: (formValue.regelsViaResolver != undefined) ? formValue.regelsViaResolver : null
                }
                // map factuur adres
                if (newFormValue.factuurAdresType == AdresType.LOCATIE) {
                    newFormValue = {
                        factuurAdresLocatie: {
                            naamContactpersoon: formValue.factuurAdresNaamContactpersoon,
                            vestigingsnummerRotterdam: formValue.factuurAdresVestigingsnummerRotterdam,
                            straatnaam: formValue.factuurAdresStraatnaam,
                            huisnummer: formValue.factuurAdresHuisnummer,
                            huisnummertoevoeging: formValue.factuurAdresHuisnummertoevoeging,
                            postcode: formValue.factuurAdresPostcode,
                            plaatsnaam: formValue.factuurAdresPlaatsnaam,
                            landcode: formValue.factuurAdresLandcode
                        },
                        ...newFormValue
                    }
                } else if (newFormValue.factuurAdresType == AdresType.POSTBUS) {
                    newFormValue = {
                        factuurAdresPostbus: {
                            naamContactpersoon: formValue.factuurAdresNaamContactperson,
                            vestigingsnummerRotterdam: formValue.factuurAdresVestigingsnummerRotterdam,
                            postbus: formValue.factuurAdresPostbus,
                            postcode: formValue.factuurAdresPostcode,
                            plaatsnaam: formValue.factuurAdresPlaatsnaam,
                            landcode: formValue.factuurAdresLandcode,
                        },
                        ...newFormValue
                    }
                }
                // map relatie
                if (newFormValue.relatieType == RelatieType.NATUURLIJK_PERSOON) {
                    newFormValue = {
                        natuurlijkPersoon: {
                            bsn: formValue.natuurlijkPersoonBsn,
                            achternaam: formValue.natuurlijkPersoonAchternaam,
                            voornamen: formValue.natuurlijkPersoonVoornamen
                        },
                        ...newFormValue
                    }
                } else if (newFormValue.relatieType == RelatieType.NIET_NATUURLIJK_PERSOON) {
                    newFormValue = {
                        nietNatuurlijkPersoon: {
                            kvkNummer: formValue.nietNatuurlijkPersoonKvkNummer,
                            kvkVestigingsnummer: formValue.nietNatuurlijkPersoonKvkVestigingsnummer,
                            statutaireNaam: formValue.nietNatuurlijkPersoonStatutaireNaam
                        },
                        ...newFormValue
                    }
                }
                // map form values to model
                this.formValueChange(newFormValue);
            })
        );
    }

    private fromFactuurKlasse(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            return this.enumSvc.getEnumValue(FactuurKlasse, value);
        }
    }

    private toFactuurKlasse(value: string): string | undefined {
        if (this.isValueResolverPrefix(value)) {
            return value;
        } else {
            return this.enumSvc.getEnumKey(FactuurKlasse, value);
        }
    }

    private toAdresType(value: string): AdresType | undefined {
        return Object.values(AdresType).includes(value as AdresType) ? (value as AdresType) : undefined;
    }

    private toRelatieType(value: string): RelatieType | undefined {
        return Object.values(RelatieType).includes(value as RelatieType) ? (value as RelatieType) : undefined;
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

    private formValueChange(formValue: VerkoopfactuurOpvoerenConfig): void {
        this.logger.debug('formValueChange', formValue);
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: VerkoopfactuurOpvoerenConfig): void {
        this.logger.debug('handleValid', formValue);

        const genericFieldsValid = !!(
            formValue.pvResultVariable &&
            formValue.procesCode &&
            formValue.referentieNummer &&
            formValue.factuurKlasse &&
            formValue.factuurDatum &&
            formValue.factuurAdresType &&
            (
                (
                    formValue.factuurAdresType == AdresType.LOCATIE &&
                    formValue.factuurAdresLocatie.straatnaam &&
                    formValue.factuurAdresLocatie.huisnummer &&
                    formValue.factuurAdresLocatie.postcode &&
                    formValue.factuurAdresLocatie.plaatsnaam &&
                    formValue.factuurAdresLocatie.landcode
                )
                ||
                (
                    formValue.factuurAdresType == AdresType.POSTBUS &&
                    formValue.factuurAdresPostbus.postbus &&
                    formValue.factuurAdresPostbus.postcode &&
                    formValue.factuurAdresPostbus.plaatsnaam &&
                    formValue.factuurAdresPostbus.landcode
                )
            ) &&
            formValue.inkoopOrderReferentie &&
            formValue.relatieType &&
            (
                (
                    formValue.relatieType == RelatieType.NATUURLIJK_PERSOON &&
                    formValue.natuurlijkPersoon.bsn &&
                    formValue.natuurlijkPersoon.voornamen &&
                    formValue.natuurlijkPersoon.achternaam
                )
                ||
                (
                    formValue.relatieType == RelatieType.NIET_NATUURLIJK_PERSOON &&
                    formValue.nietNatuurlijkPersoon.kvkNummer &&
                    formValue.nietNatuurlijkPersoon.kvkVestigingsnummer &&
                    formValue.nietNatuurlijkPersoon.statutaireNaam
                )
            )
            &&
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
                        formValue.regels[i].hoeveelheid &&
                        formValue.regels[i].tarief &&
                        formValue.regels[i].btwPercentage &&
                        ( formValue.regels[i].grootboekSleutel || formValue.regels[i].bronSleutel )
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

    protected readonly RelatieType = RelatieType;
    protected readonly AdresType = AdresType;
}
