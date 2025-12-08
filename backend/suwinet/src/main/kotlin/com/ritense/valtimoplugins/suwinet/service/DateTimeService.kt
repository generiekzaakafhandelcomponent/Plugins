package com.ritense.valtimoplugins.suwinet.service

import java.time.LocalDate
import java.time.Period
import java.time.YearMonth
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

    fun fromSuwinetToDateString(dateIn: String?): String {
        val raw = dateIn?.filter(Char::isDigit).takeIf { it?.length == 8 } ?: return ""

        val yearStr  = raw.substring(0, 4)
        val monthStr = raw.substring(4, 6)
        val dayStr   = raw.substring(6, 8)

        if (monthStr == "00" || dayStr == "00") return "$yearStr-$monthStr-$dayStr"

        val year  = yearStr.toInt()
        val month = monthStr.toInt()
        val day   = minOf(dayStr.toInt(), YearMonth.of(year, month).lengthOfMonth())

        return LocalDate.of(year, month, day).format(dateOutFormatter)
    }

    fun getYearFromDateString(dateIn: String, pattern: String) = toLocalDate(dateIn, pattern).year

    fun getDayMonthFullYearPatternDate(timeStamp: String): String {
        val dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy")
        return if (timeStamp.isNotEmpty()) {
            dateTimeFormatter.format(ZonedDateTime.parse(timeStamp))
        } else {
            "-"
        }
    }

    fun calculateAge(birthDateString: String): Int {
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        val birthDate = LocalDate.parse(birthDateString, formatter)
        val currentDate = LocalDate.now()
        return Period.between(birthDate, currentDate).years
    }

    companion object {
        val dateOutFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    }
}
