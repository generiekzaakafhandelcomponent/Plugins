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

package com.ritense.valtimoplugins.notifynl.autoconfiguration

import com.ritense.objectmanagement.repository.ObjectManagementRepository
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.objectmanagement.plugin.ObjectManagementPluginFactory
import com.ritense.valtimoplugins.objectmanagement.service.ObjectManagementCrudService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class ObjectManagementAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(ObjectManagementPluginFactory::class)
    fun objectManagementPluginFactory(
        pluginService: PluginService,
        objectManagementCrudService: ObjectManagementCrudService
    ): ObjectManagementPluginFactory {
        return ObjectManagementPluginFactory(
            pluginService,
            objectManagementCrudService
        )
    }

    @Bean
    @ConditionalOnMissingBean(ObjectManagementCrudService::class)
    fun objectManagementCrudService(
        pluginService: PluginService,
        objectManagementRepository: ObjectManagementRepository
    ): ObjectManagementCrudService {
        return ObjectManagementCrudService(
            pluginService,
            objectManagementRepository
        )
    }
}