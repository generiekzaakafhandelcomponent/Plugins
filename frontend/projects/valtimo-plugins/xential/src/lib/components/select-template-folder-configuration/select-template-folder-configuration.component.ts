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
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, filter, map, Observable, Subscription, take,} from 'rxjs';
import {SelectTemplateFolderConfig} from '../../models';
import {XentialApiSjabloonService} from '../../modules/xential-api/services/xential-api-sjabloon.service';
import {KeycloakUserService} from '@valtimo/keycloak';
import {SelectItem} from '@valtimo/components';

@Component({
  standalone: false,
  selector: 'xential-select-template-folder-configuration',
  templateUrl: './select-template-folder-configuration.component.html'
})
export class SelectTemplateFolderConfigurationComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<SelectTemplateFolderConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<SelectTemplateFolderConfig> = new EventEmitter<SelectTemplateFolderConfig>();

  public readonly firstLevelGroupSelectItems$: BehaviorSubject<Array<SelectItem>> = new BehaviorSubject<Array<SelectItem>>([]);
  public readonly secondLevelGroupSelectItems$: BehaviorSubject<Array<SelectItem>> = new BehaviorSubject<Array<SelectItem>>([]);
  public readonly thirdLevelGroupSelectItems$: BehaviorSubject<Array<SelectItem>> = new BehaviorSubject<Array<SelectItem>>([]);

  private saveSubscription!: Subscription;

  private readonly formValue$ = new BehaviorSubject<SelectTemplateFolderConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);
  private readonly username$ = new BehaviorSubject<string>('');
  private readonly firstGroupId$ = new BehaviorSubject<string>('');
  private readonly secondGroupId$ = new BehaviorSubject<string>('');

  private currentFirstTemplateGroupId: string = 'notset';
  private currentSecondTemplateGroupId: string = 'notset';

  constructor(
    private readonly xentialApiSjabloonService: XentialApiSjabloonService,
    private readonly keycloakUserService: KeycloakUserService
  ) {
    this.getFirstLevelTemplate();
    this.keycloakUserService.getUserSubject().subscribe(userIdentity => {
      this.username$.next(userIdentity.username);
    });
  }

  public ngOnInit(): void {
    this.openSaveSubscription();
  }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  public getFirstLevelTemplate(): void {
    this.username$.pipe(filter(gebruikersId => !!gebruikersId))
      .subscribe(() => {
        this.handleLevelSelected(this.firstGroupId$, this.firstLevelGroupSelectItems$);
      });
  }

  public formValueChange(formValue: SelectTemplateFolderConfig): void {
    if (
      formValue.firstTemplateGroupId &&
      formValue.firstTemplateGroupId != this.currentFirstTemplateGroupId
    ) {
      this.currentFirstTemplateGroupId = formValue.firstTemplateGroupId;
      this.firstGroupId$.next(formValue.firstTemplateGroupId);
      this.handleLevelSelected(this.firstGroupId$, this.secondLevelGroupSelectItems$);
    }
    if (
      formValue.secondTemplateGroupId &&
      formValue.secondTemplateGroupId != this.currentSecondTemplateGroupId
    ) {
      this.currentSecondTemplateGroupId = formValue.secondTemplateGroupId;
      this.secondGroupId$.next(formValue.secondTemplateGroupId);
      this.handleLevelSelected(this.secondGroupId$, this.thirdLevelGroupSelectItems$);
    }

    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleLevelSelected(
    groupId$: BehaviorSubject<string>,
    levelGroupSelectItems$: BehaviorSubject<Array<SelectItem>>
  ): void {
    combineLatest([
      this.username$,
      this.xentialApiSjabloonService.getTemplates(this.username$.getValue(), groupId$.getValue()),
    ]).pipe(
      map(([_, sjablonenList]) => {
          levelGroupSelectItems$.next(
            sjablonenList.sjabloongroepen.map(configuration => ({
                id: configuration.id,
                text: configuration.naam
              })
            )
          );
        }
      )
    ).subscribe();
  }

  private handleValid(formValue: SelectTemplateFolderConfig): void {
    const valid = !!(
      formValue.resultProcessVariable &&
      formValue.firstTemplateGroupId &&
      formValue.eventMessageName
    );

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$.subscribe(save => {
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
