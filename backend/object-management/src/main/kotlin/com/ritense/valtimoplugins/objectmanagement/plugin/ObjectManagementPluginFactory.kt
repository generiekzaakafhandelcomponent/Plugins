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

package com.ritense.valtimoplugins.objectmanagement.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.objectmanagement.service.ObjectManagementCrudService
import com.ritense.valueresolver.ValueResolverService
import org.springframework.stereotype.Component

@Component
@SkipComponentScan
class ObjectManagementPluginFactory(
    pluginService: PluginService,
    val objectManagementCrudService: ObjectManagementCrudService,
    val valueResolverService: ValueResolverService
) : PluginFactory<ObjectManagementPlugin>(pluginService) {

    override fun create(): ObjectManagementPlugin {
        return ObjectManagementPlugin(pluginService, objectManagementCrudService, valueResolverService)
    }
}
