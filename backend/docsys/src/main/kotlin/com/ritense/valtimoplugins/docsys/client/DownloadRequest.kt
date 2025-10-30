package com.ritense.valtimoplugins.docsys.client

data class DownloadRequest(
    val Id: String,
    val format: String,
    val isStatic: Boolean  = true,
    val exportPluginName: String = "DownloadPlugin"
)
