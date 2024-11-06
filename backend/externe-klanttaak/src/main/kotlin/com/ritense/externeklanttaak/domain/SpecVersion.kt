package com.ritense.externeklanttaak.domain

import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.CLASS
import kotlin.annotation.AnnotationTarget.FIELD

/**
 * Specifies what version of the api spec a FIELD or FUNCTION is supported by.
 *
 * @constructor Specify the supported api version range
 * @param min The minimum supported version as a [String]
 * @param max The upper bound version as a [String]
 */
@Target(CLASS, FIELD)
@Retention(RUNTIME)
annotation class SpecVersion(
    val min: String,
    val max: String = "",
)