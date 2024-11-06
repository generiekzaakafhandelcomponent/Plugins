package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.ritense.externeklanttaak.model.impl.ExterneKlanttaakV1x1x0

@JsonSubTypes(
    Type(ExterneKlanttaakV1x1x0::class),
)
@JsonTypeInfo(use = JsonTypeInfo.Id.DEDUCTION)
interface IExterneKlanttaak