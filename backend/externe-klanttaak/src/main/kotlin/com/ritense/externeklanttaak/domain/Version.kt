/*
 * Copyright 2025 Ritense BV, the Netherlands.
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

package com.ritense.externeklanttaak.domain

import com.fasterxml.jackson.annotation.JsonCreator
import kotlin.reflect.KClass
import kotlin.reflect.full.findAnnotation

data class Version(
    val major: Int,
    val minor: Int = 0,
    val patch: Int = 0,
) : Comparable<Version> {

    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }

        if (this.minor != other.minor) {
            return this.minor - other.minor
        }

        if (this.patch != other.patch) {
            return this.patch - other.patch
        }

        return 0
    }

    override fun toString(): String {
        return "$major.$minor.$patch"
    }

    infix fun supports(kClass: KClass<*>): Boolean {
        return kClass
            .findAnnotation<SpecVersion>()
            ?.let { specVersion ->
                val specMinimumVersion = fromVersionString(specVersion.min)
                if (specVersion.max.isBlank()) {
                    return specMinimumVersion <= this
                }
                val specMaximumVersion = fromVersionString(specVersion.max)
                return this in specMinimumVersion..specMaximumVersion
            }
            ?: true
    }

    companion object {
        @JvmStatic
        @JsonCreator
        fun fromVersionString(versionString: String): Version {
            val (major, minor, patch) = versionString.split(".").map(String::toInt)
            return Version(major, minor, patch)
        }
    }
}