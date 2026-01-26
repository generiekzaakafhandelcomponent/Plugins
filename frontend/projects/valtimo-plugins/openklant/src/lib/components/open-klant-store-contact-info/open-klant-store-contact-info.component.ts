import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  FunctionConfigurationComponent,
  FunctionConfigurationData,
} from "@valtimo/plugin";
import {
  Observable,
  BehaviorSubject,
  Subscription,
  combineLatest,
  take,
} from "rxjs";
import { StoreContactInfoConfig } from "../../models/store-contact-info-config";

@Component({
  selector: "store-contact-info",
  templateUrl: "./open-klant-store-contact-info.component.html"
})
export class StoreContactInfoComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<StoreContactInfoConfig>;

  @Output() valid = new EventEmitter<boolean>();
  @Output() configuration = new EventEmitter<FunctionConfigurationData>();

  private readonly formValue$ =
    new BehaviorSubject<StoreContactInfoConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);
  private saveSubscription: Subscription;

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: StoreContactInfoConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: StoreContactInfoConfig): void {
    const valid =
      !!formValue.bsn &&
      !!formValue.firstName &&
      !!formValue.inFix &&
      !!formValue.lastName &&
      !!formValue.emailAddress &&
      !!formValue.caseUuid;

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
