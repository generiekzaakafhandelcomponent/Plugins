package com.ritense.valtimoplugins.httpclientauthentication

import com.ritense.plugin.annotation.PluginCategory
import org.springframework.web.client.RestClient

@PluginCategory("http-client-authentication")
interface HttpClientAuthenticator {
    fun applyAuth(builder: RestClient.Builder): RestClient.Builder?
}
