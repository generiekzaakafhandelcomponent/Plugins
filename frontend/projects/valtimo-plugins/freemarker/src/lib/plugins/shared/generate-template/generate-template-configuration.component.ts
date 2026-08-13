/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent, FunctionConfigurationData, PluginTranslationService} from '@valtimo/plugin';
import {
    ModalService,
    RadioValue,
    SelectItem,
    ValuePathSelectorPrefix,
    ValuePathSelectorService,
    ValuePathType,
} from '@valtimo/components';
import {DocumentService} from '@valtimo/document';
import {Page} from '@valtimo/config';
import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    filter,
    map,
    Observable,
    of,
    skip,
    Subject,
    Subscription,
    switchMap,
    take,
    takeUntil,
    tap,
} from 'rxjs';
import {FreemarkerTemplateManagementService} from '../../../services';
import {TemplateListItem} from '../../../models';

export type TemplateKeyInputType = 'selection' | 'text' | 'value-resolver';

/**
 * Shared base for all "generate template content" plugin actions. It renders a radio toggle that
 * lets the user choose how the template key is provided:
 *  - selection: a dropdown of existing templates (the original behaviour)
 *  - text: a free text input for a literal key or a value-resolver expression (e.g. pv:/doc:)
 *  - value-resolver: a dropdown of doc:/case: fields resolvable for the case
 *
 * The resulting value is stored under {@link keyFieldName}. Because the Valtimo plugin framework
 * resolves placeholder expressions in action properties at runtime, the backend keeps receiving a
 * plain template key string and needs no changes.
 */
