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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent, FunctionConfigurationData} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, filter, map, Observable, Subscription, switchMap, take} from 'rxjs';
import {ReceiveCloudEventConfig} from '../../models';

@Component({
  standalone: false,
  selector: 'valtimo-receive-cloud-event-configuration',
  templateUrl: './receive-cloud-event-configuration.component.html',
  styleUrls: ['./receive-cloud-event-configuration.component.scss'],
})
export class ReceiveCloudEventConfigurationComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$!: Observable<void>;
  @Input() disabled$!: Observable<boolean>;
  @Input() pluginId!: string;
  @Input() prefillConfiguration$!: Observable<ReceiveCloudEventConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

  private saveSubscription!: Subscription;
  private readonly formValue$ = new BehaviorSubject<ReceiveCloudEventConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: ReceiveCloudEventConfig): void {
    this.formValue$.next(formValue);
    this.valid$.next(true);
    this.valid.emit(true);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$
      ?.pipe(
        switchMap(() => combineLatest([this.formValue$, this.valid$]).pipe(take(1))),
        filter(([_, valid]) => valid),
        map(([formValue]) => formValue)
      )
      .subscribe(formValue => {
        this.configuration.emit(formValue!);
      });
  }
}
