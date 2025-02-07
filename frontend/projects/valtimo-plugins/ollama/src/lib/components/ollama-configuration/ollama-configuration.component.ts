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
import {OllamaConfig} from '../../models';
import {PluginManagementService, PluginTranslationService} from '@valtimo/plugin';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from '@valtimo/components';

@Component({
  selector: 'valtimo-ollama-configuration',
  templateUrl: './ollama-configuration.component.html',
  styleUrls: ['./ollama-configuration.component.scss'],
})
export class OllamaConfigurationComponent
  implements PluginConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$!: Observable<void>;
  @Input() disabled$!: Observable<boolean>;
  @Input() pluginId!: string;
  @Input() prefillConfiguration$!: Observable<OllamaConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<PluginConfigurationData> = new EventEmitter<PluginConfigurationData>();

  constructor(
      private readonly pluginManagementService: PluginManagementService,
      private readonly translateService: TranslateService,
      private readonly pluginTranslationService: PluginTranslationService
  ) {}

  public readonly languageModels: SelectItem[] = [
    {
      id: "smollm:135m",
      text: "smollm:135m",
      translationKey: "smollm"
    },
    {
      id: "deepseek-r1:1.5b",
      text: "deepseek-r1:1.5b",
      translationKey: "deepseek"
    },
  ]

  readonly authenticationPluginSelectItems$: Observable<Array<{id?: string; text: string}>> =
    combineLatest([
      this.pluginManagementService.getPluginConfigurationsByCategory('ollama-authentication'),
      this.translateService.stream('key'),
    ]).pipe(
      map(([configurations]) =>
        configurations.map(configuration => ({
          id: configuration.id,
          text: `${configuration.title} - ${this.pluginTranslationService.instant(
            'title',
            configuration.pluginDefinition!.key
          )}`,
        }))
      )
    );
  private saveSubscription!: Subscription;
  private readonly formValue$ = new BehaviorSubject<OllamaConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy() {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: OllamaConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: OllamaConfig): void {
    const valid = !!(formValue.configurationTitle && formValue.url);

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
