package com.ritense.valtimoplugins.suwinet.dynamic

import com.fasterxml.jackson.databind.ObjectMapper

class ObjectFlattener(val objectMapper: ObjectMapper) {

    fun toMap(obj: Any): Map<String, Any?> {
        @Suppress("UNCHECKED_CAST")
        return objectMapper.convertValue(obj, Map::class.java) as Map<String, Any?>
    }

    fun toFlatMap(obj: Any, prefix: String = ""): Map<String, Any?> {
        val nestedMap = toMap(obj)
        return flattenMap(nestedMap, prefix)
    }

    private fun flattenMap(map: Map<*, *>, prefix: String): Map<String, Any?> {
        val result = mutableMapOf<String, Any?>()

        map.forEach { (key, value) ->
            val path = if (prefix.isEmpty()) key.toString() else "$prefix.$key"

            when (value) {
                null -> result[path] = null
                is Map<*, *> -> result.putAll(flattenMap(value, path))
                is List<*> -> {
                    value.forEachIndexed { index, item ->
                        when (item) {
                            is Map<*, *> -> result.putAll(flattenMap(item, "$path[$index]"))
                            else -> result["$path[$index]"] = item
                        }
                    }
                }
                else -> result[path] = value
            }
        }

        return result
    }
}
