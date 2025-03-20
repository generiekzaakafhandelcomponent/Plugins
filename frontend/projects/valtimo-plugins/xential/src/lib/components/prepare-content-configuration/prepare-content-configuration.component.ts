import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {PrepareContentTemplate} from "../../models";
import {SelectItem,ValuePathSelectorPrefix} from "@valtimo/components";
import {ProcessManagementModule} from "@valtimo/process-management";

@Component({
    selector: 'xential-prepare-content-configuration',
    templateUrl: './prepare-content-configuration.component.html'
})
export class PrepareContentConfigurationComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<PrepareContentTemplate>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<PrepareContentTemplate> =
        new EventEmitter<PrepareContentTemplate>();

    protected readonly ValuePathSelectorPrefix = ValuePathSelectorPrefix;
    documentDefinitionName: string = "xential-test";

    protected readonly ProcessManagementModule = ProcessManagementModule;

    public fileFormats$ = new BehaviorSubject<SelectItem[]>(
        ['WORD', 'PDF']
            .map(format => {
                return {
                    id: format,
                    text: format
                }
            })
    );

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<PrepareContentTemplate | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.openSaveSubscription();
        console.log("ProcessManagementModule.name: " + this.ProcessManagementModule.name)
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: PrepareContentTemplate): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: PrepareContentTemplate): void {

        const valid = !!(
            formValue.xentialContentId &&
            formValue.gebruikersId &&
            formValue.templateId &&
            formValue.fileFormat &&
            formValue.documentId &&
            formValue.eventMessageName &&
            !formValue.documentDetailsData.find((entry) => !(entry.key && entry.value)) &&
            !formValue.colofonData.find((entry) => !(entry.key && entry.value)) &&
            !formValue.verzendAdresData.find((entry) => !(entry.key && entry.value))
        );
        console.log("---- is valid: " + valid)
        console.log("formValues: documentDetailsData ", formValue.documentDetailsData)
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
