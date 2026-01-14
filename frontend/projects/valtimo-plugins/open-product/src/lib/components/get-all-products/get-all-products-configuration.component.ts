import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {GetAllProductsConfig} from './models/get-all-products-config';

@Component({
    standalone: false,
    selector: 'valtimo-get-all-products-configuration',
    templateUrl: './get-all-products-configuration.component.html'
})
export class GetAllProductsConfigurationComponent
    // The component explicitly implements the FunctionConfigurationComponent interface
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<GetAllProductsConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<GetAllProductsConfig> =
        new EventEmitter<GetAllProductsConfig>();

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<GetAllProductsConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: GetAllProductsConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: GetAllProductsConfig): void {
        const valid = true;

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
