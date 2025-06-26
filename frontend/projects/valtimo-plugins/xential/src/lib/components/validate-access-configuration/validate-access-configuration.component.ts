import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest,Observable,Subscription,take} from 'rxjs';
import {ValidateAccessConfig} from "../../models";

@Component({
    selector: 'xential-validate-access-configuration',
    templateUrl: './validate-access-configuration.component.html'
})
export class ValidateAccessConfigurationComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<ValidateAccessConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<ValidateAccessConfig> = new EventEmitter<ValidateAccessConfig>();

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<ValidateAccessConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: ValidateAccessConfig): void {

        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: ValidateAccessConfig): void {
        const valid = !!(
            formValue.toegangResultaatId &&
            formValue.xentialGebruikersId &&
            formValue.xentialDocumentProperties
        );
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
