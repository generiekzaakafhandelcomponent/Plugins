import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
  FunctionConfigurationComponent,
  FunctionConfigurationData,
  PluginTranslatePipeModule
} from "@valtimo/plugin";
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from "rxjs";
import {SetDefaultDigitaalAdresConfig} from "../../models/set-default-digitaal-adres-config";
import {AsyncPipe, NgIf} from "@angular/common";
import {FormModule, InputModule} from "@valtimo/components";

@Component({
  selector: 'set-default-digitaal-adres',
  imports: [
    AsyncPipe,
    FormModule,
    InputModule,
    NgIf,
    PluginTranslatePipeModule
  ],
  standalone: true,
  templateUrl: './set-default-digitaal-adres.component.html'
})
export class SetDefaultDigitaalAdresComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$?: Observable<SetDefaultDigitaalAdresConfig>;
  @Output() valid: EventEmitter<boolean>;
  @Output() configuration: EventEmitter<FunctionConfigurationData> =
    new EventEmitter<FunctionConfigurationData>();

  private saveSubscription!: Subscription;

  private readonly formValue$ =
    new BehaviorSubject<SetDefaultDigitaalAdresConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription()
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: SetDefaultDigitaalAdresConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: SetDefaultDigitaalAdresConfig): void {
    const valid = !!formValue.resultPvName &&
      !!formValue.partijUuid &&
      !!formValue.adres &&
      !!formValue.soortDigitaalAdres &&
      !!formValue.verificatieDatum;

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe((save) => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([formValue, valid]) => {
          if (valid && formValue) {
            this.configuration.emit(formValue);
          }
        });
    });
  }
}
