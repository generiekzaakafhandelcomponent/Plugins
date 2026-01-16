package util

import kotlin.reflect.KProperty1
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.isAccessible

class ReflectionUtil {
    fun deepReflectedMapOf(value: Any?) =
        DeepRecursiveFunction<Any?, Any?> { recursiveValue: Any? ->
            when (recursiveValue) {
                null -> null
                is String, is Number -> recursiveValue
                is Boolean -> recursiveValue.toString()
                is Collection<*> -> recursiveValue.map { item -> callRecursive(item) }
                is Map<*, *> -> recursiveValue.entries.associate { (key, v) -> key.toString() to callRecursive(v) }
                else -> {
                    if (recursiveValue::class.isData) {
                        recursiveValue::class.memberProperties.associate { prop ->
                            prop.isAccessible = true
                            val v = (prop as KProperty1<Any, *>).get(recursiveValue)
                            prop.name to callRecursive(v)
                        }
                    } else {
                        recursiveValue.toString()
                    }
                }
            }
        }(value)
}