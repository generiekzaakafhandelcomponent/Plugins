package com.ritense.valtimoplugins.suwinet.dynamic

import com.fasterxml.jackson.databind.ObjectMapper

class DynamicResponseFactory(val objectMapper: ObjectMapper) {

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

    fun flatMapToNested(flatMap: Map<String, Any?>): Map<String, Any?> {
        val result = mutableMapOf<String, Any?>()

        flatMap.forEach { (key, value) ->
            val parts = key.split(".")
            var current = result

            parts.forEachIndexed { index, part ->
                if (index == parts.lastIndex) {
                    // Last part - assign the value
                    current[part] = value
                } else {
                    // Not the last part - create or navigate to nested map
                    @Suppress("UNCHECKED_CAST")
                    current = current.getOrPut(part) {
                        mutableMapOf<String, Any?>()
                    } as MutableMap<String, Any?>
                }
            }
        }

        return result
    }
}
