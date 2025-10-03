import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PluginConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take, tap} from 'rxjs';
import {SamplePluginConfig} from '../../models';

@Component({
  selector: 'valtimo-sample-plugin-configuration',
  templateUrl: './sample-plugin-configuration.component.html',
  styleUrls: ['./sample-plugin-configuration.component.scss'],
})
export class SamplePluginConfigurationComponent
  // The component explicitly implements the PluginConfigurationComponent interface
  implements PluginConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  // If the plugin had already been saved, a prefill configuration of the type SamplePluginConfig is expected
  @Input() prefillConfiguration$: Observable<SamplePluginConfig>;

  // If the configuration data changes, output whether the data is valid or not
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  // If the configuration is valid, output a configuration of the type SamplePluginConfig
  @Output() configuration: EventEmitter<SamplePluginConfig> =
    new EventEmitter<SamplePluginConfig>();

  private saveSubscription!: Subscription;

  private readonly formValue$ = new BehaviorSubject<SamplePluginConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy() {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: SamplePluginConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: SamplePluginConfig): void {
    // The configuration is valid when a configuration title and url are defined
    const valid = !!(formValue.configurationTitle && formValue.apiUrl);

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
