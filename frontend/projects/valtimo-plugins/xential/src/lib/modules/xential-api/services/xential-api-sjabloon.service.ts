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
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApiService, ConfigService} from '@valtimo/config';
import {Observable} from 'rxjs';
import {XentialApiSjabloon} from '../models/xential-api-sjabloon.model';

@Injectable({
    providedIn: 'root',
})
export class XentialApiSjabloonService extends BaseApiService {
    constructor(
        private http: HttpClient,
        configService: ConfigService
    ) {
        super(http, configService);
    }

    public getTemplates(gebruikersId: string, sjabloonGroupId?: string): Observable<XentialApiSjabloon> {
        return this.http.get<XentialApiSjabloon>(
            this.getApiUrl(!sjabloonGroupId
                ? `/v1/xential/sjablonen?gebruikersId=${gebruikersId}`
                : `/v1/xential/sjablonen?gebruikersId=${gebruikersId}&sjabloonGroupId=${sjabloonGroupId}`
            )
        );
    }
}
