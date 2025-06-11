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
import {BehaviorSubject, combineLatest, filter, map, Observable, startWith, switchMap, take} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CarbonListComponent, CarbonListModule, ColumnConfig, ViewType} from '@valtimo/components';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {TemplateListItem} from '../../../../models';
import {CaseManagementParams, EnvironmentService, getCaseManagementRouteParams} from '@valtimo/shared';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'carbon-components-angular';
import {TranslateModule} from '@ngx-translate/core';
import {TextTemplateDeleteModalComponent} from '../text-template-delete-modal/text-template-delete-modal.component';
import {TextTemplateAddEditModalComponent} from '../text-template-add-edit-modal/text-template-add-edit-modal.component';

@Component({
    standalone: true,
    templateUrl: './text-template-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        CarbonListModule,
        ButtonModule,
        TranslateModule,
        TextTemplateDeleteModalComponent,
        TextTemplateAddEditModalComponent
    ]
})
export class TextTemplateListComponent implements OnInit {
    @ViewChild(CarbonListComponent) carbonList: CarbonListComponent;

    public fields: ColumnConfig[] = [
        {
            viewType: ViewType.TEXT,
            key: 'key',
            label: 'Key',
        },
        {
            viewType: ViewType.BOOLEAN,
            key: 'readOnly',
            label: 'Read only',
        },
    ];

    private readonly _caseDefinitionId$: Observable<CaseManagementParams> = getCaseManagementRouteParams(this.route).pipe(
        filter((params: CaseManagementParams | undefined) => !!params?.caseDefinitionKey),
    );

    public readonly readOnly$: Observable<boolean> = this._caseDefinitionId$.pipe(
        switchMap(caseDefinitionId => combineLatest([
                this.environmentService.canUpdateGlobalConfiguration(),
                this.templateService.isFinal(caseDefinitionId.caseDefinitionKey, caseDefinitionId.caseDefinitionVersionTag)
            ]).pipe(
                map(([canUpdateGlobal, isFinalCase]) => !canUpdateGlobal || isFinalCase),
                startWith(true)
            )
        )
    );

    public readonly templates$ = new BehaviorSubject<TemplateListItem[] | null>(null);
    public readonly showAddModal$ = new BehaviorSubject<boolean>(false);
    public readonly showDeleteModal$ = new BehaviorSubject<boolean>(false);
    public readonly selectedRowKeys$ = new BehaviorSubject<Array<string>>([]);
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

        this._caseDefinitionId$.pipe(
            take(1),
            switchMap(caseDefinitionId => this.templateService.addTemplate({
                caseDefinitionKey: caseDefinitionId.caseDefinitionKey,
                caseDefinitionVersionTag: caseDefinitionId.caseDefinitionVersionTag,
                type: 'text', ...data
            }))
        ).subscribe(template => {
            this.showAddModal$.next(false);
            this.gotoTextTemplateEditor(template.caseDefinitionKey, template.caseDefinitionVersionTag, template.key);
        });
    }

    public showDeleteModal(): void {
        this.setSelectedTemplateKeys();
        this.showDeleteModal$.next(true);
    }

    public onDelete(templates: Array<string>): void {
        this.loading$.next(true);
        this._caseDefinitionId$.pipe(
            take(1),
            switchMap(caseDefinitionId => this.templateService.deleteTemplates({
                caseDefinitionKey: caseDefinitionId.caseDefinitionKey,
                caseDefinitionVersionTag: caseDefinitionId.caseDefinitionVersionTag,
                type: 'text',
                templates
            })),
        ).subscribe(_ => {
            this.reloadTemplateList();
        });
    }

    public onRowClick(template: TemplateListItem): void {
        this._caseDefinitionId$.pipe(take(1)).subscribe(caseDefinitionId =>
            this.gotoTextTemplateEditor(caseDefinitionId.caseDefinitionKey, caseDefinitionId.caseDefinitionVersionTag, template.key)
        );
    }

    private gotoTextTemplateEditor(caseDefinitionKey: string, caseDefinitionVersionTag: string, key: string): void {
        this.router.navigate([`/case-management/case/${caseDefinitionKey}/version/${caseDefinitionVersionTag}/text-template/${key}`]);
    }

    private reloadTemplateList(): void {
        this.loading$.next(true);
        this._caseDefinitionId$.pipe(
            switchMap(caseDefinitionId => this.templateService.getAllTextTemplates(caseDefinitionId.caseDefinitionKey, caseDefinitionId.caseDefinitionVersionTag)),
            map(templatePage => templatePage.content),
            take(1)
        ).subscribe(templateListItems => {
            this.templates$.next(templateListItems);
            this.loading$.next(false);
        });
    }

    private setSelectedTemplateKeys(): void {
        this.selectedRowKeys$.next(this.carbonList.selectedItems.map((template: TemplateListItem) => template.key));
    }
}
