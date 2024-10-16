import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PluginConfigurationComponent, PluginManagementService, PluginTranslationService} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from 'rxjs';
import {Config} from '../../models';
import {TranslateService} from '@ngx-translate/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'zgw-haalcentraal-handelsregister-plugin-configuration',
    templateUrl: './kvk-plugin-configuration.component.html',
    styleUrls: ['./kvk-plugin-configuration.component.scss']
})
export class KvkPluginConfigurationComponent
    // The component explicitly implements the PluginConfigurationComponent interface
    implements PluginConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    // If the plugin had already been saved, a prefill configuration of the type SuwinetPluginConfig is expected
    @Input() prefillConfiguration$: Observable<Config>;

    // If the configuration data changes, output whether the data is valid or not
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    // If the configuration is valid, output a configuration of the type SuwinetPluginConfig
    @Output() configuration: EventEmitter<Config> =
        new EventEmitter<Config>();

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<Config | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly authenticationPluginSelectItems$: Observable<Array<{ id: string; text: string }>> =
        combineLatest([
            this.pluginManagementService.getPluginConfigurationsByCategory('suwinet'),
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

    constructor(
        private readonly pluginManagementService: PluginManagementService,
        private readonly translateService: TranslateService,
        private readonly pluginTranslationService: PluginTranslationService
    ) {
    }

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: any): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: Config): void {
        // The configuration is valid when a configuration title and url are defined
        const valid = !!(
            formValue.configurationTitle &&
            formValue.apikey &&
            formValue.handelsregisterBaseUrl
        );

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        /*
        If the save observable is triggered, check if the configuration is valid, and if so,
        output the configuration using the configuration EventEmitter.
         */
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
