package com.ritense.valtimoplugins.docsys.client

import java.time.LocalDateTime

data class DownloadResponse(
    val Id: String,
    val ExportId: String,
    val DownloadUrl: String,
    val Content: String,
    val Path: String,
    val FileName: String,
    val FileType: String,
    val ModelName: String,
    val CurrentOwner: String,
    val LastChanges: LocalDateTime?,
    val DateStarted: LocalDateTime,
)
