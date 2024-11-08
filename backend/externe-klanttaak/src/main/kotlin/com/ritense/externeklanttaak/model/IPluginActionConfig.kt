package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.ritense.externeklanttaak.model.impl.CompleteTaakActionV1x1x0
import com.ritense.externeklanttaak.model.impl.CreateTaakActionV1x1x0

@JsonSubTypes(
    Type(CreateTaakActionV1x1x0::class),
    Type(CompleteTaakActionV1x1x0::class),
)
@JsonTypeInfo(use = JsonTypeInfo.Id.DEDUCTION)
interface IPluginActionConfig {
    val resultingKlanttaakObjectUrlVariable: String?
    val klanttaakObjectUrl: String?
}