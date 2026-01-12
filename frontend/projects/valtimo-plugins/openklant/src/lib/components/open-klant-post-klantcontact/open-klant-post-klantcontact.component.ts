import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormModule, InputModule} from "@valtimo/components";
import {FunctionConfigurationComponent, FunctionConfigurationData, PluginTranslatePipeModule} from "@valtimo/plugin";
import {AsyncPipe} from "@angular/common";
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from "rxjs";
import {OpenKlantPostKlantcontactConfig} from "../../models/open-klant-post-klantcontact-config";

@Component({
    selector: 'lib-open-klant-post-klantcontact',
    standalone: true,
    imports: [
        CommonModule,
        FormModule,
        InputModule,
        PluginTranslatePipeModule,
        AsyncPipe
    ],
    templateUrl: './open-klant-post-klantcontact.component.html',
    styleUrl: './open-klant-post-klantcontact.component.css'
})
export class OpenKlantPostKlantcontactComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$?: Observable<OpenKlantPostKlantcontactConfig>;

    @Output() valid: EventEmitter<boolean>;
    @Output() configuration: EventEmitter<FunctionConfigurationData>;

    private readonly formValue$ = new BehaviorSubject<OpenKlantPostKlantcontactConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);
    private saveSubscription: Subscription;


    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: OpenKlantPostKlantcontactConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: OpenKlantPostKlantcontactConfig): void {
        const valid =
            !!formValue.communicationChannel &&
            !!formValue.subject &&
            !!formValue.content &&
            (formValue.confidential === true || formValue.confidential === false) &&
            !!formValue.startDateTime &&
            !!formValue.partijUuid &&
            !!formValue.initials &&
            !!formValue.firstName &&
            !!formValue.inFix &&
            !!formValue.lastName;

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
