package com.ritense.valtimoplugins.suwinet.model


data class MotorvoertuigDynamicDto(
    val motorVoertuigen: List<MotorvoertuigDynamic>

)  {
    data class MotorvoertuigDynamic(
        val propertiesMap: Map<String, Any?>,
        val properties: List<String>,
    )
}
