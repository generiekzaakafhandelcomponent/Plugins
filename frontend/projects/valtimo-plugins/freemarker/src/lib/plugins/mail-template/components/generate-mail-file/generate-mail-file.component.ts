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
import {BehaviorSubject, combineLatest, map, Observable, of, Subscription, switchMap, take, tap} from 'rxjs';
import {GenerateMailFileConfig} from '../../models';
import {SelectItem} from '@valtimo/components';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {CaseManagementParams, ManagementContext} from '@valtimo/shared';

@Component({
    standalone: false,
    selector: 'valtimo-generate-mail-file-configuration',
    templateUrl: './generate-mail-file.component.html',
})
export class GenerateMailFileComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() save$!: Observable<void>;
    @Input() disabled$!: Observable<boolean>;
    @Input() pluginId!: string;
    @Input() context$: Observable<[ManagementContext, CaseManagementParams]>;
    @Input() prefillConfiguration$!: Observable<GenerateMailFileConfig>;
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

    private readonly formValue$ = new BehaviorSubject<GenerateMailFileConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);
    private _subscriptions = new Subscription();

    readonly loading$ = new BehaviorSubject<boolean>(true);

    readonly mailTemplateItems$ = new BehaviorSubject<Array<SelectItem>>([]);

    constructor(
        private readonly templateService: FreemarkerTemplateManagementService
    ) {
    }

    ngOnInit(): void {
        this.openSaveSubscription();
        this.initContextHandling();
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    formValueChange(formValue: GenerateMailFileConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: GenerateMailFileConfig): void {
        const valid = !!(formValue.mailTemplateKey && formValue.processVariableName);

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        const saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    if (valid) {
                        this.configuration.emit(formValue!);
                    }
                });
        });
        this._subscriptions.add(saveSubscription);
    }

    private initContextHandling(): void {
        if (!this.context$) {
            return;
        }

        const contextSub = this.context$.pipe(
            switchMap(([managementContext, caseDefinitionId]) => {
                    if (managementContext == 'case') {
                        return this.templateService.getAllMailTemplates(
                            caseDefinitionId?.caseDefinitionKey,
                            caseDefinitionId?.caseDefinitionVersionTag,
                        );
                    } else {
                        console.error('Freemarker plugin does not support global templates')
                        return of(null);
                    }
                }
            ),
            map(results =>
                results?.content.map(template => ({
                    id: template.key,
                    text: template.key,
                })) || []
            ),
            tap(() => this.loading$.next(false))
        )
            .subscribe(results => this.mailTemplateItems$.next(results));

        this._subscriptions.add(contextSub);
    }

}
