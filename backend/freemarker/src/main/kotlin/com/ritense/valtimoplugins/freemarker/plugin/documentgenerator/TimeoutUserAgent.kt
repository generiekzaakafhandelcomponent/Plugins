/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.plugin.documentgenerator

import org.xhtmlrenderer.pdf.ITextOutputDevice
import org.xhtmlrenderer.pdf.ITextUserAgent
import org.xhtmlrenderer.util.FontUtil.isEmbeddedBase64Font
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLConnection
import java.time.Duration

/**
 * Loads images, stylesheets and fonts referenced by a PDF template with timeouts. Flying Saucer's default user agent
 * waits forever on an unresponsive host, which blocks the thread and the database connection it holds.
 */
class TimeoutUserAgent(
    outputDevice: ITextOutputDevice,
    dotsPerPixel: Int,
    private val connectTimeout: Duration = Duration.ofSeconds(5),
    private val readTimeout: Duration = Duration.ofSeconds(15),
) : ITextUserAgent(outputDevice, dotsPerPixel) {
    // Unresolvable URI: skip it, openConnection rejects null
    override fun resolveAndOpenStream(uri: String?): InputStream? =
        if (resolveURI(uri) == null && !(uri != null && isEmbeddedBase64Font(uri))) {
            null
        } else {
            super.resolveAndOpenStream(uri)
        }

    @Suppress("DEPRECATION") // URL(uri) throws an IOException Flying Saucer handles
    override fun openConnection(uri: String): URLConnection {
        val connection = withTimeouts(URL(uri).openConnection())
        connection.setRequestProperty("Accept", "*/*")
        return if (connection is HttpURLConnection) {
            // A redirect opens a new connection, which needs the timeouts as well.
            withTimeouts(onHttpConnection(connection))
        } else {
            connection
        }
    }

    private fun withTimeouts(connection: URLConnection): URLConnection =
        connection.apply {
            connectTimeout = this@TimeoutUserAgent.connectTimeout.toMillis().toInt()
            readTimeout = this@TimeoutUserAgent.readTimeout.toMillis().toInt()
        }
}
