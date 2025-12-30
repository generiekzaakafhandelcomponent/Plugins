import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {CompleteDelegatedTaskConfig} from '../../models';
import {Toggle} from 'carbon-components-angular';

@Component({
  standalone: false,
  selector: 'valtimo-complete-delegated-task-configuration',
  templateUrl: './complete-delegated-task.component.html',
  styleUrl: './complete-delegated-task.component.css'
})
export class CompleteDelegatedTaskComponent implements FunctionConfigurationComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() prefillConfiguration$: Observable<CompleteDelegatedTaskConfig>;
  @Input() pluginId: string;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<CompleteDelegatedTaskConfig> = new EventEmitter<CompleteDelegatedTaskConfig>();
  @ViewChild('bewaarIngediendeGegevens') bewaarIngediendeGegevens: Toggle;
  @ViewChild('koppelDocumenten') koppelDocumenten: Toggle;

  private saveSubscription!: Subscription;
  private readonly formValue$ = new BehaviorSubject<CompleteDelegatedTaskConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  private bewaarIngediendeGegevensToggleSubscription: Subscription;
  private koppelDocumentenToggleSubscription: Subscription;

  constructor(
    private readonly logger: NGXLogger
  ) { }

  public ngOnInit(): void {
    this.logger.debug('Complete delegated task configuration - onInit');
    this.openSaveSubscription();
  }

  public ngOnDestroy(): void {
    this.logger.debug('Complete delegated task configuration - onDestroy');
    this.saveSubscription?.unsubscribe();
    this.bewaarIngediendeGegevensToggleSubscription?.unsubscribe();
    this.koppelDocumentenToggleSubscription?.unsubscribe();
  }

  public ngAfterViewInit(): void {
    this.logger.debug('Complete delegated task configuration - ngAfterViewInit');

    this.bewaarIngediendeGegevensToggleSubscription = this.bewaarIngediendeGegevens.checkedChange.subscribe((checked: boolean) => {
      this.logger.debug('bewaarIngediendeGegevens.checked', checked);
      this.formValueChange(this.formValue$.value);
    });
    this.koppelDocumentenToggleSubscription = this.koppelDocumenten.checkedChange.subscribe((checked: boolean) => {
      this.logger.debug('koppelDocumenten.checked', checked);
      this.formValueChange(this.formValue$.value);
    });
    this.formValueChange(this.formValue$.value);
  }

  public formValueChange(formValue: CompleteDelegatedTaskConfig): void {
    this.logger.debug('formValueChange', formValue);
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: CompleteDelegatedTaskConfig): void {
    const valid =
      (
        this.bewaarIngediendeGegevens?.checked === false ||
        (!!formValue?.ontvangenDataMapping && Object.keys(formValue.ontvangenDataMapping).length > 0)
      ) &&
      (this.koppelDocumenten?.checked === false || !!formValue.padNaarDocumenten);

    this.logger.debug('handleValid', valid);
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
