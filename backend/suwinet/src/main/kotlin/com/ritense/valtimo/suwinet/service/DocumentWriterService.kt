package com.ritense.valtimo.suwinet.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.Document
import com.ritense.document.service.DocumentService

class DocumentWriterService(
    private val documentService: DocumentService
) {

    fun writeValueToDocumentAtPath(targetValue: Any, targetPath: String, documentId: String) {
        val document = getDocumentById(documentId)
        val valueNode = jacksonObjectMapper().valueToTree<JsonNode>(targetValue)
        val jsonPatch = buildJsonPatchWithObjectNodeAtPath(valueNode, targetPath)

        runWithoutAuthorization { documentService.modifyDocument(document, jsonPatch) }
    }

    private fun buildJsonPatchWithObjectNodeAtPath(jsonObject: JsonNode, targetPath: String): JsonNode {
        val sanitizedPath = removeRootSlashFromPathString(targetPath)
        val pathKeyNames = sanitizedPath.split("/")
        val pathIterator = pathKeyNames.iterator()
        val rootNode = jacksonObjectMapper().createObjectNode()

        var secondToLastNode = jacksonObjectMapper().createObjectNode()
        var currentNode = rootNode
        while (pathIterator.hasNext()) {
            secondToLastNode = currentNode
            currentNode = currentNode.putObject(pathIterator.next())
        }

        secondToLastNode.replace(pathKeyNames.last(), jsonObject)

        return rootNode
    }

    private fun removeRootSlashFromPathString(targetPath: String): String {
        return if (!targetPath.startsWith("/")) targetPath else targetPath.substring(1)
    }

    private fun getDocumentById(businessKey: String): Document {
        return runWithoutAuthorization { documentService.get(businessKey) }
    }
}