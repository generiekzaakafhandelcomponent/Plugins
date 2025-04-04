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

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.ritense.externeklanttaak.version.v1x1x0.CompleteExterneKlanttaakActionV1x1x0.CompleteExterneKlanttaakActionConfigV1x1x0
import com.ritense.externeklanttaak.version.v1x1x0.CreateExterneKlanttaakActionV1x1x0.CreateExterneKlanttaakActionConfigV1x1x0

@JsonSubTypes(
    Type(CreateExterneKlanttaakActionConfigV1x1x0::class),
    Type(CompleteExterneKlanttaakActionConfigV1x1x0::class),
)
@JsonTypeInfo(use = JsonTypeInfo.Id.DEDUCTION)
interface IPluginActionConfig {
    val externeKlanttaakVersion: Version
    val resultingKlanttaakObjectUrlVariable: String?
    val klanttaakObjectUrl: String?
}