import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormModule, InputModule, RadioModule, RadioValue} from "@valtimo/components";
import {FunctionConfigurationComponent, FunctionConfigurationData, PluginTranslatePipeModule} from "@valtimo/plugin";
import {AsyncPipe} from "@angular/common";
import {BehaviorSubject, combineLatest, map, Observable, Subscription, take} from "rxjs";
import {OpenKlantSendKlantcontactConfig} from "../../models/open-klant-send-klantcontact-config";
import {ToggleModule} from "carbon-components-angular";

@Component({
    selector: 'open-klant-send-klantcontact',
    standalone: true,
    imports: [
        CommonModule,
        FormModule,
        InputModule,
        PluginTranslatePipeModule,
        AsyncPipe,
        RadioModule,
        ToggleModule
    ],
    templateUrl: './open-klant-send-klantcontact.component.html',
    styleUrl: './open-klant-send-klantcontact.component.css'
})
export class OpenKlantSendKlantcontactComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$?: Observable<OpenKlantSendKlantcontactConfig>;

    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private saveSubscription: Subscription;
    private readonly formValue$ = new BehaviorSubject<OpenKlantSendKlantcontactConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: OpenKlantSendKlantcontactConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: OpenKlantSendKlantcontactConfig): void {
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
