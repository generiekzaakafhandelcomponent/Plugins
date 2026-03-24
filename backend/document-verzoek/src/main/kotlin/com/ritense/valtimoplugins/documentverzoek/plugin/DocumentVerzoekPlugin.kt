package com.ritense.valtimoplugins.documentverzoek.plugin

import com.ritense.authorization.AuthorizationContext
import com.ritense.case.service.CaseDefinitionService
import com.ritense.documentenapi.DocumentenApiPlugin
import com.ritense.notificatiesapi.NotificatiesApiListener
import com.ritense.notificatiesapi.NotificatiesApiPlugin
import com.ritense.notificatiesapi.domain.Abonnement
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginEvent
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.EventType
import com.ritense.valtimo.service.ApplicationStateService
import com.ritense.valtimoplugins.documentverzoek.domain.InformatieobjecttypeUrl
import com.ritense.zakenapi.ZakenApiPlugin
import com.ritense.zakenapi.repository.ZaakTypeLinkRepository

@Plugin(
    key = "document-verzoek",
    title = "Document Verzoek",
    description = "Handles document verzoeken"
)
class DocumentVerzoekPlugin(
    private val applicationStateService: ApplicationStateService,
    private val zaakTypeLinkRepository: ZaakTypeLinkRepository,
    private val caseDefinitionService: CaseDefinitionService,

    ) : NotificatiesApiListener {

    @PluginProperty(key = "notificatiesApiPluginConfiguration", secret = false)
    lateinit var notificatiesApiPluginConfiguration: NotificatiesApiPlugin

    @PluginProperty(key = "zakenApiPlugin", secret = false)
    lateinit var zakenApiPlugin: ZakenApiPlugin

    @PluginProperty(key = "documentenApiPlugin", secret = false)
    lateinit var documentenApiPlugin: DocumentenApiPlugin

    @PluginProperty(key = "eventMessage", secret = false)
    lateinit var eventMessage: String

    @PluginProperty(key = "informatieobjecttypeUrls", secret = false)
    lateinit var informatieobjecttypeUrls: List<InformatieobjecttypeUrl>

    @PluginEvent(invokedOn = [EventType.CREATE, EventType.UPDATE])
    fun validateProperties() {
        if (!applicationStateService.isApplicationReady()) {
            return // Skip validation: Case Definition might not exist yet because the auto deployment of Case Definitions happens later.
        }
    }

    override fun getNotificatiesApiPlugin(): NotificatiesApiPlugin {
        return notificatiesApiPluginConfiguration
    }

    override fun getKanaalFilters(): List<Abonnement.Kanaal> {
        return AuthorizationContext.Companion.runWithoutAuthorization {
            (caseDefinitionService.getCaseDefinitions(active = true, final = false) +
                    caseDefinitionService.getCaseDefinitions(
                        active = true,
                        final = true
                    )).mapNotNull { caseDefinition ->

                val zaakTypeLink = zaakTypeLinkRepository.findByCaseDefinitionId(caseDefinition.id)
                    ?: return@mapNotNull null

                Abonnement.Kanaal(
                    naam = "zaken",
                    filters = mapOf(
                        "zaakType" to zaakTypeLink.zaakTypeUrl.toString(),
                        "actie" to "create",
                        "resource" to "zaakinformatieobject"
                    )
                )
            }
        }.distinct()
    }
}