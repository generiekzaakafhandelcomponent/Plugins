import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, filter, map, Observable, Subscription, take, startWith, switchMap} from 'rxjs';
import {PrepareContentWithTextTemplate} from "../../models";
import {SelectItem} from "@valtimo/components";
import {XentialApiSjabloonService} from "../../modules/xential-api/services/xential-api-sjabloon.service";

@Component({
    selector: 'xential-prepare-content-with-template-configuration',
    templateUrl: './prepare-content-with-template-configuration.component.html'
})
export class PrepareContentWithTemplateConfigurationComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<PrepareContentWithTextTemplate>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<PrepareContentWithTextTemplate> =
        new EventEmitter<PrepareContentWithTextTemplate>();

    constructor(
        private readonly xentialApiSjabloonService: XentialApiSjabloonService
    ) {
    }

    readonly firstGroupId$ = new BehaviorSubject<string>('')
    readonly secondGroupId$ = new BehaviorSubject<string>('')

    readonly xentialFirstGroupSelectItems$: Observable<Array<{ id: string; text: string }>> =
        combineLatest([
            this.xentialApiSjabloonService.getTemplates(),
        ]).pipe(
            map(([sjablonenList]) =>
                sjablonenList.sjabloongroepen.map(configuration => ({
                    id: configuration.id,
                    text: configuration.naam
                }))
            )
        );


    readonly xentialSecondGroupSelectItems$ = this.firstGroupId$.pipe(
        startWith(null),
        filter((firstGroupId) => !!firstGroupId),
        switchMap((firstGroupId) => this.xentialApiSjabloonService.getTemplates(firstGroupId)),
        map((sjablonenList) =>
            sjablonenList.sjabloongroepen.map(configuration => ({
                id: configuration.id,
                text: configuration.naam
            }))
        )
    )

    readonly xentialThirdGroupSelectItems$ = this.secondGroupId$.pipe(
        startWith(null),
        filter((secondGroupId) => !!secondGroupId),
        switchMap((secondGroupId) => this.xentialApiSjabloonService.getTemplates(secondGroupId)),
        map((sjablonenList) =>
            sjablonenList.sjabloongroepen.map(configuration => ({
                id: configuration.id,
                text: configuration.naam
            }))
        )
    )

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

    private readonly formValue$ = new BehaviorSubject<PrepareContentWithTextTemplate | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: PrepareContentWithTextTemplate): void {

        if (formValue.firstTemplateGroupId &&
            formValue.firstTemplateGroupId != this.currentFirstTemplateGroupId) {
            this.currentFirstTemplateGroupId = formValue.firstTemplateGroupId
            this.firstGroupId$.next(formValue.firstTemplateGroupId)
        }
        if (formValue.secondTemplateGroupId &&
            formValue.secondTemplateGroupId != this.currentSecondTemplateGroupId) {
            this.secondGroupId$.next(formValue.secondTemplateGroupId)
            this.currentSecondTemplateGroupId = formValue.secondTemplateGroupId
        }

        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: PrepareContentWithTextTemplate): void {
        const valid = !!(
            formValue.xentialContentId &&
            formValue.textTemplateId &&
            formValue.firstTemplateGroupId &&
            formValue.fileFormat &&
            formValue.documentId &&
            formValue.eventMessageName
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

    currentFirstTemplateGroupId: string = "notset"
    currentSecondTemplateGroupId: string = "notset"
}
