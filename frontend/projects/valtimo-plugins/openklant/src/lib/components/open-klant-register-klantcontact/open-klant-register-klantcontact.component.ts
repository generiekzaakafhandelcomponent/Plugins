import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormModule,
  InputModule,
  RadioModule,
  RadioValue,
} from "@valtimo/components";
import {
  FunctionConfigurationComponent,
  FunctionConfigurationData,
  PluginTranslatePipeModule,
} from "@valtimo/plugin";
import { AsyncPipe } from "@angular/common";
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
  take,
} from "rxjs";
import { RegisterKlantcontactConfig } from "../../models/register-klantcontact-config";
import { ToggleModule } from "carbon-components-angular";
import { Toggle } from "carbon-components-angular";

@Component({
  selector: "register-klantcontact",
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    InputModule,
    PluginTranslatePipeModule,
    AsyncPipe,
    RadioModule,
    ToggleModule,
  ],
  templateUrl: "./open-klant-register-klantcontact.component.html",
  styleUrl: "./open-klant-register-klantcontact.component.css",
})
export class RegisterKlantcontactComponent
  implements FunctionConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input()
  prefillConfiguration$?: Observable<RegisterKlantcontactConfig>;

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> =
    new EventEmitter<FunctionConfigurationData>();

  @ViewChild("hasBetrokkene") hasBetrokkene: Toggle;

  private saveSubscription: Subscription;
  private readonly formValue$ =
    new BehaviorSubject<RegisterKlantcontactConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: RegisterKlantcontactConfig): void {
    this.formValue$.next({
      hasBetrokkene: this.hasBetrokkene.checked,
      ...formValue,
    });
    this.handleValid(formValue);
  }

  private handleValid(formValue: RegisterKlantcontactConfig): void {
    const valid =
      !!formValue.kanaal &&
      !!formValue.onderwerp &&
      !!formValue.inhoud &&
      !!formValue.vertrouwelijk &&
      !!formValue.taal &&
      !!formValue.plaatsgevondenOp &&
      !!(!formValue.hasBetrokkene || formValue.partijUuid) &&
      !!(!formValue.hasBetrokkene || formValue.voorletters) &&
      !!(!formValue.hasBetrokkene || formValue.voornaam) &&
      !!(!formValue.hasBetrokkene || formValue.voorvoegselAchternaam) &&
      !!(!formValue.hasBetrokkene || formValue.achternaam);

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
