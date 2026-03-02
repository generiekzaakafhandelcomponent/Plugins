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
import {BehaviorSubject, combineLatest, filter, map, merge, Observable, of, Subject, Subscription, switchMap, take, takeUntil, tap} from 'rxjs';
import {GenerateMailFileConfig} from '../../models';
import {SelectItem} from '@valtimo/components';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {
  BuildingBlockManagementParams,
  CaseManagementParams,
  getBuildingBlockManagementRouteParams,
  ManagementContext
} from '@valtimo/shared';
import {ActivatedRoute} from '@angular/router';

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

    private readonly buildingBlockParams$ = getBuildingBlockManagementRouteParams(this.route);
    private readonly formValue$ = new BehaviorSubject<GenerateMailFileConfig | null>(null);
    private readonly valid$ = new BehaviorSubject<boolean>(false);
    private _subscriptions = new Subscription();

    readonly loading$ = new BehaviorSubject<boolean>(true);

    readonly mailTemplateItems$ = new BehaviorSubject<Array<SelectItem>>([]);

    private readonly _destroy$ = new Subject<void>();

    constructor(
        private readonly templateService: FreemarkerTemplateManagementService,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.openSaveSubscription();
        this.initContextHandling();
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
        this._destroy$.next();
        this._destroy$.complete();
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
        const caseParams$ = this.context$.pipe(
            filter(([managementContext, caseParams]) => managementContext === 'case' && !!caseParams?.caseDefinitionKey),
            map(([managementContext, caseParams]) => ({managementContext, caseParams}))
        );

        const buildingBlockParams$ = this.buildingBlockParams$.pipe(
            filter(buildingBlockParams => !!buildingBlockParams?.buildingBlockDefinitionKey),
            map(buildingBlockParams => ({managementContext: 'buildingBlock' as ManagementContext, buildingBlockParams}))
        );

        merge(caseParams$, buildingBlockParams$).pipe(
            filter(params => !!params),
            switchMap(params => {
                if (params!.managementContext === 'case') {
                    return this.templateService.getAllMailTemplates((params as any).caseParams, null);
                } else if (params!.managementContext === 'buildingBlock') {
                    return this.templateService.getAllMailTemplates(null, (params as any).buildingBlockParams);
                } else {
                    console.error(`Freemarker plugin does not support '${params!.managementContext}' templates`);
                    return of(null);
                }
            }),
            map(results =>
                results?.content.map(template => ({
                    id: template.key,
                    text: template.key,
                })) || []
            ),
            tap(() => this.loading$.next(false)),
            takeUntil(this._destroy$)
        ).subscribe(results => this.mailTemplateItems$.next(results));
    }

}
