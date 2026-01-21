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
  PluginTranslatePipeModule,
} from "@valtimo/plugin";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
  take,
} from "rxjs";
import { AsyncPipe, NgIf } from "@angular/common";
import { FormModule, InputModule } from "@valtimo/components";
import { GetContactMomentsByCaseUuidConfig } from "../../models/get-contact-moments-by-case-uuid-config";

@Component({
  selector: "get-contact-moments-by-case-uuid",
  standalone: true,
  imports: [
    AsyncPipe,
    FormModule,
    InputModule,
    NgIf,
    PluginTranslatePipeModule,
  ],
  templateUrl: "./get-contact-moments-by-case-uuid.component.html",
  styleUrl: "./get-contact-moments-by-case-uuid.component.scss",
})
export class GetContactMomentsByCaseUuidComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input()
  prefillConfiguration$?: Observable<GetContactMomentsByCaseUuidConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> =
    new EventEmitter<FunctionConfigurationData>();

  private saveSubscription!: Subscription;

  private readonly formValue$ =
    new BehaviorSubject<GetContactMomentsByCaseUuidConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: GetContactMomentsByCaseUuidConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: GetContactMomentsByCaseUuidConfig): void {
    const valid = !!formValue.resultPvName && !!formValue.caseUuid;

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe((save) => {
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
