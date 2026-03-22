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
import {BehaviorSubject, combineLatest, filter, map, Observable, of, startWith, switchMap, take, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {
    BreadcrumbService,
    CarbonListModule,
    EditorModel,
    EditorModule,
    PageTitleService,
    RenderInPageHeaderDirectiveModule
} from '@valtimo/components';
import {ButtonModule, DialogModule, IconModule, NotificationService, TabsModule} from 'carbon-components-angular';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FreemarkerTemplateManagementService} from '../../../../services';
import {TemplateResponse, TemplateType} from '../../../../models';
import {CommonModule} from '@angular/common';
import {
    DocumentTemplateDeleteModalComponent
} from '../document-template-delete-modal/document-template-delete-modal.component';

@Component({
    standalone: true,
    templateUrl: './document-template-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./document-template-editor.component.scss'],
    providers: [NotificationService],
    imports: [
        CommonModule,
        TranslateModule,
        TabsModule,
        DialogModule,
        DocumentTemplateDeleteModalComponent,
        CarbonListModule,
        ButtonModule,
        EditorModule,
        IconModule,
        RenderInPageHeaderDirectiveModule,
    ]
})
export class DocumentTemplateEditorComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly model$ = new BehaviorSubject<EditorModel | null>(null);
    public readonly template$ = new BehaviorSubject<TemplateResponse | null>(null);
    public readonly saveDisabled$ = new BehaviorSubject<boolean>(true);
    public readonly editorDisabled$ = new BehaviorSubject<boolean>(false);
    public readonly moreDisabled$ = new BehaviorSubject<boolean>(true);
    public readonly showDeleteModal$ = new BehaviorSubject<boolean>(false);
    public readonly updatedModelValue$ = new BehaviorSubject<string>('');
    public readonly initialModelValue$ = new BehaviorSubject<string>('');
    public readonly isValid$ = new BehaviorSubject<boolean>(true);

    private readonly _caseDefinitionName$: Observable<string> =
        this.route.params.pipe(
            map(params => params?.name),
            filter(caseDefinitionName => !!caseDefinitionName)
        );

    public readonly templateKey$: Observable<string> = combineLatest([this.route.params, this.route.parent.params]).pipe(
        map(([params, parentParams]) => params?.templateKey || parentParams?.templateKey),
        filter(templateKey => !!templateKey)
    );

    public readonly templateType$: Observable<TemplateType> = combineLatest([this.route.params, this.route.parent.params]).pipe(
        map(([params, parentParams]) => params?.templateType || parentParams?.templateType),
        filter(templateType => !!templateType)
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

    ngAfterViewInit(): void {
        throw new Error("Method not implemented.");
    }

    public ngOnInit(): void {
        this.loadTemplate();
        this.initSaveButtonLogic();
    }

    public ngOnDestroy(): void {
        this.pageTitleService.enableReset();
        this.breadcrumbService.clearThirdBreadcrumb();
    }

    public onValid(valid: any): void {
        if (typeof valid === 'boolean') {
            this.isValid$.next(valid);
        }
    }

    public onValueChange(value: string): void {
        this.updatedModelValue$.next(value);
    }

    public updateTemplate(): void {
        this.disableEditor();
        this.disableSave();
        this.disableMore();

        combineLatest([this.updatedModelValue$, this._caseDefinitionName$, this.templateKey$, this.templateType$]).pipe(
            switchMap(([updatedModelValue, caseDefinitionName, templateKey, templateType]) =>
                this.templateService.updateTemplate(
                    {
                        key: templateKey,
                        caseDefinitionName: caseDefinitionName,
                        type: templateType,
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
                this.initialModelValue$.next(result.content);
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
            this.templateService.deleteTemplates({
                caseDefinitionName,
                type: templates[0]?.type || 'pdf',
                templates
            }).pipe(take(1)).subscribe(_ =>
                this.router.navigate([`/dossier-management/dossier/${caseDefinitionName}`])
            )
        );
    }

    public showDeleteModal(): void {
        this.showDeleteModal$.next(true);
    }

    private loadTemplate(): void {
        combineLatest([this._caseDefinitionName$, this.templateKey$, this.templateType$]).pipe(
            tap(([_, key, type]) => {
                this.pageTitleService.setCustomPageTitle(`Document: ${key}.${type}`, true);
            }),
            switchMap(([caseDefinitionName, key, type]) => this.templateService.getTemplate(caseDefinitionName, type, key)),
            take(1),
        ).subscribe(result => {
            this.enableMore();
            this.enableSave();
            this.enableEditor();
            this.setModel(result.content);
            this.initialModelValue$.next(result.content);
            this.template$.next(result);
        });
    }

    private initSaveButtonLogic(): void {
        combineLatest([this.updatedModelValue$, this.initialModelValue$, this.isValid$]).subscribe(
            ([updatedValue, initialValue, isValid]) => {
                this.saveDisabled$.next(!isValid || updatedValue === initialValue);
            }
        );
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

    public onSelectedTabPreview(): void {
        setTimeout(() => {
            const preview = document.getElementById('preview-iframe') as HTMLIFrameElement;
            if (preview) {
                preview.src = window.URL.createObjectURL(new Blob([""], {type: "text/plain"}));
                combineLatest([this.updatedModelValue$, this.template$]).pipe(
                    take(1),
                    switchMap(([updatedModelValue, template]) =>
                        combineLatest([this.templateService.previewTemplate(
                            {
                                fileName: `${template.key}.${template.type}`,
                                content: updatedModelValue,
                            }
                        ), of(`${template.key}.${template.type}`)])
                    )
                ).subscribe({
                    next: ([blob, filename]) => {
                        preview.src = URL.createObjectURL(blob);
                    },
                    error: (err) => {
                        console.error("Preview failed:", err);

                        const errorBlob = new Blob(
                            [`<html><body><h2>Error loading preview</h2><p>See logs for more information</p></body></html>`],
                            {type: 'text/html'}
                        );
                        preview.src = URL.createObjectURL(errorBlob);
                    }
                });
            }
        }, 100);
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
