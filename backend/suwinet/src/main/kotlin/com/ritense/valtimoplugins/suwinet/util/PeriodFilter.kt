package com.ritense.valtimoplugins.suwinet.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter

object PeriodFilter {
    private val SUWINET_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd")

    /**
     * True when [recordStart, recordEnd] overlaps with [periodStart, periodEnd].
     * A null/blank recordEnd means the record is still open (no end date → overlaps if started before periodEnd).
     * Returns false when recordStart is missing (no start date → cannot determine overlap).
     */
    fun overlaps(
        recordStartRaw: String?,
        recordEndRaw: String?,
        periodStart: LocalDate,
        periodEnd: LocalDate
    ): Boolean {
        val recordStart = recordStartRaw?.takeIf { it.isNotBlank() }
            ?.let { LocalDate.parse(it, SUWINET_FORMAT) }
            ?: return false

        val recordEnd = recordEndRaw?.takeIf { it.isNotBlank() }
            ?.let { LocalDate.parse(it, SUWINET_FORMAT) }

        return recordStart <= periodEnd && (recordEnd == null || recordEnd >= periodStart)
    }
}
