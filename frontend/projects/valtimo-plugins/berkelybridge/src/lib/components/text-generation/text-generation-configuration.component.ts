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
import {TextGeneratieConfig} from "../../models";

@Component({
  selector: 'valtimo-text-generation-configuration',
  templateUrl: './text-generation-configuration.component.html',
  styleUrls: ['./text-generation-configuration.component.scss'],
})
export class TextGenerationConfigurationComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy
{
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<TextGeneratieConfig>;
  @Input() save$: Observable<void>;
  @Output() configuration: EventEmitter<TextGeneratieConfig> = new EventEmitter<TextGeneratieConfig>();
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly formValue$ = new BehaviorSubject<TextGeneratieConfig | null>(null);
  private saveSubscription!: Subscription;
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  public ngOnInit(): void {
    this.openSaveSubscription();
  }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  public formValueChange(formValue: TextGeneratieConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: TextGeneratieConfig): void {
    const valid = !!(formValue.modelId)
        && !!(formValue.templateId);

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
