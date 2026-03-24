/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { PluginConfigurationComponent } from "@valtimo/plugin";
import { BehaviorSubject, combineLatest, filter, map, Observable, Subscription, take } from "rxjs";
import { ArchiefConfig, ArchiefPropertyConfig } from "../../models";
import { PluginManagementService, PluginTranslationService } from "@valtimo/plugin";
import { TranslateService } from "@ngx-translate/core";
import { MultiInputValues, SelectItem } from "@valtimo/components";
import { ProcessService } from "@valtimo/process";

@Component({
  standalone: false,
  selector: "valtimo-archief-configuration",
  templateUrl: "./archief-configuration.component.html",
  styleUrls: ["./archief-configuration.component.scss"],
})
export class ArchiefConfigurationComponent implements PluginConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<ArchiefConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<ArchiefConfig> = new EventEmitter<ArchiefConfig>();

  prefillConfig$: Observable<ArchiefConfig>;

  readonly notificatiePluginSelectItems$: Observable<Array<SelectItem>> = combineLatest([
    this.pluginManagementService.getPluginConfigurationsByPluginDefinitionKey("notificatiesapi"),
    this.translateService.stream("key"),
  ]).pipe(
    map(([configurations]) =>
      configurations.map((configuration) => ({
        id: configuration.id,
        text: `${configuration.title} - ${this.pluginTranslationService.instant("title", configuration.pluginDefinition.key)}`,
      })),
    ),
  );

  readonly processSelectItems$: Observable<Array<SelectItem>> = this.processService.getProcessDefinitions().pipe(
    map((processDefinitions) =>
      processDefinitions.map((processDefinition) => ({
        id: processDefinition.key,
        text: processDefinition.name ?? `<${processDefinition.key}>`,
      })),
    ),
  );

  readonly filterMappings: { [uuid: string]: MultiInputValues } = {};

  private saveSubscription!: Subscription;
  private readonly formValue$ = new BehaviorSubject<ArchiefConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly pluginManagementService: PluginManagementService,
    private readonly translateService: TranslateService,
    private readonly pluginTranslationService: PluginTranslationService,
    private readonly processService: ProcessService,
  ) {}

  ngOnInit(): void {
    this.openSaveSubscription();
    this.setPrefill();
  }

  ngOnDestroy() {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: ArchiefConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  filterValueChange(newValue: MultiInputValues, uuid: string): void {
    this.filterMappings[uuid] = newValue;
  }

  deleteRow(uuid: string): void {
    delete this.filterMappings[uuid];
  }

  private handleValid(formValue: ArchiefConfig): void {
    const validForm = !!(formValue.configurationTitle && formValue.notificatiesApiPluginConfiguration && formValue.processToStart);
    const archiefProperties = formValue.archiefProperties || [];
    const validProperties = archiefProperties.filter((prop) => !!prop.kanaal);
    const valid = validForm && archiefProperties.length === validProperties.length;
    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(() => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([formValue, valid]) => {
          if (valid) {
            const formValueToSave: ArchiefConfig = {
              ...formValue,
              archiefProperties: formValue.archiefProperties.map((prop) => {
                const propToSave: ArchiefPropertyConfig = {
                  kanaal: prop.kanaal,
                  filters: [],
                };
                if (this.filterMappings[prop.uuid]) {
                  propToSave.filters = this.filterMappings[prop.uuid].map((f) => ({
                    key: f.key as string,
                    value: f.value as string,
                  }));
                }
                return propToSave;
              }),
            };
            this.configuration.emit(formValueToSave);
          }
        });
    });
  }

  private setPrefill(): void {
    this.prefillConfig$ = this.prefillConfiguration$.pipe(
      filter((prefill) => !!prefill),
      map((prefill) => ({
        ...prefill,
        archiefProperties:
          prefill.archiefProperties?.map((prop) => ({
            ...prop,
            filters: prop.filters?.map((f) => ({ key: f.key, value: f.value })) || [],
          })) || [],
      })),
    );
  }
}
