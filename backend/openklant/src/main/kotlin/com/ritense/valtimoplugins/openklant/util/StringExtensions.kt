package com.ritense.valtimoplugins.openklant.util

import java.util.UUID

fun String?.trimToNull(): String? = this?.trim()?.takeIf { it.isNotEmpty() }

fun String?.toUuidIfPresent(): UUID? = trimToNull()?.let { UUID.fromString(it) }
