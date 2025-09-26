package com.ritense.valtimoplugins.SamplePlugin.client

import org.springframework.http.ResponseEntity
import java.time.OffsetDateTime

data class Timezone(
    val utc_offset: String? = null,
    val timezone: String? = null,
    val day_of_week: Int? = null,
    val day_of_year: Int? = null,
    val datetime: OffsetDateTime? = null,
    val utc_datetime: OffsetDateTime? = null,
    val unixtime: Int? = null,
    val raw_offset: Int? = null,
    val weekNumber: Int? = null,
    val dst: Boolean? = null,
    val abbreviation: String? = null,
    val dst_offset: Int? = null,
    val dst_from: OffsetDateTime? = null,
    val dst_until: OffsetDateTime? = null,
    val client_ip: String? = null
)

data class ApiResponse(
    val result: ResponseEntity<Timezone?>? = null,
    val responseStatus: String? = null,
    val error: String? = null
)