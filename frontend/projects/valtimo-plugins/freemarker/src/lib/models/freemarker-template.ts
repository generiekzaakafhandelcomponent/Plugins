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

interface TemplateListItem {
    key: string;
    type: string;
}

interface CreateTemplateRequest {
    key: string,
    caseDefinitionKey?: string,
    caseDefinitionVersionTag?: string;
    type: string,
    metadata?: any,
}

interface DeleteTemplatesRequest {
    caseDefinitionKey?: string;
    caseDefinitionVersionTag?: string;
    templates: Array<any>;
}

interface UpdateTemplateRequest {
    key: string;
    caseDefinitionKey?: string;
    caseDefinitionVersionTag?: string;
    type: TemplateType;
    metadata?: any;
    content: string;
}

interface Template {
    key: string;
    caseDefinitionKey?: string;
    caseDefinitionVersionTag?: string;
    type: TemplateType;
    metadata?: any;
    content: string;
}

interface TemplateResponse {
    key: string;
    caseDefinitionKey?: string;
    caseDefinitionVersionTag?: string;
    type: TemplateType;
    metadata: any;
    content: string;
}

interface TemplatePreviewRequest {
    fileName: string;
    content: string;
}

type TemplateMetadataModal = 'add' | 'edit';
type TemplateType = 'mail' | 'text' | 'pdf' | 'csv';

export {
    TemplateListItem,
    CreateTemplateRequest,
    DeleteTemplatesRequest,
    Template,
    UpdateTemplateRequest,
    TemplateResponse,
    TemplateMetadataModal,
    TemplateType,
    TemplatePreviewRequest
};
