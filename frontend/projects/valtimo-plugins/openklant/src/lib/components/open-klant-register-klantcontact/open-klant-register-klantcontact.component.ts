import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  FormModule, FormOutput,
  InputModule,
} from "@valtimo/components";
import {
  FunctionConfigurationComponent,
  FunctionConfigurationData,
  PluginTranslatePipeModule,
} from "@valtimo/plugin";
import {AsyncPipe} from "@angular/common";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
  take,
} from "rxjs";
import {RegisterKlantcontactConfig} from "../../models/register-klantcontact-config";

@Component({
  selector: "register-klantcontact",
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    InputModule,
    PluginTranslatePipeModule,
    AsyncPipe,
  ],
  templateUrl: "./open-klant-register-klantcontact.component.html",
})
export class RegisterKlantcontactComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input()
  prefillConfiguration$?: Observable<RegisterKlantcontactConfig>;

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> =
    new EventEmitter<FunctionConfigurationData>();

  protected hasBetrokkene = false;

  protected readonly formValue$ =
    new BehaviorSubject<RegisterKlantcontactConfig | null>(null);

  private saveSubscription: Subscription;
  private prefillSubscription: Subscription;
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openPrefillSubscription();
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
    this.prefillSubscription?.unsubscribe();
  }

  formValueChange(formOutput: FormOutput): void {
    const formValue = formOutput as RegisterKlantcontactConfig;

    this.hasBetrokkene = !!formValue.hasBetrokkene;
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  /**
   * Process links configured before plugin version 1.4.0, when the 'heeftBetrokkene' toggle was
   * not persisted, have no hasBetrokkene property at all. Falling back to false would render them
   * as anonymous and drop the configured betrokkene as soon as the process link is re-saved, so
   * derive the intent from the presence of a partijUuid instead. This mirrors the fallback in the
   * backend's KlantcontactCreationInformation.
   *
   * Can be removed once no process links predating 1.4.0 are in use.
   */
  protected resolveHasBetrokkene(
    prefill: RegisterKlantcontactConfig | null,
  ): boolean {
    return !!(prefill?.hasBetrokkene ?? prefill?.partijUuid);
  }

  private openPrefillSubscription(): void {
    this.prefillSubscription = this.prefillConfiguration$
      ?.pipe(take(1))
      .subscribe(prefill => {
        this.hasBetrokkene = this.resolveHasBetrokkene(prefill);
      });
  }

  private handleValid(formOutput: RegisterKlantcontactConfig): void {
    const valid =
      !!formOutput.kanaal &&
      !!formOutput.onderwerp &&
      !!formOutput.vertrouwelijk &&
      !!formOutput.taal &&
      !!formOutput.plaatsgevondenOp &&
      !!(!formOutput.hasBetrokkene || formOutput.partijUuid) &&
      !!(!formOutput.hasBetrokkene || formOutput.voorletters) &&
      !!(!formOutput.hasBetrokkene || formOutput.voornaam) &&
      !!(!formOutput.hasBetrokkene || formOutput.voorvoegselAchternaam) &&
      !!(!formOutput.hasBetrokkene || formOutput.achternaam);

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(() => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([config, valid]) => {
          if (valid) {
            this.configuration.emit(config);
          }
        });
    });
  }
}
