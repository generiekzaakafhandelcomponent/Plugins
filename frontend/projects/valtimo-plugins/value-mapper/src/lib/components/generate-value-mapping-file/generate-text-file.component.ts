/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, of, Subscription, switchMap, take, tap} from 'rxjs';
import {GenerateTextFileConfig} from '../../models';
import {FunctionConfigurationData} from '@valtimo/plugin/lib/models/plugin';
import {ModalService, SelectItem} from '@valtimo/components';
import {DocumentService} from '@valtimo/document';
import {FreemarkerTemplateManagementService} from '../../../../services';

@Component({
    selector: 'valtimo-generate-text-file-configuration',
    templateUrl: './generate-text-file.component.html',
})
export class GenerateTextFileComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<GenerateTextFileConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<GenerateTextFileConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly loading$ = new BehaviorSubject<boolean>(true);

    readonly textTemplateItems$: Observable<Array<SelectItem>> = this.modalService.modalData$.pipe(
        switchMap(params =>
            this.documentService.findProcessDocumentDefinitionsByProcessDefinitionKey(
                params?.processDefinitionKey
            )
        ),
        switchMap(processDocumentDefinitions =>
            combineLatest([
                of({content: []}),
                ...processDocumentDefinitions.map(processDocumentDefinition =>
                    this.templateService.getAllTextTemplates(
                        processDocumentDefinition.id.documentDefinitionId.name
                    )
                ),
            ])
        ),
        map(results => {
            return results
                .flatMap(result => result.content)
                .map(template => ({
                    id: template.key,
                    text: template.key,
                }));
        }),
        tap(() => {
            this.loading$.next(false);
        })
    );

    constructor(
        private readonly modalService: ModalService,
        private readonly documentService: DocumentService,
        private readonly templateService: FreemarkerTemplateManagementService
    ) {
    }

    ngOnInit(): void {
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: GenerateTextFileConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: GenerateTextFileConfig): void {
        const valid = !!(formValue.textTemplateKey && formValue.processVariableName);

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    if (valid) {
                        this.configuration.emit(formValue!);
                    }
                });
        });
    }
}
