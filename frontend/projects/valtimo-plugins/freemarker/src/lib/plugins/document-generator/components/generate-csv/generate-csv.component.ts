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
import {FunctionConfigurationComponent, FunctionConfigurationData} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, map, Observable, Subscription, switchMap, take} from 'rxjs';
import {GenerateCsvFileConfig} from '../../models';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {CaseManagementParams, ManagementContext} from '@valtimo/shared';
import {SelectItem} from '@valtimo/components';

@Component({
    standalone: false,
    selector: 'valtimo-generate-csv-configuration',
    templateUrl: './generate-csv.component.html',
})
export class GenerateCsvComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() prefillConfiguration$!: Observable<GenerateCsvFileConfig>;
    @Input() context$: Observable<[ManagementContext, CaseManagementParams]>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private saveSubscription!: Subscription;
    private readonly formValue$ = new BehaviorSubject<GenerateCsvFileConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly loading$ = new BehaviorSubject<boolean>(true);

    readonly templateListItems$ = new BehaviorSubject<Array<SelectItem>>(undefined);

    constructor(
        private readonly templateService: FreemarkerTemplateManagementService
    ) {
    }

    ngOnInit(): void {
        this.loadTemplateListItems();
        this.openSaveSubscription();
    }

    ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    formValueChange(formValue: GenerateCsvFileConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private loadTemplateListItems() {
        this.context$.pipe(
            switchMap(([_, params]) => this.templateService.getAllTemplates(
                params.caseDefinitionKey,
                params.caseDefinitionVersionTag,
                'csv'
            )),
            map(results => results.content.map(template => ({
                id: template.key,
                text: template.key,
            })))
        ).subscribe(templateListItems => {
                this.templateListItems$.next(templateListItems);
                this.loading$.next(false);
            }
        );
    }

    private handleValid(formValue: GenerateCsvFileConfig): void {
        const valid = !!(formValue.templateKey && formValue.processVariableName);

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
