/*
 *  Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 *  Licensed under EUPL, Version 1.2 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {Injectable} from "@angular/core";
import {ConfigService, Page} from "@valtimo/config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
    DeleteTemplatesRequest,
    TemplateResponse,
    UpdateValueMapperTemplate,
    ValueMapperListItem,
    ValueMapperTemplate
} from "../models";

@Injectable({
    providedIn: 'root',
})
export class ValueMapperService {
    private readonly valtimoEndpointUri: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly http: HttpClient
    ) {
        this.valtimoEndpointUri = `${this.configService.config.valtimoApi.endpointUri}management/v1/value-mapper/`;
    }

    getValueMapperDefinitionsIds():Observable<string[]> {
        return this.http.get<Array<string>>(this.valtimoEndpointUri.concat('definitions'))
    }

    public getValueMapperDefinitions(
        page?: number,
        pageSize?: number,
    ): Observable<Page<ValueMapperListItem>> {
        const params = {
            page,
            size: pageSize
        };
        Object.keys(params).forEach(key => {
            if (params[key] == undefined) {
                delete params[key];
            }
        });
        return this.http.get<Page<ValueMapperListItem>>(
            `${this.valtimoEndpointUri}definitionsPage`,
            {params}
        );
    }

    public getValueMapper(key: string): Observable<TemplateResponse> {
        return this.http.get<TemplateResponse>(
            `${this.valtimoEndpointUri}definitions/${key}`
        );
    }

    public addValueMapper(template: ValueMapperTemplate): Observable<TemplateResponse> {
        return this.http.post<TemplateResponse>(`${this.valtimoEndpointUri}definitions`, template);
    }

    public deleteValueMappers(request: DeleteTemplatesRequest): Observable<null> {
        return this.http.delete<null>(`${this.valtimoEndpointUri}definitions`, {body: request});
    }

    public updateValueMapper(key: string, template: UpdateValueMapperTemplate): Observable<TemplateResponse> {
        return this.http.put<TemplateResponse>(`${this.valtimoEndpointUri}definitions/${key}`, template);
    }
}
