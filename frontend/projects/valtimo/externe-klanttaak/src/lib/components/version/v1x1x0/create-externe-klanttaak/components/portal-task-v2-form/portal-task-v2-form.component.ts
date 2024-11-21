/*!
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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
import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {RadioValue, SelectItem} from '@valtimo/components';
import {Toggle} from 'carbon-components-angular';
import {
    CreatePortalTaskConfig,
    CreateTaskV2Config,
    OtherReceiverSoort,
    TaakKoppelingRegistratie,
    TaakSoort,
    FormulierSoort,
    ReceiverSource
} from "../../../../../../models";
import {PluginTranslationService} from "@valtimo/plugin";

@Component({
  selector: 'valtimo-portal-task-v2-form',
  templateUrl: './portal-task-v2-form.component.html',
  styleUrl: './portal-task-v2-form.component.scss',
})
export class PortalTaskV2FormComponent {
  @Input({required: true}) disabled$: Observable<boolean>;
  @Input({required: true}) pluginId: string;
  @Input() prefillConfiguration$: Observable<CreatePortalTaskConfig>;
  @Output() readonly value$ = new BehaviorSubject<CreateTaskV2Config | null>(null);
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('verloopdatumVanToepassing') verloopdatumVanToepassing: Toggle;
  @ViewChild('koppelingVanToepassing') koppelingVanToepassing: Toggle;
  protected readonly formValue$ = new BehaviorSubject<CreateTaskV2Config | null>(null);
  protected readonly TAAK_SOORT_OPTIONS: string[] = Object.values(TaakSoort);
  protected readonly taakSoortItems$ = this.selectItemsToTranslatedItems(this.TAAK_SOORT_OPTIONS);
  protected readonly FORMULIER_SOORT_OPTIONS: string[] = Object.values(FormulierSoort);
  protected readonly formulierSoortItems$ = this.selectItemsToTranslatedItems(
    this.FORMULIER_SOORT_OPTIONS
  );
  readonly RECEIVER_OPTIONS: string[] = Object.values(ReceiverSource);
  readonly receiverSelectItems$ = this.selectItemsToTranslatedItems(this.RECEIVER_OPTIONS);
  readonly OTHER_RECEIVER_OPTIONS: string[] = Object.values(OtherReceiverSoort);
  readonly otherReceiverSelectItems$ = this.selectItemsToTranslatedItems(
    this.OTHER_RECEIVER_OPTIONS
  );
  readonly KOPPELING_ITEMS: string[] = Object.values(TaakKoppelingRegistratie);
  readonly koppelingRegistratieItems$ = this.selectItemsToTranslatedItems(this.KOPPELING_ITEMS);

  protected readonly TaakSoort = TaakSoort;
  protected readonly FormulierSoort = FormulierSoort;
  protected readonly ReceiverSource = ReceiverSource;

  constructor(
    private readonly changeDetection: ChangeDetectorRef,
    private readonly translateService: TranslateService,
    private readonly pluginTranslationService: PluginTranslationService
  ) {}

  formValueChange(formValue: CreateTaskV2Config): void {
    let valid =
      !!formValue.taakSoort &&
      (!!(formValue.taakSoort === TaakSoort.URL && !!formValue.taakUrl) ||
        !!(
          (formValue.taakSoort === TaakSoort.PORTAALFORMULIER &&
            !!(
              !!formValue.portaalformulierSoort &&
              !!formValue.portaalformulierValue &&
              !!formValue.portaalformulierData &&
              !!formValue.portaalformulierVerzondenData
            )) ||
          !!(
            formValue.taakSoort === TaakSoort.OGONEBETALING &&
            !!(!!formValue.ogoneBedrag && !!formValue.ogoneBetaalkenmerk && !!formValue.ogonePspid)
          )
        )) &&
      !!formValue.receiver &&
      (formValue.receiver === ReceiverSource.ZAAKINITIATOR ||
        (formValue.receiver === ReceiverSource.OTHER &&
          !!(!!formValue.identificationKey && !!formValue.identificationValue))) &&
      !!(
        !this.koppelingVanToepassing?.checked ||
        !!(!!formValue.koppelingRegistratie && !!formValue.koppelingUuid)
      ) &&
      !!(!this.verloopdatumVanToepassing?.checked || !!formValue.verloopdatum);

    if (valid) {
      this.value$.next(formValue);
    }

    this.valid.emit(valid);
    this.formValue$.next(formValue);
    this.changeDetection.detectChanges();
  }

  private selectItemsToTranslatedItems(selectItems: Array<string>): Observable<Array<SelectItem>> {
    return this.translateService.stream('key').pipe(
      map(() =>
        selectItems.map(item => ({
          id: item,
          text: this.pluginTranslationService.instant(item, this.pluginId),
        }))
      )
    );
  }

  private radioItemsToTranslatedItems(radioValues: Array<string>): Observable<Array<RadioValue>> {
    return this.translateService.stream('key').pipe(
      map(() =>
        radioValues.map(item => ({
          value: item,
          title: this.pluginTranslationService.instant(item, this.pluginId),
        }))
      )
    );
  }
}