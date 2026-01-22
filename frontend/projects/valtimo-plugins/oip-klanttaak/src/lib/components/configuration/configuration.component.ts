import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, shareReplay, Subscription, take, tap} from 'rxjs';
import {PluginConfigurationComponent, PluginManagementService, PluginTranslationService} from '@valtimo/plugin';
import {PluginConfig, PluginConfigFormValue} from '../../models';
import {SelectItem} from '@valtimo/components';
import {TranslateService} from '@ngx-translate/core';
import {ObjectManagementService} from '@valtimo/object-management';
import {NGXLogger} from 'ngx-logger';
import {ProcessService} from '@valtimo/process';
import {Toggle} from 'carbon-components-angular';

@Component({
  standalone: false,
  selector: 'valtimo-oip-klanttaak-plugin-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent implements PluginConfigurationComponent, OnInit, OnDestroy {
  @Input() public save$: Observable<void>;
  @Input() public disabled$: Observable<boolean>;
  @Input() public pluginId: string;
  @Input() public prefillConfiguration$: Observable<PluginConfig>;
  @Output() public valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public configuration: EventEmitter<PluginConfig> = new EventEmitter<PluginConfig>();

  readonly notificatiesApiPluginSelectItems$: Observable<Array<SelectItem>> = combineLatest([
    this.pluginManagementService.getPluginConfigurationsByPluginDefinitionKey('notificatiesapi'),
    this.translateService.stream('key'),
  ]).pipe(
    tap(([configurations]) => this.logger.debug('notificaties api configuraties', configurations)),
    map(([configurations]) =>
      configurations.map(configuration => ({
        id: configuration.id,
        text: `${configuration.title} - ${this.pluginTranslationService.instant('title', configuration.pluginDefinition.key)}`,
      }))
    )
  );
  readonly objectManagementConfigurationItems$: Observable<Array<SelectItem>> = combineLatest([
    this.objectManagementService.getAllObjects(),
    this.translateService.stream('key'),
  ]).pipe(
    tap(([configurations]) => this.logger.debug('object management configurations', configurations)),
    map(([configurations]) =>
      configurations.map(configuration => ({
        id: configuration.id,
        text: `${configuration.title}`,
      }))
    )
  );
  private readonly processDefinitions$ = this.processService.getProcessDefinitions().pipe(
    shareReplay(1)
  );
  readonly systemProcessDefinitionItems$: Observable<Array<SelectItem>> = this.processDefinitions$.pipe(
    map(definitions => definitions
      .filter(def => !def.versionTag)
      .map(def => ({id: def.key, text: def.name}))
    )
  );
  readonly caseProcessDefinitionItems$: Observable<Array<SelectItem>> = this.processDefinitions$.pipe(
    map(definitions => definitions
      .filter(def => !!def.versionTag)
      .map(def => ({
        id: `${def.versionTag}|${def.key}`,
        text: `${def.name} [${def.versionTag.substring(3)}]`
      }))
    )
  );

  readonly systemFinalizerProcessSelected$ = new BehaviorSubject<boolean>(false);
  readonly caseFinalizerProcessSelected$ = new BehaviorSubject<boolean>(false);

  private readonly formValue$ = new BehaviorSubject<PluginConfigFormValue | null>(null);
  private saveSubscription!: Subscription;
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  constructor(
    private pluginManagementService: PluginManagementService,
    private translateService: TranslateService,
    private pluginTranslationService: PluginTranslationService,
    private objectManagementService: ObjectManagementService,
    private processService: ProcessService,
    private readonly logger: NGXLogger
  ) {
  }

  public ngOnInit(): void {
    this.logger.debug('Plugin configuration - onInit');
    this.prefillConfiguration$?.subscribe(prefillConfiguration => {
      if (prefillConfiguration) {
        this.formValue$.next(this.pluginConfigFormValueFrom(prefillConfiguration));
      }
    })
    this.formValue$.subscribe(formValue => {
      this.caseFinalizerProcessSelected$.next(!!formValue?.caseFinalizerProcess);
      this.systemFinalizerProcessSelected$.next(!!formValue?.systemFinalizerProcess);
    });
    this.openSaveSubscription();
  }

  public ngOnDestroy(): void {
    this.logger.debug('Plugin configuration - onDestroy');
    this.saveSubscription?.unsubscribe();
  }

  public formValueChange(formValue: PluginConfigFormValue): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  public formatCaseFinalizerProcessFrom(prefill: PluginConfig): string | null {
    return (prefill?.caseDefinitionVersion !== null) ? `CD:${prefill?.caseDefinitionVersion}|${prefill?.finalizerProcess}` : null;
  }

  private pluginConfigFrom(formValue: PluginConfigFormValue): PluginConfig {
    let finalizerProcessIsCaseSpecific: boolean = false;
    let finalizerProcess: string = '';
    let caseDefinitionVersion: string | null = null;
    if (formValue?.systemFinalizerProcess.trim().length > 0) {
      finalizerProcessIsCaseSpecific = false;
      finalizerProcess = formValue.systemFinalizerProcess;
      caseDefinitionVersion = null;
    }
    if (formValue?.caseFinalizerProcess.trim().length > 0) {
      finalizerProcessIsCaseSpecific = true;
      finalizerProcess = formValue.caseFinalizerProcess.substring(formValue.caseFinalizerProcess.indexOf('|') + 1);
      caseDefinitionVersion = formValue.caseFinalizerProcess.substring(0, formValue.caseFinalizerProcess.indexOf('|')).substring(3)
    }
    return {
      configurationId: formValue.configurationId,
      configurationTitle: formValue.configurationTitle,
      notificatiesApiPluginConfiguration: formValue.notificatiesApiPluginConfiguration,
      objectManagementConfigurationId: formValue.objectManagementConfigurationId,
      finalizerProcessIsCaseSpecific: finalizerProcessIsCaseSpecific,
      finalizerProcess: finalizerProcess,
      caseDefinitionVersion: caseDefinitionVersion
    }
  }

  private pluginConfigFormValueFrom(config: PluginConfig): PluginConfigFormValue {
    return {
      ...config,
      caseFinalizerProcess: (config.finalizerProcessIsCaseSpecific) ? this.formatCaseFinalizerProcessFrom(config) : null,
      systemFinalizerProcess: (!config.finalizerProcessIsCaseSpecific) ? config.finalizerProcess : null,
    }
  }

  private handleValid(formValue: PluginConfigFormValue): void {
    this.logger.debug('handleValid - formValue', formValue);
    const valid = !!(
      formValue.configurationTitle &&
      formValue.notificatiesApiPluginConfiguration &&
      formValue.objectManagementConfigurationId &&
      (
        (
          formValue?.caseFinalizerProcess?.trim().length > 0 ||
          formValue?.systemFinalizerProcess?.trim().length > 0
        )
      )
    );
    this.logger.debug('handleValid - valid', valid);
    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(save => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([formValue, valid]) => {
          if (valid) {
            const pluginConfig = this.pluginConfigFrom(formValue);
            this.configuration.emit(pluginConfig);
          }
        });
    });
  }
}
