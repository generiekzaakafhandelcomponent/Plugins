package com.ritense.valtimo.suwinet.service

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.document.service.DocumentService
import com.ritense.valtimo.suwinet.exception.ParseToDtoException
import com.ritense.valtimo.suwinet.model.PersoonDto
import java.time.temporal.ChronoField
import mu.KotlinLogging

@Suppress("UNUSED")
class SuwinetBrpStoreToDocService(
    private val documentWriterService: DocumentWriterService,
    private val documentService: DocumentService,
    private val dateTimeService: DateTimeService,
    private val maxAgeKindAlsThuiswonend: Int
) {
    fun storePersoonsgegevens(
        brpPersoonsgegevensInfo: Map<String, Any>?,
        targetPathPersoon: String,
        businessKey: String
    ) {
        /**
         *  store BRP Persoon and partner document
         */
        logger.info("storePersoonsgegevens $targetPathPersoon")
        try {
            brpPersoonsgegevensInfo
                ?.let {
                    val dto: PersoonDto = objectMapper.convertValue(brpPersoonsgegevensInfo)
                    documentWriterService.writeValueToDocumentAtPath(dto, targetPathPersoon, businessKey)
                }
        } catch (e: Exception) {
            logger.info("storePersoonsgegevens Exiting scope due to nested error.", e)
            return
        }
    }

    fun storePersoonsgegevensKinderen(
        brpPersoonsgegevensKinderenInfo: List<Map<String, Any>>?,
        brpPersoonsgegevensInfo: Map<String, Any>?,
        targetPath: String,
        businessKey: String
    ) {
        /**
         *  filter and store BRP Kinderen in document
         */
        try {
            brpPersoonsgegevensKinderenInfo
                ?.let { kinderen ->
                    if (kinderen.isEmpty()) {
                        return
                    }
                    brpPersoonsgegevensInfo
                        ?.let { persoonInfo ->
                            val yearOfCaseCreation = getCaseCreationDate(businessKey)
                            val persoon: PersoonDto = objectMapper.convertValue(persoonInfo)
                            val filteredKinderen = kinderen.map { kindInfo ->
                                objectMapper.convertValue<PersoonDto>(kindInfo)
                            }.filter { kind ->
                                kind.adresBrp == persoon.adresBrp
                                        && kind.datumOverlijden.isNullOrEmpty()
                                        && isNotToOld(kind.geboortedatum, yearOfCaseCreation)
                            }
                            documentWriterService.writeValueToDocumentAtPath(filteredKinderen, targetPath, businessKey)
                        } ?: throw ParseToDtoException("Unable to convert brp parent map to Dto")
                } ?: throw IllegalArgumentException("children map null")
        } catch (e: Exception) {
            logger.error("Exiting scope due to nested error.", e)
            return
        }

    }

    private fun isNotToOld(geboortedatum: String, yearOfCaseCreation: Int) =
        yearOfCaseCreation - dateTimeService.getYearFromDateString(
            geboortedatum,
            SUWINET_DATEIN_PATTERN
        ) < maxAgeKindAlsThuiswonend

    private fun getCaseCreationDate(businessKey: String): Int {
        val document = documentService.get(businessKey)
        return document.createdOn().get(ChronoField.YEAR)
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val objectMapper = jacksonObjectMapper()
        private const val SUWINET_DATEIN_PATTERN = "yyyy-MM-dd"
    }
}