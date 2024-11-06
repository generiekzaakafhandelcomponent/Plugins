package com.ritense.externeklanttaak.domain

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
                val specMinimumVersion = fromString(specVersion.min)
                if (specVersion.max.isBlank()) {
                    return specMinimumVersion <= this
                }
                val specMaximumVersion = fromString(specVersion.max)
                return this in specMinimumVersion .. specMaximumVersion
            }
            ?: true
    }
    companion object {
        fun fromString(versionString: String): Version {
            val (major, minor, patch) = versionString.split(".").map(String::toInt)
            return Version(major, minor, patch)
        }
    }
}