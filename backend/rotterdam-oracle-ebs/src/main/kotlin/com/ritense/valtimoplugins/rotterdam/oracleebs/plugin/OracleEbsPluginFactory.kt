package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.ritense.valueresolver.ValueResolverService

class OracleEbsPluginFactory(
    pluginService: PluginService,
    private val esbClient: EsbClient,
    private val valueResolverService: ValueResolverService,
    private val objectMapper: ObjectMapper
) : PluginFactory<OracleEbsPlugin>(pluginService) {

    override fun create(): OracleEbsPlugin =
        OracleEbsPlugin(esbClient, valueResolverService, objectMapper)
}
