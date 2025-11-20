import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent, FunctionConfigurationData} from '@valtimo/plugin';
import {Observable, BehaviorSubject, Subscription, combineLatest, take} from 'rxjs';
import {OpenKlantStoreContactinfoConfig} from '../../models/open-klant-store-contactinfo-config';


@Component({
  selector: 'app-store-contact-info',
  standalone: false,
  templateUrl: './open-klant-store-contactinfo.component.html',
  styleUrls: ['./open-klant-store-contactinfo.component.scss']
})
export class OpenKlantStoreContactinfoComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {

  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<OpenKlantStoreContactinfoConfig>;

  @Output() valid = new EventEmitter<boolean>();
  @Output() configuration = new EventEmitter<FunctionConfigurationData>();

  private readonly formValue$ = new BehaviorSubject<OpenKlantStoreContactinfoConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);
  private saveSubscription: Subscription;

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: OpenKlantStoreContactinfoConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: OpenKlantStoreContactinfoConfig): void {
    const valid =
      !!formValue.bsn &&
      !!formValue.firstName &&
      !!formValue.inFix &&
      !!formValue.lastName &&
      !!formValue.emailAddress &&
      !!formValue.caseNumber;

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
