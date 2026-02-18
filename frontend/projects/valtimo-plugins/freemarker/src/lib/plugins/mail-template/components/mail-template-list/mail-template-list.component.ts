/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

import {ChangeDetectionStrategy, Component, OnInit, ViewChild,} from '@angular/core';
import {BehaviorSubject, combineLatest, filter, map, merge, Observable, startWith, switchMap, take, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CarbonListComponent, CarbonListModule, ColumnConfig, ViewType} from '@valtimo/components';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {TemplateListItem} from '../../../../models';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MailTemplateDeleteModalComponent} from '../mail-template-delete-modal/mail-template-delete-modal.component';
import {MailTemplateAddEditModalComponent} from '../mail-template-add-edit-modal/mail-template-add-edit-modal.component';
import {
    BuildingBlockManagementParams,
    CaseManagementParams,
    EnvironmentService,
    getBuildingBlockManagementRouteParams,
    getCaseManagementRouteParams
} from '@valtimo/shared';
import {ButtonModule} from 'carbon-components-angular';

@Component({
    standalone: true,
    templateUrl: './mail-template-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        CarbonListModule,
        ButtonModule,
        TranslateModule,
        MailTemplateDeleteModalComponent,
        MailTemplateAddEditModalComponent
    ]
})
export class MailTemplateListComponent implements OnInit {
    @ViewChild(CarbonListComponent) carbonList: CarbonListComponent;

    public fields: ColumnConfig[] = [
        {
            viewType: ViewType.TEXT,
            key: 'key',
            label: 'Key',
        },
    ];

    private readonly _caseDefinitionId$: Observable<CaseManagementParams> = getCaseManagementRouteParams(this.route).pipe(
        filter((params: CaseManagementParams | undefined) => !!params?.caseDefinitionKey),
    );

    private readonly _buildingBlockDefinitionId$: Observable<BuildingBlockManagementParams> = getBuildingBlockManagementRouteParams(this.route).pipe(
        filter((params: BuildingBlockManagementParams | undefined) => !!params?.buildingBlockDefinitionKey),
    );

    private readonly _params$: Observable<{case?: CaseManagementParams, buildingBlock?: BuildingBlockManagementParams}> = merge(
        this._caseDefinitionId$.pipe(map(params => ({case: params}))),
        this._buildingBlockDefinitionId$.pipe(map(params => ({buildingBlock: params})))
    );

    public readonly readOnly$: Observable<boolean> = this._params$.pipe(
        switchMap(({case: caseDefinitionId, buildingBlock: buildingBlockDefinitionId}) => combineLatest([
                this.environmentService.canUpdateGlobalConfiguration(),
                this.templateService.isFinal(caseDefinitionId, buildingBlockDefinitionId)
            ]).pipe(
                map(([canUpdateGlobal, isFinalCase]) => !canUpdateGlobal || isFinalCase),
                startWith(true)
            )
        )
    );

    public readonly templates$ = new BehaviorSubject<TemplateListItem[] | null>(null);
    public readonly showAddModal$ = new BehaviorSubject<boolean>(false);
    public readonly showDeleteModal$ = new BehaviorSubject<boolean>(false);
    public readonly selectedRowKeys$ = new BehaviorSubject<Array<any>>([]);
    public readonly loading$ = new BehaviorSubject<boolean>(true);

    constructor(
        private readonly templateService: FreemarkerTemplateManagementService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly environmentService: EnvironmentService,
    ) {
    }

    public ngOnInit(): void {
        this.reloadTemplateList();
    }

    public openAddModal(): void {
        this.showAddModal$.next(true);
    }

    public onAdd(data?: any): void {
        if (!data) {
            this.showAddModal$.next(false);
            return;
        }

        this._params$.pipe(
            take(1),
            switchMap(({case: caseDefinitionId, buildingBlock: buildingBlockDefinitionId}) => this.templateService.addTemplate({
                caseDefinitionKey: caseDefinitionId?.caseDefinitionKey,
                caseDefinitionVersionTag: caseDefinitionId?.caseDefinitionVersionTag,
                buildingBlockDefinitionKey: buildingBlockDefinitionId?.buildingBlockDefinitionKey,
                buildingBlockDefinitionVersionTag: buildingBlockDefinitionId?.buildingBlockDefinitionVersionTag,
                type: 'mail', ...data
            }))
        ).subscribe(template => {
            this.showAddModal$.next(false);
            this.gotoMailTemplateEditor(
                template.caseDefinitionKey,
                template.caseDefinitionVersionTag,
                template.buildingBlockDefinitionKey,
                template.buildingBlockDefinitionVersionTag,
                template.key
            );
        });
    }

    public showDeleteModal(): void {
        this.setSelectedTemplateKeys();
        this.showDeleteModal$.next(true);
    }

    public onDelete(templates: Array<any>): void {
        this.loading$.next(true);
        this._params$.pipe(
            take(1),
            switchMap(({case: caseDefinitionId, buildingBlock: buildingBlockDefinitionId}) => this.templateService.deleteTemplates({
                caseDefinitionKey: caseDefinitionId?.caseDefinitionKey,
                caseDefinitionVersionTag: caseDefinitionId?.caseDefinitionVersionTag,
                buildingBlockDefinitionKey: buildingBlockDefinitionId?.buildingBlockDefinitionKey,
                buildingBlockDefinitionVersionTag: buildingBlockDefinitionId?.buildingBlockDefinitionVersionTag,
                templates
            })),
        ).subscribe(_ => {
            this.reloadTemplateList();
        });
    }

    public onRowClick(template: TemplateListItem): void {
        this._params$.pipe(take(1)).subscribe(({case: caseDefinitionId, buildingBlock: buildingBlockDefinitionId}) =>
            this.gotoMailTemplateEditor(
                caseDefinitionId?.caseDefinitionKey,
                caseDefinitionId?.caseDefinitionVersionTag,
                buildingBlockDefinitionId?.buildingBlockDefinitionKey,
                buildingBlockDefinitionId?.buildingBlockDefinitionVersionTag,
                template.key
            )
        );
    }

    private gotoMailTemplateEditor(
        caseDefinitionKey: string,
        caseDefinitionVersionTag: string,
        buildingBlockDefinitionKey: string,
        buildingBlockDefinitionVersionTag: string,
        key: string
    ): void {
        if (caseDefinitionKey) {
            this.router.navigate([`/case-management/case/${caseDefinitionKey}/version/${caseDefinitionVersionTag}/mail-template/${key}`]);
        } else {
            this.router.navigate([`/building-block-management/building-block/${buildingBlockDefinitionKey}/version/${buildingBlockDefinitionVersionTag}/mail-template/${key}`]);
        }
    }

    private reloadTemplateList(): void {
        this.loading$.next(true);
        this._params$.pipe(
            switchMap(({case: caseDefinitionId, buildingBlock: buildingBlockDefinitionId}) => this.templateService.getAllMailTemplates(caseDefinitionId, buildingBlockDefinitionId)),
            map(templatePage => templatePage.content),
            take(1)
        ).subscribe(templateListItems => {
            this.templates$.next(templateListItems);
            this.loading$.next(false);
        });
    }

    private setSelectedTemplateKeys(): void {
        this.selectedRowKeys$.next(this.carbonList.selectedItems.map((template: TemplateListItem) => ({key: template.key, type: template.type})));
    }
}
