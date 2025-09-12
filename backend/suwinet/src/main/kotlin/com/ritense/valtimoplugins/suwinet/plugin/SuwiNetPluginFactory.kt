package com.ritense.valtimoplugins.suwinet.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoStudiefinancieringInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetKadasterInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetRdwService
import com.ritense.valtimoplugins.suwinet.service.SuwinetSvbPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetUwvPersoonsIkvService

class SuwiNetPluginFactory(
    pluginService: PluginService,
    private val suwinetBrpInfoService: SuwinetBrpInfoService,
    private val suwinetDuoPersoonsInfoService: SuwinetDuoPersoonsInfoService,
    private val suwinetDuoStudiefinancieringInfoService: SuwinetDuoStudiefinancieringInfoService,
    private val suwinetKadasterInfoService: SuwinetKadasterInfoService,
    private val suwinetRdwService: SuwinetRdwService,
    private val suwinetSvbPersoonsInfoService: SuwinetSvbPersoonsInfoService,
    private val suwinetUwvPersoonsIkvService: SuwinetUwvPersoonsIkvService
) : PluginFactory<SuwiNetPlugin>(pluginService) {

    override fun create(): SuwiNetPlugin {
        return SuwiNetPlugin(
            suwinetBrpInfoService,
            suwinetDuoPersoonsInfoService,
            suwinetDuoStudiefinancieringInfoService,
            suwinetKadasterInfoService,
            suwinetRdwService,
            suwinetSvbPersoonsInfoService,
            suwinetUwvPersoonsIkvService
        )
    }
}
