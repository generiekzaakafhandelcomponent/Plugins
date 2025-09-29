/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

import {PluginConfigurationData} from '@valtimo/plugin';

interface ObjectManagementConfig extends PluginConfigurationData {

}

interface CreateObjectConfig {
    objectManagementConfigurationId: string;
    objectData: Array<{ key: string; value: string }>;
    objectUrlProcessVariableName: string;
}

interface GetObjectsConfig {
    objectManagementConfigurationId: string;
    filterParameter: {key: string; value: string};
    listOfObjectProcessVariableName: string;
}

interface DeleteObjectConfig {
    objectManagementConfigurationId: string;
    objectUrl: string;
}

interface UpdateObjectConfig {
    objectManagementConfigurationId: string;
    objectData: Array<{ key: string; value: string }>;
    objectUrl: string;
}

interface GetObjectDataConfig {
    objectManagementConfigurationId: string;
    objectUrl: string;
    objectDataProcessVariableName: string;
}

export {
    ObjectManagementConfig,
    CreateObjectConfig,
    GetObjectsConfig,
    DeleteObjectConfig,
    UpdateObjectConfig,
    GetObjectDataConfig
};