@Directive()
export abstract class GenerateTemplateConfigurationComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<FunctionConfigurationData>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    /** The config property name the chosen template key is stored under (e.g. 'textTemplateKey'). */
    abstract readonly keyFieldName: string;
    /** Default value for the process variable name input. */
    abstract readonly defaultProcessVariableName: string;
    /** Translation key for the action description paragraph. */
    abstract readonly descriptionKey: string;
    /** Translation key for the template key field label. */
    abstract readonly keyTitleKey: string;
    /** Translation key for the template key field tooltip (selection mode). */
    abstract readonly keyTooltipKey: string;

    /** Loads the available templates for the resolved case/document definition. */
    protected abstract fetchTemplates(documentDefinitionName: string): Observable<Page<TemplateListItem>>;

    readonly ValuePathSelectorPrefix = ValuePathSelectorPrefix;
    readonly valuePathSelectorPrefixes = [ValuePathSelectorPrefix.DOC, ValuePathSelectorPrefix.CASE];

    private saveSubscription!: Subscription;
    protected readonly _subscriptions = new Subscription();
    protected readonly _destroy$ = new Subject<void>();
    protected readonly formValue$ = new BehaviorSubject<FunctionConfigurationData | null>(null);
    protected readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly loading$ = new BehaviorSubject<boolean>(true);
    readonly templateItems$ = new BehaviorSubject<Array<SelectItem>>([]);
    readonly selectedInputType$ = new BehaviorSubject<TemplateKeyInputType>('selection');
    /**
     * The input type the radio group starts on. Resolved once, before the form is rendered, so the
     * radio is not reset while the user is interacting with it.
     */
    readonly defaultInputType$ = new BehaviorSubject<TemplateKeyInputType>('selection');

    private readonly documentDefinitionName$ = new BehaviorSubject<string | null>(null);

    /**
     * The resolvable value-resolver keys (doc:/case: fields) for the active case, shown as a
     * dropdown in 'value-resolver' mode.
     *
     * This stream is subscribed as soon as the form renders, regardless of the selected input type,
     * so a failing lookup must not propagate: an error here would reach the async pipe and leave the
     * dropdown loading forever. Any failure resolves to an empty list instead.
     */
    readonly valueResolverItems$: Observable<Array<SelectItem>> = this.documentDefinitionName$.pipe(
        filter((name): name is string => !!name),
        switchMap(name =>
            this.valuePathSelectorService
                .getResolvableKeys(this.valuePathSelectorPrefixes, name, ValuePathType.FIELD)
                .pipe(catchError(() => of([])))
        ),
        map(items => items.map(item => ({id: item.path, text: item.path}))),
        catchError(() => of<Array<SelectItem>>([])),
    );

    readonly inputTypeRadioValues$: Observable<Array<RadioValue>> = this.translateService.stream('key').pipe(
        map(() => [
            {value: 'selection', title: this.pluginTranslationService.instant('inputTypeSelection', this.pluginId)},
            {value: 'text', title: this.pluginTranslationService.instant('inputTypeText', this.pluginId)},
            {value: 'value-resolver', title: this.pluginTranslationService.instant('inputTypeValueResolver', this.pluginId)},
        ]),
    );

    constructor(
        protected readonly modalService: ModalService,
        protected readonly documentService: DocumentService,
        protected readonly templateService: FreemarkerTemplateManagementService,
        protected readonly translateService: TranslateService,
        protected readonly pluginTranslationService: PluginTranslationService,
        protected readonly valuePathSelectorService: ValuePathSelectorService,
    ) {
    }

    ngOnInit(): void {
        this.openSaveSubscription();
        this.initInputType();
        this.initTemplateItems();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
        this._subscriptions.unsubscribe();
        this._destroy$.next();
        this._destroy$.complete();
    }

    formValueChange(formValue: FunctionConfigurationData): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);

        if (formValue.templateKeyInputType) {
            this.selectedInputType$.next(formValue.templateKeyInputType);
        }
    }

    /** Reads the prefilled template key for the active key field name. */
    prefillKey(prefill: FunctionConfigurationData | null): string | undefined {
        return prefill ? prefill[this.keyFieldName] : undefined;
    }

    private handleValid(formValue: FunctionConfigurationData): void {
        const valid = !!(formValue[this.keyFieldName] && formValue.processVariableName);

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(() => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    if (valid) {
                        this.configuration.emit(formValue!);
                    }
                });
        });
    }

    /**
     * Picks the input type the form opens on: the saved one when the configuration is being edited,
     * otherwise the template dropdown when there are templates to choose from, and the free text
     * input when there are none — an empty, required dropdown would be a dead end. That happens when
     * the process the action belongs to is not linked to a case, so no templates can be scoped.
     */
    private initInputType(): void {
        const inputTypeSubscription = combineLatest([
            (this.prefillConfiguration$ ?? of(null)).pipe(take(1)),
            // templateItems$ is seeded with an empty list; skip it and take the first loaded one
            this.templateItems$.pipe(skip(1), take(1)),
        ])
            .pipe(take(1))
            .subscribe(([prefill, templateItems]) => {
                const inputType =
                    (prefill?.['templateKeyInputType'] as TemplateKeyInputType) ||
                    (templateItems.length ? 'selection' : 'text');

                this.defaultInputType$.next(inputType);
                this.selectedInputType$.next(inputType);
            });
        this._subscriptions.add(inputTypeSubscription);
    }

    /**
     * Loads the templates of the case(s) the process is linked to. Any failure resolves to an empty
     * list instead of killing the stream: the view is rendered either way, so the configuration never
     * stalls on the loading spinner.
     */
    private initTemplateItems(): void {
        this.modalService.modalData$
            .pipe(
                switchMap(params =>
                    this.documentService
                        .findProcessDocumentDefinitionsByProcessDefinitionKey(params?.processDefinitionKey)
                        .pipe(catchError(() => of([])))
                ),
                tap(processDocumentDefinitions =>
                    this.documentDefinitionName$.next(
                        processDocumentDefinitions?.[0]?.id?.documentDefinitionId?.name ?? null
                    )
                ),
                switchMap(processDocumentDefinitions =>
                    combineLatest([
                        of<Page<TemplateListItem>>({content: []} as Page<TemplateListItem>),
                        ...processDocumentDefinitions.map(processDocumentDefinition =>
                            this.fetchTemplates(processDocumentDefinition.id.documentDefinitionId.name).pipe(
                                catchError(() => of({content: []} as Page<TemplateListItem>)),
                            )
                        ),
                    ])
                ),
                map(results =>
                    results
                        .flatMap(result => result.content)
                        .map(template => ({
                            id: template.key,
                            text: template.key,
                        }))
                ),
                catchError(() => of<Array<SelectItem>>([])),
                takeUntil(this._destroy$),
            )
            .subscribe(templateItems => {
                // the items are published before loading is cleared, so the form is rendered with the
                // input type that initInputType() derives from them
                this.templateItems$.next(templateItems);
                this.loading$.next(false);
            });
    }
}
