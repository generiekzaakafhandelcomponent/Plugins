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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {MultiInputValues, ValuePathSelectorPrefix} from '@valtimo/components';
import {BehaviorSubject, combineLatest, map, Observable, of, Subscription, take} from 'rxjs';
import {CreatePublicTaskConfig, DocumentMetadata} from '../../models';

@Component({
  selector: 'valtimo-create-public-task-configuration',
  templateUrl: './create-public-task-configuration.component.html',
})

export class CreatePublicTaskConfigurationComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<CreatePublicTaskConfig>;
  @Input() save$: Observable<void>;
  @Output() configuration: EventEmitter<CreatePublicTaskConfig> = new EventEmitter<CreatePublicTaskConfig>();
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Mirrors PublicTaskAttachmentLimits, which enforces them; keep the two in step.
  public readonly defaultMaxAttachments = 10;
  public readonly defaultMaxAttachmentSizeInBytes = 10485760;

  public readonly valuePathSelectorPrefixes = [ValuePathSelectorPrefix.DOC, ValuePathSelectorPrefix.CASE];

  // Derived once, not in the template: a fresh array per change detection would restart the multi input.
  public documentMetadataRows$!: Observable<MultiInputValues>;

  private readonly formValue$ = new BehaviorSubject<CreatePublicTaskConfig | null>(null);
  private saveSubscription!: Subscription;
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  public ngOnInit(): void {
    this.documentMetadataRows$ = (this.prefillConfiguration$ ?? of(null)).pipe(
      map(prefill => this.asRows(prefill?.documentMetadata)),
    );
    this.openSaveSubscription();
  }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  public formValueChange(formValue: CreatePublicTaskConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: CreatePublicTaskConfig): void {
    const valid = !!(formValue.pvAssigneeCandidateContactData);

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(save => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([formValue, valid]) => {
          if (valid) {
            this.configuration.emit(this.asConfiguration(formValue));
          }
        });
    });
  }

  // An empty value is left out; the plugin reads that as "not set".
  private asConfiguration(formValue: CreatePublicTaskConfig): CreatePublicTaskConfig {
    return {
      ...formValue,
      maxAttachments: this.asNumber(formValue?.maxAttachments),
      maxAttachmentSizeInBytes: this.asNumber(formValue?.maxAttachmentSizeInBytes),
      documentMetadata: this.asDocumentMetadata(formValue?.documentMetadata),
    };
  }

  private asRows(metadata: DocumentMetadata | undefined): MultiInputValues {
    return Object.entries(metadata ?? {}).map(([key, value]) => ({key, value}));
  }

  // Typed loosely: the form hands back the multi input's rows, not the declared object.
  private asDocumentMetadata(rows: unknown): DocumentMetadata | undefined {
    if (!Array.isArray(rows)) {
      return undefined;
    }

    const metadata: DocumentMetadata = {};
    rows.forEach(row => {
      const key = `${row?.key ?? ''}`.trim();
      const value = `${row?.value ?? ''}`.trim();

      if (key !== '' && value !== '') {
        metadata[key] = value;
      }
    });

    return Object.keys(metadata).length > 0 ? metadata : undefined;
  }

  private asNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || `${value}`.trim() === '') {
      return undefined;
    }
    const asNumber = Number(value);

    return Number.isFinite(asNumber) ? asNumber : undefined;
  }
}
