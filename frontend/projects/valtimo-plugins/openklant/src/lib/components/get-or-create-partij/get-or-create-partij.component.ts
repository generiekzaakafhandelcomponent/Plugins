import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent, FunctionConfigurationData, PluginTranslatePipeModule} from "@valtimo/plugin";
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from "rxjs";
import {GetOrCreatePartijConfig} from "../../models/get-or-create-partij-config";
import {FormModule, InputModule} from "@valtimo/components";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'lib-get-or-create-partij',
  standalone: true,
  imports: [
    FormModule,
    InputModule,
    PluginTranslatePipeModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './get-or-create-partij.component.html',
})
export class GetOrCreatePartijComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<GetOrCreatePartijConfig>;

  @Output() valid = new EventEmitter<boolean>();
  @Output() configuration = new EventEmitter<FunctionConfigurationData>();

  private readonly formValue$ =
    new BehaviorSubject<GetOrCreatePartijConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);
  private saveSubscription: Subscription;

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: GetOrCreatePartijConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: GetOrCreatePartijConfig): void {
    const valid =
      !!formValue.bsn &&
      !!formValue.voorletters &&
      !!formValue.voornaam &&
      !!formValue.voorvoegselAchternaam &&
      !!formValue.achternaam

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(() => {
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
