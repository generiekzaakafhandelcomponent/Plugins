/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.openproduct.plugin

import com.ritense.openproduct.client.*
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.tokenauthentication.plugin.TokenAuthenticationPlugin
import com.ritense.valueresolver.ValueResolverService
import org.operaton.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "openproduct",
    title = "Open Product",
    description = "Plugin for interacting with the Open Product API"
)
class OpenProductPlugin(
    pluginService: PluginService,
    private val openProductClient: OpenProductClient,
    private val valueResolverService: ValueResolverService
) {
    @PluginProperty(key = "baseUrl", secret = false, required = true)
    lateinit var baseUrl: String

    @PluginProperty(key = "authenticationPluginConfiguration", secret = false)
    lateinit var authenticationPluginConfiguration: TokenAuthenticationPlugin

    @PluginAction(
        key = "get-product",
        title = "Retrieve product plugin action",
        description = "Retrieve product via UUID plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getProduct(
        execution: DelegateExecution,
        @PluginActionProperty productUuid: String
    ) {
        val result = openProductClient.getProduct(
            baseUrl,
            authenticationPluginConfiguration,
            productUuid
        )
        println(result)

        execution.setVariable("resultaatPV", "Product: $result")
    }

    @PluginAction(
        key = "get-all-products",
        title = "Retrieve all products plugin action",
        description = "Retrieve all products plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getAllProducts(
        execution: DelegateExecution
    ) {
        val result = openProductClient.getAllProducts(
            baseUrl,
            authenticationPluginConfiguration
        )

        execution.setVariable("resultaatPV", "Product: $result")
    }

    @PluginAction(
        key = "create-product",
        title = "Create product plugin action",
        description = "Create product plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun createProduct(
        execution: DelegateExecution,
        @PluginActionProperty productNaam: String,
        @PluginActionProperty productTypeUuid: String,
        @PluginActionProperty eigenaarBsn: String,
        @PluginActionProperty eigenaarData: List<DataBindingConfig>?,
        @PluginActionProperty aanvraagZaakUrn: String?,
        @PluginActionProperty aanvraagZaakUrl: String?,
        @PluginActionProperty productPrijs: String,
        @PluginActionProperty productStatus: String,
        @PluginActionProperty productFrequentie: String,
        @PluginActionProperty gepubliceerd: java.lang.Boolean?
    ) {
        val freqEnum = toFreqEnum(productFrequentie)
        val statusEnum = toStatusEnum(productStatus)

        val resultaat = openProductClient.createProduct(
            baseUrl,
            authenticationPluginConfiguration,
            ProductRequest(
                naam = productNaam,
                producttypeUuid = productTypeUuid,
                eigenaren = listOf(
                    EigenaarRequest(
                        bsn = eigenaarBsn
                    )
                ),
                gepubliceerd = gepubliceerd as Boolean?,
                aanvraagZaakUrn = aanvraagZaakUrn,
                aanvraagZaakUrl = aanvraagZaakUrl,
                prijs = productPrijs,
                frequentie = freqEnum,
                status = statusEnum
            )
        )
        execution.setVariable("resultaatPV", "Product aangemaakt: $productNaam")
    }

    @PluginAction(
        key = "update-product",
        title = "Update product plugin action",
        description = "Update product plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun updateProduct(
        execution: DelegateExecution,
        @PluginActionProperty productUuid: String,
        @PluginActionProperty productNaam: String,
        @PluginActionProperty productTypeUuid: String,
        @PluginActionProperty eigenaarBsn: String,
        @PluginActionProperty aanvraagZaakUrn: String?,
        @PluginActionProperty aanvraagZaakUrl: String?,
        @PluginActionProperty gepubliceerd: Boolean,
        @PluginActionProperty productPrijs: String,
        @PluginActionProperty productFrequentie: String,
        @PluginActionProperty productStatus: String
    ) {
        val freqEnum = toFreqEnum(productFrequentie)
        val statusEnum = toStatusEnum(productStatus)

        val resultaat = openProductClient.updateProduct(
            baseUrl,
            authenticationPluginConfiguration,
            ProductRequest(
                uuid = productUuid,
                naam = productNaam,
                producttypeUuid = productTypeUuid,
                eigenaren = listOf(
                    EigenaarRequest(
                        bsn = eigenaarBsn
                    )
                ),
                gepubliceerd = gepubliceerd as Boolean?,
                aanvraagZaakUrn = aanvraagZaakUrn,
                aanvraagZaakUrl = aanvraagZaakUrl,
                prijs = productPrijs,
                frequentie = freqEnum,
                status = statusEnum
            )
        )

        execution.setVariable("resultaatPV", "Product gewijzigd met UUID: $productUuid")
    }

    @PluginAction(
        key = "delete-product",
        title = "Delete product plugin action",
        description = "Delete product plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun deleteProduct(
        execution: DelegateExecution,
        @PluginActionProperty productUuid: String
    ) {
        val result = openProductClient.deleteProduct(
            baseUrl,
            authenticationPluginConfiguration,
            productUuid
        )

        execution.setVariable("resultaatPV", "Product verwijderd met UUID: $productUuid")
    }

    fun toFreqEnum(frequentie: String): FrequentieEnum {
        return when (frequentie) {
            "eenmalig" -> FrequentieEnum.EENMALIG
            "jaarlijks" -> FrequentieEnum.JAARLIJKS
            "maandelijks" -> FrequentieEnum.MAANDELIJKS
            else -> throw IllegalArgumentException("Ongeldige frequentie: $frequentie")
        }
    }

    fun toStatusEnum(status: String): StatusEnum {
        return when (status) {
            "initieel" -> StatusEnum.INITIEEL
            "gereed" -> StatusEnum.GEREED
            "actief" -> StatusEnum.ACTIEF
            "ingetrokken" -> StatusEnum.INGETROKKEN
            "geweigerd" -> StatusEnum.GEWEIGERD
            "verlopen" -> StatusEnum.VERLOPEN
            else -> throw IllegalArgumentException("Ongeldige status: $status")
        }
    }

}
