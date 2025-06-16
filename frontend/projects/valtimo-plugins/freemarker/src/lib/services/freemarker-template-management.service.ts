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

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {
    DeleteTemplatesRequest,
    Template,
    TemplateListItem,
    TemplatePreviewRequest,
    TemplateResponse,
    TemplateType,
    UpdateTemplateRequest,
} from '../models';
import {ConfigService, InterceptorSkip, Page} from '@valtimo/shared';

@Injectable({
    providedIn: 'root',
})
export class FreemarkerTemplateManagementService {

    private readonly valtimoEndpointUri: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly http: HttpClient
    ) {
        this.valtimoEndpointUri = `${this.configService.config.valtimoApi.endpointUri}management/`;
    }

    public getAllMailTemplates(caseDefinitionKey?: string, caseDefinitionVersionTag?: string): Observable<Page<TemplateListItem>> {
        return this.getTemplates(caseDefinitionKey, caseDefinitionVersionTag, 'mail', undefined, undefined, 0, 10000);
    }

    public getAllTextTemplates(caseDefinitionKey?: string, caseDefinitionVersionTag?: string): Observable<Page<TemplateListItem>> {
        return this.getTemplates(caseDefinitionKey, caseDefinitionVersionTag, 'text', undefined, undefined, 0, 10000);
    }

    public getAllDocumentTemplates(caseDefinitionKey?: string, caseDefinitionVersionTag?: string): Observable<Page<TemplateListItem>> {
        return this.getTemplates(caseDefinitionKey, caseDefinitionVersionTag, undefined, ['csv', 'pdf'], undefined, 0, 10000);
    }

    public getAllTemplates(caseDefinitionKey?: string, caseDefinitionVersionTag?: string, templateType?: TemplateType): Observable<Page<TemplateListItem>> {
        return this.getTemplates(caseDefinitionKey, caseDefinitionVersionTag, templateType, undefined, undefined, 0, 10000);
    }

    public getTemplates(
        caseDefinitionKey?: string,
        caseDefinitionVersionTag?: string,
        templateType?: TemplateType,
        templateTypes?: TemplateType[],
        templateKey?: string,
        page?: number,
        pageSize?: number,
    ): Observable<Page<TemplateListItem>> {
        const params = {
            caseDefinitionKey,
            caseDefinitionVersionTag,
            templateType,
            templateTypes,
            templateKey,
            page,
            size: pageSize
        };
        Object.keys(params).forEach(key => {
            if (params[key] == undefined) {
                delete params[key];
            }
        });
        return this.http.get<Page<TemplateListItem>>(
            `${this.valtimoEndpointUri}v1/template`,
            {params}
        );
    }

    public getMailTemplate(caseDefinitionKey: string, caseDefinitionVersionTag: string, key: string): Observable<TemplateResponse> {
        return this.getTemplate(caseDefinitionKey, caseDefinitionVersionTag, 'mail', key);
    }

    public getTextTemplate(caseDefinitionKey: string, caseDefinitionVersionTag: string, key: string): Observable<TemplateResponse> {
        return this.getTemplate(caseDefinitionKey, caseDefinitionVersionTag, 'text', key);
    }

    public getTemplate(caseDefinitionKey: string, caseDefinitionVersionTag: string, templateType: TemplateType, key: string): Observable<TemplateResponse> {
        return this.http.get<TemplateResponse>(
            `${this.valtimoEndpointUri}v1/case-definition/${caseDefinitionKey}/version/${caseDefinitionVersionTag}/template-type/${templateType}/template/${key}`
        );
    }

    public addTemplate(template: Template): Observable<TemplateResponse> {
        return this.http.post<TemplateResponse>(`${this.valtimoEndpointUri}v1/template`, template);
    }

    public deleteTemplates(request: DeleteTemplatesRequest): Observable<null> {
        return this.http.delete<null>(`${this.valtimoEndpointUri}v1/template`, {body: request});
    }

    public updateTemplate(template: UpdateTemplateRequest): Observable<TemplateResponse> {
        return this.http.put<TemplateResponse>(`${this.valtimoEndpointUri}v1/template`, template);
    }

    public previewTemplate(template: TemplatePreviewRequest): Observable<Blob> {
        return this.http.post(`${this.valtimoEndpointUri}v1/template/preview`, template, {responseType: 'blob'});
    }

    public isFinal(
        caseDefinitionKey: string,
        caseDefinitionVersionTag: string
    ): Observable<boolean> {
        return this.http
            .get<any>(
                `${this.valtimoEndpointUri}v1/case-definition/${caseDefinitionKey}/version/${caseDefinitionVersionTag}`,
                {
                    headers: new HttpHeaders().set(InterceptorSkip, '403'),
                }
            )
            .pipe(map(caseDefinition => caseDefinition.final));
    }
}
