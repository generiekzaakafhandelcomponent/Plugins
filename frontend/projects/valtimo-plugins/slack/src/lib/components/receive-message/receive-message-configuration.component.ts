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
import {
  FunctionConfigurationComponent,
  FunctionConfigurationData,
  PluginTranslationService,
} from '@valtimo/plugin';
import {SelectItem} from '@valtimo/components';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {ReceiveMessageConfig, THREAD_SCOPES} from '../../models';

@Component({
  selector: 'valtimo-receive-message-configuration',
  templateUrl: './receive-message-configuration.component.html',
})
export class ReceiveMessageConfigurationComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$!: Observable<void>;
  @Input() disabled$!: Observable<boolean>;
  @Input() pluginId!: string;
  @Input() prefillConfiguration$!: Observable<ReceiveMessageConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> =
    new EventEmitter<FunctionConfigurationData>();

  constructor(
    private readonly translateService: TranslateService,
    private readonly pluginTranslationService: PluginTranslationService
  ) {}

  /**
   * Rebuilt on every language change: the labels come from the plugin's own translations,
   * and `instant` reads whatever language is active at the moment it is called.
   */
  readonly threadScopeItems$: Observable<SelectItem[]> = this.translateService
    .stream('key')
    .pipe(
      map(() =>
        [THREAD_SCOPES.ANY, THREAD_SCOPES.THREAD_STARTS_ONLY, THREAD_SCOPES.THREAD_REPLIES_ONLY].map(
          scope => ({
            id: scope,
            text: this.pluginTranslationService.instant(`threadScope.${scope}`, this.pluginId),
          })
        )
      )
    );

  private saveSubscription!: Subscription;
  private readonly formValue$ = new BehaviorSubject<ReceiveMessageConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: ReceiveMessageConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: ReceiveMessageConfig): void {
    // The channel is the only field that is not a filter: without it there is nothing for
    // the poller to read, so an empty form is not a valid "receive everything".
    const valid = !!formValue.channel;

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(() => {
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
