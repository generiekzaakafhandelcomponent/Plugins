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


interface ProcessMappingConfig {
    definition: string
}

interface ValueMapperListItem {
    key: string;
    readOnly: boolean;
}

interface TemplateResponse {
    id: string
    key: string;
    content: string;
    readOnly: boolean;
}

interface ValueMapperTemplate {
    key: string;
    content: string;
}

interface UpdateValueMapperTemplate {
    id: string
    key: string;
    content: string;
}

interface GenerateValueMapperConfig {
    key: string;
    processVariableName: string;
}

interface DeleteTemplatesRequest {
    templates: Array<string>;
}

type TemplateMetadataModal = 'add' | 'edit';

export{DeleteTemplatesRequest, TemplateMetadataModal, ProcessMappingConfig, ValueMapperListItem, TemplateResponse, ValueMapperTemplate, UpdateValueMapperTemplate, GenerateValueMapperConfig}
