package com.ritense.valtimoplugins.suwinet.dynamic

import com.fasterxml.jackson.databind.ObjectMapper

class DynamicResponseFactory(val objectMapper: ObjectMapper) {

    fun toMap(obj: Any): Map<String, Any?> {
        @Suppress("UNCHECKED_CAST")
        return objectMapper.convertValue(obj, Map::class.java) as Map<String, Any?>
    }

    fun toFlatMap(obj: Any, prefix: String = ""): Map<String, Any?> {
        if (obj is List<*>) {
            val result = mutableMapOf<String, Any?>()
            obj.forEachIndexed { index, item ->
                val path = if (prefix.isEmpty()) "[$index]" else "$prefix[$index]"
                when (item) {
                    null -> result[path] = null
                    is Map<*, *> -> result.putAll(flattenMap(item, path))
                    else -> result.putAll(flattenMap(toMap(item), path))
                }
            }
            return result
        }
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

    fun flatMapToNested(flatMap: Map<String, Any?>): Any {
        val parsedEntries = flatMap.map { (key, value) -> parseKeyParts(key) to value }

        val root: Any = if (parsedEntries.all { (parts, _) -> parts.firstOrNull() is Int }) {
            mutableListOf<Any?>()
        } else {
            mutableMapOf<String, Any?>()
        }

        parsedEntries.forEach { (parts, value) ->
            setNestedValue(root, parts, 0, value)
        }

        return root
    }

    private fun parseKeyParts(key: String): List<Any> {
        val parts = mutableListOf<Any>()
        for (segment in key.split(".")) {
            if (segment.isEmpty()) continue
            when {
                segment.matches(Regex("\\[\\d+\\]")) ->
                    parts.add(segment.drop(1).dropLast(1).toInt())
                segment.contains("[") -> {
                    val bracketIdx = segment.indexOf('[')
                    parts.add(segment.substring(0, bracketIdx))
                    parts.add(segment.substring(bracketIdx + 1, segment.length - 1).toInt())
                }
                else -> parts.add(segment)
            }
        }
        return parts
    }

    private fun setNestedValue(container: Any, parts: List<Any>, index: Int, value: Any?) {
        if (index > parts.lastIndex) return
        val part = parts[index]
        val isLast = index == parts.lastIndex
        val nextPart = if (!isLast) parts[index + 1] else null

        when (container) {
            is MutableMap<*, *> -> {
                @Suppress("UNCHECKED_CAST")
                val map = container as MutableMap<String, Any?>
                val mapKey = if (part is Int) "[$part]" else part as String
                if (isLast) {
                    map[mapKey] = value
                } else {
                    val child = map.getOrPut(mapKey) {
                        if (nextPart is Int) mutableListOf<Any?>() else mutableMapOf<String, Any?>()
                    }
                    setNestedValue(child!!, parts, index + 1, value)
                }
            }
            is MutableList<*> -> {
                @Suppress("UNCHECKED_CAST")
                val list = container as MutableList<Any?>
                val listIdx = part as Int
                while (list.size <= listIdx) list.add(null)
                if (isLast) {
                    list[listIdx] = value
                } else {
                    if (list[listIdx] == null) {
                        list[listIdx] = if (nextPart is Int) mutableListOf<Any?>() else mutableMapOf<String, Any?>()
                    }
                    setNestedValue(list[listIdx]!!, parts, index + 1, value)
                }
            }
        }
    }
}
