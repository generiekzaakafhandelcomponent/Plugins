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

@Component({
    templateUrl: './mail-template-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./mail-template-editor.component.scss'],
    providers: [NotificationService],
})
export class MailTemplateEditorComponent implements OnInit, AfterViewInit, OnDestroy {
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

    public readonly templateKey$: Observable<string> =
        this.route.params.pipe(
            map(params => params?.key),
            filter(templateKey => !!templateKey)
        );

    constructor(
        private readonly templateService: FreemarkerTemplateManagementService,
        private readonly route: ActivatedRoute,
        private readonly pageTitleService: PageTitleService,
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly translateService: TranslateService,
        private readonly breadcrumbService: BreadcrumbService,
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
                        type: 'mail',
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

    public onDelete(templates: Array<string>): void {
        this.disableEditor();
        this.disableSave();
        this.disableMore();

        this._caseDefinitionName$.pipe(take(1)).subscribe(caseDefinitionName =>
            this.templateService.deleteTemplates({caseDefinitionName, type: 'mail', templates}).pipe(take(1)).subscribe(_ =>
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
                this.pageTitleService.setCustomPageTitle(`Mail template: ${key}`, true);
            }),
            switchMap(([caseDefinitionName, key]) => this.templateService.getMailTemplate(caseDefinitionName, key)),
            take(1),
        ).subscribe(result => {
            this.enableMore();
            this.enableSave();
            this.enableEditor();
            this.setModel(result.content);
            this.refreshViewer(result.content);
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

    public onSelectedTabViewer(): void {
        this.updatedModelValue$.pipe(take(1)).subscribe(html =>
            this.refreshViewer(html)
        );
    }

    private refreshViewer(html: string): void {
        setTimeout(() => {
            (document.getElementById('html-viewer-iframe') as HTMLIFrameElement).srcdoc = html;
        });
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
