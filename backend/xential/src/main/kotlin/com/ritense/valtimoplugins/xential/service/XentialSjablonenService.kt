/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.xential.service

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.mtlssslcontext.MTlsSslContext
import com.ritense.valtimoplugins.mtlssslcontext.plugin.MTlsSslContextPlugin
import com.ritense.valtimoplugins.xential.domain.XentialAccessResult
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin
import com.rotterdam.esb.xential.api.DefaultApi
import com.rotterdam.esb.xential.model.Sjabloonitems
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientResponseException

class XentialSjablonenService(
    private val pluginService: PluginService,
    private val esbClient: OpentunnelEsbClient,
) {
    private fun generateApi(): DefaultApi {
        pluginService.findPluginConfiguration(MTlsSslContextPlugin::class.java) {
            true
        }.let { mLTSPlugin ->
            val mTlsSslContextPlugin = mLTSPlugin?.let { pluginService.createInstance(it.id) } as MTlsSslContextPlugin
            pluginService.findPluginConfigurations(XentialPlugin::class.java).first().let { plugin ->
                val xentialPlugin = pluginService.createInstance(plugin.id) as XentialPlugin
                esbClient.createRestClient(
                    baseUrl = xentialPlugin.baseUrl.toString(),
                    applicationName = xentialPlugin.applicationName,
                    applicationPassword = xentialPlugin.applicationPassword,
                    mTlsSslContextPlugin.createSslContext(),
                )
                return esbClient.documentApi(restClient(mTlsSslContextPlugin))
            }
        }
    }

    fun testAccessToSjabloongroep(
        gebruikersId: String,
        sjabloongroepId: String,
    ): XentialAccessResult {
        logger.info { "testing sjabloongroep with $sjabloongroepId" }
        generateApi().let {
            try {
                it.geefSjablonenlijstWithHttpInfo(
                    gebruikersId = gebruikersId,
                    sjabloongroepId = sjabloongroepId,
                ).let { response ->
                    return XentialAccessResult(
                        statusCode = response.statusCode.toString(),
                        statusMessage = "",
                    )
                }
            } catch (ex: RestClientResponseException) {
                return XentialAccessResult(
                    statusCode = ex.statusCode.toString(),
                    statusMessage = ex.message.toString(),
                )
            } catch (ex: Exception) {
                return XentialAccessResult(
                    statusCode = "No error code",
                    statusMessage = ex.message.toString(),
                )
            }
        }
    }

    fun getTemplateList(
        gebruikersId: String,
        sjabloongroepId: String?,
    ): Sjabloonitems {
        logger.info { "getting sjabloongroep with ${sjabloongroepId.takeIf { !it.isNullOrBlank() } ?: "geen id"}" }
        generateApi().let {
            return it.geefSjablonenlijst(
                gebruikersId = gebruikersId,
                sjabloongroepId = sjabloongroepId.takeIf { !it.isNullOrBlank() },
            )
        }
    }

//        pluginService.getPluginDefinitions()
//        pluginService.findPluginConfiguration(MTlsSslContextPlugin::class.java) {
//            true
//        }.let { mLTSPlugin ->
//            val mTlsSslContextPlugin = mLTSPlugin?.let { pluginService.createInstance(it.id) } as MTlsSslContextPlugin
//            pluginService.findPluginConfigurations(XentialPlugin::class.java).first().let { plugin ->
//                val xentialPlugin = pluginService.createInstance(plugin.id) as XentialPlugin
//                esbClient.createRestClient(
//                    baseUrl = xentialPlugin.baseUrl.toString(),
//                    applicationName = xentialPlugin.applicationName,
//                    applicationPassword = xentialPlugin.applicationPassword,
//                    mTlsSslContextPlugin.createSslContext()
//                )
//                val api = esbClient.documentApi(restClient(mTlsSslContextPlugin))
//                logger.info { "getting sjabloongroep with ${sjabloongroepId.takeIf { !it.isNullOrBlank() } ?: "geen id"}" }
//                return api.geefSjablonenlijst(
//                    gebruikersId = gebruikersId,
//                    sjabloongroepId = sjabloongroepId.takeIf { !it.isNullOrBlank() }
//                )
//            }
//        }
//    }

    private fun restClient(mTlsSslContextAutoConfiguration: MTlsSslContext?): RestClient {
        pluginService.findPluginConfigurations(XentialPlugin::class.java).first().let { plugin ->
            val xentialPlugin = pluginService.createInstance(plugin.id) as XentialPlugin
            return esbClient.createRestClient(
                baseUrl = xentialPlugin.baseUrl.toString(),
                applicationName = xentialPlugin.applicationName,
                applicationPassword = xentialPlugin.applicationPassword,
                mTlsSslContextAutoConfiguration?.createSslContext(),
            )
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
