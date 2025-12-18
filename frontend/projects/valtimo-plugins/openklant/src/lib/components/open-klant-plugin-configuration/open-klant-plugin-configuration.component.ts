import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PluginConfigurationComponent, PluginConfigurationData} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {Config} from '../../models';

@Component({
  selector: 'app-open-klant-plugin-configuration',
  standalone: false,
  templateUrl: './open-klant-plugin-configuration.component.html',
  styleUrl: './open-klant-plugin-configuration.component.scss'
})
export class OpenKlantPluginConfigurationComponent implements PluginConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<Config>;

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<PluginConfigurationData> = new EventEmitter<PluginConfigurationData>();

  private saveSubscription: Subscription;

  private readonly formValue$ = new BehaviorSubject<Config | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: any): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: Config): void {
    // The configuration is valid when a configuration title and url are defined
    const valid = !!(formValue.configurationTitle && formValue.klantinteractiesUrl && formValue.token);

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
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
