import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take, tap} from 'rxjs';
import {Recipient, SendMailActionConfig} from '../../models';
import {
    ActionItem,
    ColumnConfig, ListItemWithId,
    ModalComponent,
    MoveRowDirection,
    MoveRowEvent,
    MultiInputOutput,
    MultiInputValues,
    SelectItem,
    TableColumn,
    ViewType,
} from '@valtimo/components';

@Component({
    selector: 'spotler-send-mail-action-configuration',
    templateUrl: './send-mail-action-configuration.component.html',
    styleUrls: ['./send-mail-action-configuration.component.scss'],
})
export class SendMailActionConfigurationComponent
    // The component explicitly implements the FunctionConfigurationComponent interface
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$: Observable<void>;
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<SendMailActionConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<SendMailActionConfig> =
        new EventEmitter<SendMailActionConfig>();

    private saveSubscription!: Subscription;

    private readonly formValue$ = new BehaviorSubject<SendMailActionConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    public readonly recipientTypes: SelectItem[] = [
        {
            id: "TO",
            text: "TO",
            translationKey: "to"
        },
        {
            id: "BCC",
            text: "BCC",
            translationKey: "bcc"
        },
        {
            id: "CC",
            text: "CC",
            translationKey: "cc"
        }
    ]

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy() {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: SendMailActionConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: SendMailActionConfig): void {
        const valid = !!(formValue.subject
            && formValue.senderEmail
            && this.validateEmail(formValue.senderEmail)
            && formValue.senderName
            && formValue.recipients
            && formValue.recipients.every(recipient => !!(recipient.email
                    && this.validateEmail(recipient.email)
                    && recipient.name
                    && recipient.type
                )
            )
            && formValue.mailTemplateIdentifier);

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

    private validateEmail(email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
