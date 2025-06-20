/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {CopyInformationObjectConfig} from "../../models";

@Component({
  selector: 'valtimo-copy-informationobject-configuration',
  templateUrl: './copy-informationobject-configuration.component.html',
  styleUrls: ['./copy-informationobject-configuration.component.scss'],
})
export class CopyInformationobjectConfigurationComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy
{
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<CopyInformationObjectConfig>;
  @Input() save$: Observable<void>;
  @Output() configuration: EventEmitter<CopyInformationObjectConfig> = new EventEmitter<CopyInformationObjectConfig>();
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly formValue$ = new BehaviorSubject<CopyInformationObjectConfig | null>(null);
  private saveSubscription!: Subscription;
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  public ngOnInit(): void {
    this.openSaveSubscription();
  }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  public formValueChange(formValue: CopyInformationObjectConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: CopyInformationObjectConfig): void {
    const valid = !!(formValue.eioUrls);

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(save => {
      combineLatest([this.formValue$, this.valid$])
          .pipe(take(1))
          .subscribe(([formValue, valid]) => {
            if (valid) {
              this.configuration.emit(formValue);
            }
          });
    });
  }
}
