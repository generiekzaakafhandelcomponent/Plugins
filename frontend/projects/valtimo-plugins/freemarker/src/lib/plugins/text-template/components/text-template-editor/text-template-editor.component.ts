/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, filter, map, Observable, switchMap, take, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, EditorModel, PageTitleService} from '@valtimo/components';
import {NotificationService} from 'carbon-components-angular';
import {TranslateService} from '@ngx-translate/core';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {TemplateResponse} from '../../../../models';
import {CaseManagementParams, EnvironmentService, getCaseManagementRouteParams} from '@valtimo/shared';
import {CommonModule} from '@angular/common';
import {TextTemplateDeleteModalComponent} from '../text-template-delete-modal/text-template-delete-modal.component';

@Component({
    standalone: true,
    templateUrl: './text-template-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./text-template-editor.component.scss'],
    providers: [NotificationService],
    imports: [
        CommonModule,
        TranslateModule,
        TabsModule,
        DialogModule,
        TextTemplateDeleteModalComponent,
        CarbonListModule,
        ButtonModule,
        EditorModule,
        RenderInPageHeaderDirective,
        IconModule,
    ]
})
export class TextTemplateEditorComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly model$ = new BehaviorSubject<EditorModel | null>(null);
    public readonly template$ = new BehaviorSubject<TemplateResponse | null>(null);
    public readonly saveDisabled$ = new BehaviorSubject<boolean>(true);
    public readonly editorDisabled$ = new BehaviorSubject<boolean>(false);
    public readonly moreDisabled$ = new BehaviorSubject<boolean>(true);
    public readonly showDeleteModal$ = new BehaviorSubject<boolean>(false);
    public readonly updatedModelValue$ = new BehaviorSubject<string>('');

    private readonly _caseDefinitionName$: Observable<string> =
        this.route.params.pipe(
            map(params => params?.name),
            filter(caseDefinitionName => !!caseDefinitionName)
        );

    public readonly templateKey$: Observable<string> = combineLatest([this.route.params, this.route.parent.params]).pipe(
        map(([params, parentParams]) => params?.templateKey || parentParams?.templateKey),
        filter(templateKey => !!templateKey)
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

    constructor(
        private readonly templateService: FreemarkerTemplateManagementService,
        private readonly route: ActivatedRoute,
        private readonly pageTitleService: PageTitleService,
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly translateService: TranslateService,
        private readonly breadcrumbService: BreadcrumbService,
        private readonly environmentService: EnvironmentService,
    ) {
    }

    public ngOnInit(): void {
        this.loadTemplate();
    }

    public ngAfterViewInit(): void {
        this.initBreadcrumb();
    }

    public ngOnDestroy(): void {
        this.pageTitleService.enableReset();
        this.breadcrumbService.clearThirdBreadcrumb();
        this.breadcrumbService.clearFourthBreadcrumb();
    }

    public onValid(valid: boolean): void {
        this.saveDisabled$.next(valid === false);
    }

    public onValueChange(value: string): void {
        this.updatedModelValue$.next(value);
    }

    public updateTemplate(): void {
        this.disableEditor();
        this.disableSave();
        this.disableMore();

        combineLatest([this.updatedModelValue$, this._caseDefinitionName$, this.templateKey$]).pipe(
            switchMap(([updatedModelValue, caseDefinitionName, templateKey]) =>
                this.templateService.updateTemplate(
                    {
                        key: templateKey,
                        caseDefinitionName,
                        type: 'text',
                        content: updatedModelValue,
                    }
                )
            ),
            take(1)
        ).subscribe({
            next: result => {
                this.enableMore();
                this.enableSave();
                this.enableEditor();
                this.showSuccessMessage(result.key);
                this.setModel(result.content);
                this.template$.next(result);
            },
            error: () => {
                this.enableMore();
                this.enableSave();
                this.enableEditor();
            },
        });
    }

    public onDelete(templates: Array<any>): void {
        this.disableEditor();
        this.disableSave();
        this.disableMore();

        this._caseDefinitionName$.pipe(take(1)).subscribe(caseDefinitionName =>
            this.templateService.deleteTemplates({caseDefinitionName, type: 'text', templates}).pipe(take(1)).subscribe(_ =>
                this.router.navigate([`/dossier-management/dossier/${caseDefinitionName}`])
            )
        );
    }

    public showDeleteModal(): void {
        this.showDeleteModal$.next(true);
    }

    private loadTemplate(): void {
        combineLatest([this._caseDefinitionName$, this.templateKey$]).pipe(
            tap(([_, key]) => {
                this.pageTitleService.setCustomPageTitle(`Text Template: ${key}`, true);
            }),
            switchMap(([caseDefinitionName, key]) => this.templateService.getTextTemplate(caseDefinitionName, key)),
            take(1),
        ).subscribe(result => {
            this.enableMore();
            this.enableSave();
            this.enableEditor();
            this.setModel(result.content);
            this.template$.next(result);
        });
    }

    private setModel(content: string): void {
        this.model$.next({
            value: content,
            language: 'freemarker2',
        });
        this.updatedModelValue$.next(content);
    }

    private disableMore(): void {
        this.moreDisabled$.next(true);
    }

    private enableMore(): void {
        this.moreDisabled$.next(false);
    }

    private disableSave(): void {
        this.saveDisabled$.next(true);
    }

    private enableSave(): void {
        this.saveDisabled$.next(false);
    }

    private disableEditor(): void {
        this.editorDisabled$.next(true);
    }

    private enableEditor(): void {
        this.editorDisabled$.next(false);
    }

    private initBreadcrumb(): void {
        this._caseDefinitionName$.subscribe(caseDefinitionName => {
            this.breadcrumbService.setThirdBreadcrumb({
                route: [`/dossier-management/dossier/${caseDefinitionName}`],
                content: caseDefinitionName,
                href: `/dossier-management/dossier/${caseDefinitionName}`,
            });
        });
    }

    private showSuccessMessage(key: string): void {
        this.notificationService.showToast({
            caption: this.translateService.instant(`${key} was saved successfully`, {
                key,
            }),
            type: 'success',
            duration: 4000,
            showClose: true,
            title: this.translateService.instant('Saved successfully'),
        });
    }
}
