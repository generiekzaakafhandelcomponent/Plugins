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

package com.ritense.valtimoplugins.archief

import com.ritense.authorization.annotation.RunWithoutAuthorization
import com.ritense.notificatiesapi.event.NotificatiesApiNotificationReceivedEvent
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import io.github.oshai.kotlinlogging.KotlinLogging
import org.operaton.bpm.engine.RuntimeService
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@SkipComponentScan
@Component
@Transactional
class ArchiefPluginEventListener(
    private val pluginService: PluginService,
    private val runtimeService: RuntimeService,
) {

    @Transactional
    @RunWithoutAuthorization
    @EventListener(NotificatiesApiNotificationReceivedEvent::class)
    fun handleNotification(event: NotificatiesApiNotificationReceivedEvent) {
        val archiefPlugin = findMatchingPlugin(event)
        if (archiefPlugin == null) {
            logger.debug { "ArchiefPlugin is ignoring Notificaties API event: $event" }
            return
        }

        logger.info { "Archief notification matched. Kanaal: '${event.kanaal}', resourceUrl: '${event.resourceUrl}'. Starting process '${archiefPlugin.processToStart}'." }

        val processVariables = mutableMapOf<String, Any?>(
            "kanaal" to event.kanaal,
            "resourceUrl" to event.resourceUrl,
            "hoofdObject" to event.hoofdObject,
            "actie" to event.actie,
        )
        event.kenmerken.forEach { (key, value) -> processVariables[key] = value }

        val processInstance = runtimeService.startProcessInstanceByKey(
            archiefPlugin.processToStart,
            processVariables,
        )

        logger.info { "Process '${archiefPlugin.processToStart}' started with instance id '${processInstance.processInstanceId}'." }
    }

    private fun findMatchingPlugin(event: NotificatiesApiNotificationReceivedEvent): ArchiefPlugin? {
        val eventValues = mutableMapOf(
            "hoofdObject" to event.hoofdObject,
            "resourceUrl" to event.resourceUrl,
            "actie" to event.actie,
            "aanmaakdatum" to event.aanmaakdatum,
            "kenmerken" to event.kenmerken,
        )
        event.kenmerken.forEach { (key, value) -> eventValues[key] = value }
        eventValues
            .filter { (key, _) -> !eventValues.contains(normalizeKey(key)) }
            .forEach { (key, value) -> eventValues[normalizeKey(key)] = value }

        return pluginService.createInstance(ArchiefPlugin::class.java) { properties ->
            properties["archiefProperties"].any { archiefProperty ->
                val kanaalMatches = event.kanaal.equals(archiefProperty["kanaal"].textValue(), ignoreCase = true)
                if (!kanaalMatches) return@any false

                val filters = archiefProperty["filters"]
                if (filters == null || !filters.isArray) return@any true

                filters.all { filter ->
                    val filterKey = filter["key"].textValue()
                    val filterValue = filter["value"].textValue()
                    eventValues[filterKey] == filterValue || eventValues[normalizeKey(filterKey)] == filterValue
                }
            }
        }
    }

    private fun normalizeKey(key: String): String {
        return key.lowercase().replace(Regex("[^a-z0-9]"), "")
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
