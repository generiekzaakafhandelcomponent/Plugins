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

import {PluginConfigurationData} from "@valtimo/plugin";

interface ExterneKlanttaakPluginConfig extends PluginConfigurationData {
    notificatiesApiPluginConfiguration: string;
    objectManagementConfigurationId: string;
    pluginVersion: ExterneKlanttaakVersion;
    finalizerProcess: string;
}

interface ExterneKlanttaakPluginActionConfiguration {
    externeKlanttaakVersion: ExterneKlanttaakVersion;
    config: ExterneKlanttaakPluginActionConfigurationData;
}

interface ExterneKlanttaakPluginActionConfigurationData {
}

enum ExterneKlanttaakVersion {
    V1x1x0 = '1.1.0',
}

interface CreateExterneKlanttaakConfigData extends ExterneKlanttaakPluginActionConfigurationData {
    resultingKlanttaakObjectUrlVariable?: string;
}

interface CompleteExterneKlanttaakConfigData extends ExterneKlanttaakPluginActionConfigurationData {
    klanttaakObjectUrl?: string;
}

export {
    ExterneKlanttaakPluginConfig,
    ExterneKlanttaakVersion,
    ExterneKlanttaakPluginActionConfiguration,
    ExterneKlanttaakPluginActionConfigurationData,
    CreateExterneKlanttaakConfigData,
    CompleteExterneKlanttaakConfigData,
};