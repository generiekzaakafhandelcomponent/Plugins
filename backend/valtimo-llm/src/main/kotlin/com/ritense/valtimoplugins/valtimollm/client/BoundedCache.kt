/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.valtimollm.client

// Keeps the most recently used values; a changed configuration makes a new key, and the old value is dropped in time.
class BoundedCache<K : Any, V : Any>(
    private val maxSize: Int,
) {
    private val values =
        object : LinkedHashMap<K, V>(16, 0.75f, true) {
            override fun removeEldestEntry(eldest: MutableMap.MutableEntry<K, V>?) = size > maxSize
        }

    fun get(
        key: K,
        create: () -> V,
    ): V = synchronized(values) { values.getOrPut(key, create) }

    val size: Int get() = synchronized(values) { values.size }
}
