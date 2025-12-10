import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from "rxjs";
import {
    PluginConfigurationComponent,
    PluginManagementService,
    PluginTranslatePipeModule,
    PluginTranslationService
} from "@valtimo/plugin";
import {PluginConfig} from "../../models/config.models";
import {FormModule, InputModule, SelectItem, SelectModule} from "@valtimo/components";
import {TranslateService} from "@ngx-translate/core";
import {ObjectManagementService} from "@valtimo/object-management";
import {AsyncPipe, NgIf} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {ProcessService} from "@valtimo/process";

@Component({
    selector: 'lib-plugin-configuration',
    imports: [
        PluginTranslatePipeModule,
        AsyncPipe,
        FormModule,
        InputModule,
        SelectModule,
        NgIf
    ],
    templateUrl: './plugin-configuration.component.html',
    styleUrl: './plugin-configuration.component.css'
})
export class PluginConfigurationImplComponent implements PluginConfigurationComponent, OnInit, OnDestroy {
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
        map(([configurations]) =>
            configurations.map(configuration => ({
                id: configuration.id,
                text: `${configuration.title} - ${this.pluginTranslationService.instant(
                    'title',
                    configuration.pluginDefinition.key
                )}`,
            }))
        )
    );
    readonly objectManagementConfigurationItems$: Observable<Array<SelectItem>> = combineLatest([
        this.objectManagementService.getAllObjects(),
        this.translateService.stream('key'),
    ]).pipe(
        map(([objectManagementConfigurations]) =>
            objectManagementConfigurations.map(configuration => ({
                id: configuration.id,
                text: `${configuration.title}`,
            }))
        )
    );
    readonly processSelectItems$: Observable<Array<SelectItem>> = this.processService.getProcessDefinitions()
        .pipe(
            map(processDefinitions =>
                processDefinitions.map(processDefinition => ({
                    id: processDefinition.key,
                    text: processDefinition.name,
                }))
            )
        );

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<PluginConfig | null>(null);
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
        this.openSaveSubscription();
    }

    public ngOnDestroy(): void {
        this.logger.debug('Plugin configuration - onDestroy');
        this.saveSubscription?.unsubscribe();
    }

    public formValueChange(formValue: PluginConfig): void {
        this.logger.debug('formValueChange', formValue);
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: PluginConfig): void {
        const valid = !!(
            formValue.configurationTitle
        );
        this.logger.debug('handleValid', valid);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    this.logger.debug('formValue', formValue);
                    if (valid) {
                        this.configuration.emit(formValue);
                    }
                });
        });
    }
}
