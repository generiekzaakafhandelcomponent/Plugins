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
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DeleteTemplatesRequest, Template, TemplateListItem, TemplateResponse, TemplateType, UpdateTemplateRequest,} from '../models';
import {ConfigService, Page} from '@valtimo/config';

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

    public getAllMailTemplates(caseDefinitionName?: string): Observable<Page<TemplateListItem>> {
        return this.getTemplates(caseDefinitionName, 'mail', undefined, 0, 10000);
    }

    public getTemplates(
        caseDefinitionName?: string,
        templateType?: TemplateType,
        templateKey?: string,
        page?: number,
        pageSize?: number,
    ): Observable<Page<TemplateListItem>> {
        const params = {
            caseDefinitionName,
            templateType,
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

    public getMailTemplate(caseDefinitionName: string, key: string): Observable<TemplateResponse> {
        return this.getTemplate(caseDefinitionName, 'mail', key);
    }

    public getTemplate(caseDefinitionName: string, templateType: TemplateType, key: string): Observable<TemplateResponse> {
        return this.http.get<TemplateResponse>(
            `${this.valtimoEndpointUri}v1/case-definition/${caseDefinitionName}/template-type/${templateType}/template/${key}`
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
}
