/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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
import {PluginConfigurationComponent, PluginConfigurationData} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {SuwinetAuthConfig} from '../../models';
import {PluginManagementService, PluginTranslationService} from '@valtimo/plugin';
import {TranslateService} from '@ngx-translate/core';
import {RadioValue} from "@valtimo/components";

@Component({
  selector: 'valtimo-suwinet-auth-configuration',
  templateUrl: './suwinet-auth-configuration.component.html',
  styleUrls: ['./suwinet-auth-configuration.component.scss'],
})
export class SuwinetAuthConfigurationComponent
  implements PluginConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$!: Observable<void>;
  @Input() disabled$!: Observable<boolean>;
  @Input() pluginId!: string;
  @Input() prefillConfiguration$!: Observable<SuwinetAuthConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<PluginConfigurationData> = new EventEmitter<PluginConfigurationData>();

  readonly mtlsRadio =  {value: 'mtls', title: 'MTLS'};
  readonly basicRadio =  {value: 'basic', title: 'Basic'};
  readonly headerRadio =  {value: 'header', title: 'Header'};

    readonly authTypeOptions: Array<RadioValue> = [this.mtlsRadio, this.basicRadio, this.headerRadio]

  constructor(
      private readonly pluginManagementService: PluginManagementService,
      private readonly translateService: TranslateService,
      private readonly pluginTranslationService: PluginTranslationService
  ) {}

  private saveSubscription!: Subscription;
  private readonly formValue$ = new BehaviorSubject<SuwinetAuthConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  selectedAuthType$ = new BehaviorSubject({ value: "mtls", title: "MTLS"})


  ngOnInit(): void {
    this.openSaveSubscription();
    this.prefillConfiguration$.pipe(map(config => {
        if(config.authType) {
            if(config.authType === this.mtlsRadio.value){
                this.selectedAuthType$.next(this.mtlsRadio)
            }
            else if(config.authType === this.basicRadio.value){
                this.selectedAuthType$.next(this.basicRadio)
            }
        }
    }))
  }

  ngOnDestroy() {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: SuwinetAuthConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);

      if (formValue.authType) {
          console.log(formValue.authType);
          if(formValue.authType === this.mtlsRadio.value){
              this.selectedAuthType$.next(this.mtlsRadio)
          }
          else if(formValue.authType === this.basicRadio.value) {
              this.selectedAuthType$.next(this.basicRadio)
          }
          else if(formValue.authType === this.headerRadio.value) {
              this.selectedAuthType$.next(this.headerRadio)
          }

          console.log(this.selectedAuthType$.value);
      }
  }


  private handleValid(formValue: SuwinetAuthConfig): void {
    var valid = !!(formValue.configurationTitle)
     if(formValue.authType === 'basic') {
         valid = !!(formValue.basicAuthName && formValue.basicAuthSecret)
     }
     else if(formValue.authType === 'mtls') {
         valid = !!(formValue.keystorePath
             && formValue.keystorePath
             && formValue.truststorePath
             && formValue.truststoreSecret)
     }

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
}
