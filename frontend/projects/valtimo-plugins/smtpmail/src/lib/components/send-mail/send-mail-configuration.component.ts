/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal} from '@angular/core';
import {FunctionConfigurationComponent, PluginTranslationService} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {ContentInputType, SendMailConfig} from '../../models';
import {RadioValue} from '@valtimo/components';
import {TranslateService} from '@ngx-translate/core';

type SendMailFormValue = SendMailConfig & {contentInputType?: ContentInputType};


@Component({
  selector: 'valtimo-send-mail-configuration',
  templateUrl: './send-mail-configuration.component.html',
})

export class SendMailConfigurationComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<SendMailConfig>;
  @Input() save$: Observable<void>;
  @Output() configuration: EventEmitter<SendMailConfig> = new EventEmitter<SendMailConfig>();
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  public readonly $contentInputType = signal<ContentInputType>('contentId');

  public readonly contentInputTypeOptions$: Observable<Array<RadioValue>> =
    this.translateService.stream('key').pipe(
      map(() => [
        {value: 'contentId', title: this.pluginTranslationService.instant('contentInputTypeFile', this.pluginId)},
        {value: 'content', title: this.pluginTranslationService.instant('contentInputTypeText', this.pluginId)},
      ])
    );

  private readonly formValue$ = new BehaviorSubject<SendMailFormValue | null>(null);
  private saveSubscription!: Subscription;
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly translateService: TranslateService,
    private readonly pluginTranslationService: PluginTranslationService
  ) {}

  public ngOnInit(): void {
    this.openSaveSubscription();
  }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  public formValueChange(formValue: SendMailFormValue): void {
    if (formValue.contentInputType) this.$contentInputType.set(formValue.contentInputType);
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: SendMailFormValue): void {
    const valid = !!(formValue.sender && formValue[this.$contentInputType()]);

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(save => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([formValue, valid]) => {
          if (valid) {
            this.configuration.emit(this.toConfiguration(formValue));
          }
        });
    });
  }

  private toConfiguration(formValue: SendMailFormValue): SendMailConfig {
    const {contentInputType, content, contentId, ...config} = formValue;
    return this.$contentInputType() === 'content' ? {...config, content} : {...config, contentId};
  }
}
