import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {DelegateTaskConfig, Registratie, LevelOfAssurance} from '../../models';
import {NGXLogger} from 'ngx-logger';
import {SelectItem} from '@valtimo/components';

@Component({
  standalone: false,
  selector: 'valtimo-delegate-task-configuration',
  templateUrl: './delegate-task.component.html',
  styleUrl: './delegate-task.component.css'
})
export class DelegateTaskComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() prefillConfiguration$: Observable<DelegateTaskConfig>;
  @Input() pluginId: string;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<DelegateTaskConfig> = new EventEmitter<DelegateTaskConfig>();

  readonly levelOfAssuranceOptions: Array<string> = Object.values(LevelOfAssurance).map(item => (item.toString()));
  readonly koppelingRegistratieOptions: Array<SelectItem> = Object.values(Registratie).map(item => (
    {
      id: item.toString().toLowerCase(),
      text: item.toString()
    }
  ));

  private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<DelegateTaskConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly logger: NGXLogger
    ) {
    }

    public ngOnInit(): void {
        this.logger.debug('Delegate task configuration - onInit');
        this.openSaveSubscription();
    }

    public ngOnDestroy(): void {
        this.logger.debug('Delegate task configuration - onDestroy');
        this.saveSubscription?.unsubscribe();
    }

    public formValueChange(formValue: DelegateTaskConfig): void {
        this.logger.debug('formValueChange', formValue);
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: DelegateTaskConfig): void {
        const valid = !!(
            formValue.betrokkeneIdentifier &&
            formValue.levelOfAssurance &&
            formValue.formulierUri
        );
        this.logger.debug('handleValid', valid);
        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    this.logger.debug('formValue', formValue);
                    if (valid) {
                        this.configuration.emit(formValue);
                    }
                });
        });
    }
}
