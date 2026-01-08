package com.ritense.valtimoplugins.oipklanttaak

import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.oipklanttaak.service.OipKlanttaakService

class OipKlanttaakPluginFactory(
    pluginService: PluginService,
    private val objectManagementService: ObjectManagementService,
    private val oipKlanttaakService: OipKlanttaakService
): PluginFactory<OipKlanttaakPlugin>(pluginService) {

    override fun create(): OipKlanttaakPlugin {
        return OipKlanttaakPlugin(
            pluginService = pluginService,
            objectManagementService = objectManagementService,
            oipKlanttaakService = oipKlanttaakService
        )
    }
}
