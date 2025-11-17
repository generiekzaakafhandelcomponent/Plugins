package com.ritense.valtimoplugins.notifynl.domain.widget

data class WidgetTabRequest(
    val caseDefinitionName: String,
    val key: String,
    val widgets: List<Widget>
)

data class Widget(
    val key: String,
    val title: String? = null,
    val type: String? = null,
    val actions: List<Action>? = emptyList(),
    val columns: List<List<Column>>? = emptyList(),
    val highContrast: Boolean? = false,
    val properties: Map<String, Any>? = emptyMap()
)

data class Action(
    val key: String? = null,
    val label: String? = null
)

data class Column(
    val title: String? = null,
    val value: String? = null,
    val width: Int? = null,
    val displayProperties: Map<String, Any>? = emptyMap()
)