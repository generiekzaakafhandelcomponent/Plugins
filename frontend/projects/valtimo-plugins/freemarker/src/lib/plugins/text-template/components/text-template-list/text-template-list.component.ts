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
import {BehaviorSubject, filter, map, Observable, switchMap, take} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CarbonListComponent, ColumnConfig, ViewType} from '@valtimo/components';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {TemplateListItem} from '../../../../models';

@Component({
    templateUrl: './text-template-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    private readonly _caseDefinitionName$: Observable<string> = this.route.params.pipe(
        map(params => params?.name),
        filter(caseDefinitionName => !!caseDefinitionName),
    );

    public readonly templates$ = new BehaviorSubject<TemplateListItem[] | null>(null);
    public readonly showAddModal$ = new BehaviorSubject<boolean>(false);
    public readonly showDeleteModal$ = new BehaviorSubject<boolean>(false);
    public readonly selectedRowKeys$ = new BehaviorSubject<Array<string>>([]);
    public readonly loading$ = new BehaviorSubject<boolean>(true);

    constructor(
        private readonly templateService: FreemarkerTemplateManagementService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
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

        this._caseDefinitionName$.pipe(
            take(1),
            switchMap(caseDefinitionName => this.templateService.addTemplate({caseDefinitionName, type: 'text', ...data}))
        ).subscribe(template => {
            this.showAddModal$.next(false);
            this.gotoTextTemplateEditor(template.caseDefinitionName, template.key);
        });
    }

    public showDeleteModal(): void {
        this.setSelectedTemplateKeys();
        this.showDeleteModal$.next(true);
    }

    public onDelete(templates: Array<string>): void {
        this.loading$.next(true);
        this._caseDefinitionName$.pipe(
            take(1),
            switchMap(caseDefinitionName => this.templateService.deleteTemplates({caseDefinitionName, type: 'text', templates})),
        ).subscribe(_ => {
            this.reloadTemplateList();
        });
    }

    public onRowClick(template: TemplateListItem): void {
        this._caseDefinitionName$.pipe(take(1)).subscribe(caseDefinitionName =>
            this.gotoTextTemplateEditor(caseDefinitionName, template.key)
        );
    }

    private gotoTextTemplateEditor(caseDefinitionName: string, key: string): void {
        this.router.navigate([`/dossier-management/dossier/${caseDefinitionName}/text-template/${key}`])
    }

    private reloadTemplateList(): void {
        this.loading$.next(true);
        this._caseDefinitionName$.pipe(
            switchMap(caseDefinitionName => this.templateService.getAllTextTemplates(caseDefinitionName)),
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
