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