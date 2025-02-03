/*
 * Copyright 2025 Ritense BV, the Netherlands.
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

package com.ritense.externeklanttaak.domain

import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.delegate.DelegateTask
import kotlin.reflect.KClass

interface IExterneKlanttaakVersion {
    val version: String
    fun create(pluginActionConfig: IPluginActionConfig, delegateTask: DelegateTask): IExterneKlanttaak {
        TODO("Not Implemented")
    }

    fun complete(
        externeKlanttaak: IExterneKlanttaak,
        pluginActionConfig: IPluginActionConfig,
        delegateExecution: DelegateExecution
    ): IExterneKlanttaak? {
        TODO("Not Implemented")
    }

    infix fun supports(kClass: KClass<*>): Boolean = Version.fromVersionString(version) supports kClass
    infix fun supports(subjectVersion: Version): Boolean = Version.fromVersionString(version) == subjectVersion
}