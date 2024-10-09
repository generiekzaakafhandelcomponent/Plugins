package com.ritense.valtimo.suwinet.service

import java.time.LocalDate
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

class DateTimeService {

    fun getDifferenceInMilliseconds(from: String, to: String): Long =
        ZonedDateTime.parse(to).toInstant().toEpochMilli() - ZonedDateTime.parse(from).toInstant().toEpochMilli()

    fun getCurrentTimeStamp(): String {
        val dateTimeFormatter = DateTimeFormatter.ISO_INSTANT
        return ZonedDateTime.now().format(dateTimeFormatter)
    }

    fun toLocalDate(date: String, pattern: String) =
        LocalDate.parse(date, DateTimeFormatter.ofPattern(pattern))

    fun fromSuwinetToDateString(dateIn: String?) =
        if (dateIn.isNullOrEmpty()) "" else LocalDate.parse(dateIn, dateInFormatter).format(dateOutFormatter)

    fun getYearFromDateString(dateIn: String, pattern: String) = toLocalDate(dateIn, pattern).year

    fun getDayMonthFullYearPatternDate(timeStamp: String): String {
        val dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy")
        return if (timeStamp.isNotEmpty()) {
            dateTimeFormatter.format(ZonedDateTime.parse(timeStamp))
        } else {
            "-"
        }
    }

    companion object {
        val dateInFormatter = DateTimeFormatter.ofPattern("yyyyMMdd")
        val dateOutFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    }
}