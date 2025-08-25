/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


package com.ritense.valtimoplugins.documents.plugin

import com.ritense.documentenapi.DocumentenApiAuthentication
import com.ritense.documentenapi.DocumentenApiPlugin
import com.ritense.documentenapi.client.*
import com.ritense.documentenapi.event.DocumentCreated
import com.ritense.plugin.annotation.*
import com.ritense.processlink.domain.ActivityTypeWithEventName

import com.ritense.valtimo.contract.validation.Url

import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.context.ApplicationEventPublisher
import java.io.InputStream
import java.net.URI
import java.time.LocalDate

private val logger = KotlinLogging.logger {}
private const val COPY_KEY = "COPY_URLS"

@Plugin(
    key = "documentsXtra",
    title = "DocumentsXtra plugin",
    description = "DocumentsXtra adds more actions for the Documenten API"
)
class DocumentsXtraPlugin(
    private val client: DocumentenApiClient,
    private val applicationEventPublisher: ApplicationEventPublisher,
) {
    @PluginProperty(key = "authenticationPluginConfiguration", secret = false)
    lateinit var authenticationPluginConfiguration: DocumentenApiAuthentication

    @Url
    @PluginProperty(key = DocumentenApiPlugin.URL_PROPERTY, secret = false)
    lateinit var url: URI


    @PluginAction(
        key = "copy-eio",
        title = "Kopieer enkelvoudig informatieobjecten",
        description = "Kopieer gegeven enkelvoudig informatie objecten  naar  nieuwe informatie objecten",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun copyInformationObject(
        execution: DelegateExecution,
        @PluginActionProperty eioUrls: List<String>
    ) {
        logger.debug { "copying ${eioUrls.toString()}" }

        var copyUrls = eioUrls.map { eioUrl ->
            logger.debug { "copying $eioUrl" }
            val objectUrl = URI.create(eioUrl);
            val dio = client.getInformatieObject(authenticationPluginConfiguration, objectUrl)
            val content = client.downloadInformatieObjectContent(authenticationPluginConfiguration, objectUrl)
            val request = createDocRequest(dio)

            logger.info { "Store document $request" }
            val documentCreateResult = client.storeDocument(authenticationPluginConfiguration, url, request)

            logger.debug { "created document $documentCreateResult" }


            logger.debug { "store in parts" }
            val bestandsdelenRequest = BestandsdelenRequest(
                inhoud = content
            )

            client.storeDocumentInParts(authenticationPluginConfiguration, url, bestandsdelenRequest, documentCreateResult);
            logger.debug { "stored ${dio.bestandsnaam} in parts" }

            client.unlockInformatieObject(authenticationPluginConfiguration,
                URI.create(documentCreateResult.url),
                DocumentLock(documentCreateResult.getLockOrEmpty())
            )

            val event = DocumentCreated(
                documentCreateResult.url,
                documentCreateResult.auteur,
                documentCreateResult.bestandsnaam,
                documentCreateResult.bestandsomvang,
                documentCreateResult.beginRegistratie
            )
            applicationEventPublisher.publishEvent(event)
            documentCreateResult.url
        }

        execution.setVariable(COPY_KEY, copyUrls)
    }

    private fun createDocRequest(dio: DocumentInformatieObject): CreateDocumentRequest {
        val request = CreateDocumentRequest(
            bronorganisatie = dio.bronorganisatie.toString(),
            creatiedatum = LocalDate.now(),
            titel = dio.titel,
            vertrouwelijkheidaanduiding = dio.vertrouwelijkheidaanduiding,
            auteur = dio.auteur,
            status = dio.status,
            taal = dio.taal,
            bestandsnaam = dio.bestandsnaam,
            bestandsomvang = dio.bestandsomvang,
            inhoud = InputStream.nullInputStream(),
            beschrijving = dio.beschrijving,
            ontvangstdatum = dio.ontvangstdatum,
            verzenddatum = dio.verzenddatum,
            informatieobjecttype = dio.informatieobjecttype,
            formaat = dio.formaat,
            trefwoorden = dio.trefwoorden,
        )
        return request
    }
}
