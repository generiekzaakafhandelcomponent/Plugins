/*
 *  Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 *  Licensed under EUPL, Version 1.2 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.ritense.valtimoplugins.valuemapper.plugin

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.JsonNodeType
import com.fasterxml.jackson.databind.node.MissingNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.databind.node.ValueNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.authorization.AuthorizationContext
import com.ritense.document.domain.Document
import com.ritense.document.service.DocumentService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperCommand
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperDefinition
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperTransformation
import com.ritense.valtimoplugins.valuemapper.exception.ValueMapperCommandException
import com.ritense.valtimoplugins.valuemapper.exception.ValueMapperMappingException
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperTemplateService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service

@Service
open class ValueMapper(
    private val templateService: ValueMapperTemplateService,
    private val documentService: DocumentService
) {

    /**
     * Retrieves the document content based on the provided businessKey and applies a value definition
     * to said content.
     *
     * Example usage in a JUEL expression in a camunda process:
     * `${valueMapper.applyToDocument("test-v1",execution.businessKey)}`
     *
     * @param mapperDefinitionId the definition id (filename without `.valuemapping.json` suffix) of
     * the Value Mapper Definition that you want to apply.
     * @param businessKey the businessKey/documentId of the document the Value Mapper Definition should be applied to.
     **/
    fun applyToDocument(
        definitionKey: String,
        businessKey: String
    ) {
        val mapperDefinition = requireNotNull(templateService.getDefinition(definitionKey))
        { "No Mapper Definitions found with id $definitionKey" }

        documentService
            .get(businessKey)
            .applyMapperDefinition(mapperDefinition)
    }

    /**
     * Applies the specified Value Mapper Definition to the provided [Map<String,Any>] and returns
     * the transformation result.
     *
     * Example usage in a JUEL expression in a camunda process:
     * `${valueMapper.applyToDocument("test-v1",myObject)}`
     *
     * @param definitionId the definition id (filename without `.valuemapping.json` suffix) of
     * the Value Mapper Definition that you want to apply.
     * @param inputObject object structure that the Value Mapper Definition should be applied to.
     * @return The result of the transformation done by the Value Mapper Definition. This can be anything depending
     * on the commands supplied in the definition. If no commands were run, returns original unmodified object.
     **/
    fun applyToObject(
        definitionId: String,
        inputObject: Map<String, Any>
    ): Any {
        val mapperDefinition = requireNotNull(templateService.getDefinition(definitionId))
        { "No Mapper Definitions found with id $definitionId" }
        val inputNode: ObjectNode = mapper.convertValue(inputObject)

        val mappingResult = inputNode.applyMapperDefinition(mapperDefinition)

        return when (mappingResult.isEmpty) {
            false -> mapper.convertValue(mappingResult)
            true -> inputObject
        }
    }

    private fun Document.applyMapperDefinition(mapperDefinition: ValueMapperDefinition) {
        val inputNode: ObjectNode = mapper.convertValue(content().asJson())

        val mappingResult = inputNode.applyMapperDefinition(mapperDefinition)

        if (!mappingResult.isEmpty) {
            AuthorizationContext.Companion.runWithoutAuthorization {
                documentService.modifyDocument(
                    this,
                    mappingResult
                )
            }
        }
    }

    private fun ObjectNode.applyMapperDefinition(mapperDefinition: ValueMapperDefinition): ObjectNode {
        val outputNode: ObjectNode = mapper.createObjectNode()

        mapperDefinition
            .commands
            .forEachIndexed { index, command ->
                try {
                    this.mapWithCommandToTarget(command, outputNode)
                } catch (e: Exception) {
                    throw ValueMapperCommandException("Failed to parse value mapper command #$index", e)
                }
            }

        return outputNode
    }

    private fun ObjectNode.mapWithCommandToTarget(command: ValueMapperCommand, outputNode: JsonNode): JsonNode {
        when (command.sourcePointer.contains(ARRAY_DELIMITER_MATCHER)) {
            false -> applySimplePointerCommand(command, outputNode)
            true -> applyComplexPointerCommand(command, outputNode)
        }

        return outputNode
    }

    /**
     * Deconstruct a command that contains a complex pointer. Apply all resulting commands to This node.
     **/
    private fun JsonNode.applyComplexPointerCommand(command: ValueMapperCommand, outputNode: JsonNode) {
        val sourcePointer = command.sourcePointer
        val targetPointer = command.targetPointer
        val sourcePointerParts = sourcePointer.split("/$JSON_POINTER_ARRAY_DELIMITER")
        val targetPointerParts = targetPointer.split("/$JSON_POINTER_ARRAY_DELIMITER")
        val sourcePointerProperties = sourcePointer.split(JSON_POINTER_PROPERTY_DELIMITER)

        require(sourcePointerParts.size == targetPointerParts.size) {
            "Target pointer must have the same amount of wildcard arrays ($JSON_POINTER_ARRAY_DELIMITER) " +
                "as the source pointer."
        }

        val explodedSourceComplexPointer = findPaths(
            "",
            sourcePointerParts.dropLast(1),
            sourcePointerParts.last(),
            mutableListOf()
        )

        val explodedTargetComplexPointer = explodedSourceComplexPointer
            .map { explodedSourcePointer ->
                val indices = explodedSourcePointer
                    .split(JSON_POINTER_PROPERTY_DELIMITER)
                    .filterNot { sourcePointerProperties.contains(it) }
                    .toMutableList()

                ARRAY_DELIMITER_MATCHER.replace(targetPointer) { _ ->
                    "[${indices.removeFirstOrNull() ?: 0}]"
                }
            }

        List(explodedSourceComplexPointer.size) { simplePointerIndex ->
            val newSourcePointer = explodedSourceComplexPointer[simplePointerIndex]
            val newTargetPointer = explodedTargetComplexPointer[simplePointerIndex]

            if (newSourcePointer.isNotEmpty()) {
                command.copy(
                    sourcePointer = newSourcePointer,
                    targetPointer = newTargetPointer
                )
            } else {
                null
            }
        }.filterNotNull()
            .forEach { simplifiedComplexCommand ->
                applySimplePointerCommand(simplifiedComplexCommand, outputNode)
            }
    }

    private fun JsonNode.findPaths(currentPath: String, remainingParts: List<String>, lastProperty: String, foundPaths: MutableList<String>): List<String> {
        if (remainingParts.isEmpty()) {
            foundPaths.add(currentPath + lastProperty)
            return foundPaths
        } else {
            val nextPathPart = remainingParts.first()
            return when (val currentNode = at(nextPathPart)) {
                is ArrayNode -> {
                    when (currentNode.isEmpty) {
                        false -> currentNode
                            .mapIndexed { index, childNode ->
                                val newPath = "$currentPath$nextPathPart/$index"
                                childNode.findPaths(newPath, remainingParts.drop(1), lastProperty, mutableListOf())
                            }
                            .flatten()

                        true -> return listOf(currentPath)
                    }
                }

                is MissingNode -> return findPaths(currentPath, remainingParts.drop(1), lastProperty, foundPaths)
                else -> throw ValueMapperCommandException(
                    "Expected ARRAY at path ${remainingParts.first()} but found ${currentNode.nodeType}"
                )
            }
        }
    }

    /**
     * Apply command to this node and store the result in provided output node.
     **/
    private fun JsonNode.applySimplePointerCommand(command: ValueMapperCommand, outputNode: JsonNode) {
        val sourceValue: JsonNode = at(command.sourcePointer)
        val resolvedValue: JsonNode? = sourceValue
            .takeUnless { it.isMissingNode }

        if (resolvedValue != null) {
            val transformedValue = when (resolvedValue) {
                is ArrayNode -> resolvedValue.mapNotNull { listItem ->
                    listItem
                        .applyTransformations(command.transformations)
                        ?: command.defaultValue
                }

                else -> resolvedValue
                    .applyTransformations(command.transformations)
                    ?: command.defaultValue
            }

            if (transformedValue != null) {
                outputNode.buildJsonStructure(
                    targetValue = mapper.convertValue(transformedValue),
                    targetPath = command.targetPointer
                )
            } else {
                logger.debug {
                    "Skipping command with pointer ${command.sourcePointer}: " +
                        "No transformations matched value at ${command.sourcePointer}."
                }
            }
        } else {
            logger.debug {
                "Skipping command with pointer ${command.sourcePointer}: No value found at pointer ${command.sourcePointer}."
            }
        }
    }


    /**
     * Find and apply a transformation for given value.
     * @return
     * * `null` when transformations are empty so that an optional default can be applied later
     * * The initial value of the node if no transformation array is defined. This is used with simple copy commands
     * * The result of a matching transformations' `transform()` method. `null` if no transformations matched value.
     **/
    private fun JsonNode.applyTransformations(transformations: List<ValueMapperTransformation>?): Any? {
        return when (transformations?.isEmpty()) {
            null -> this
            true -> null
            false -> when (this) {
                is ValueNode, is ObjectNode -> transformations
                    .firstOrNull { transformation ->
                        transformation.canTransform(this)
                    }
                    ?.transform(this)

                else -> throw ValueMapperMappingException(
                    "No supported transformation found for ${this.nodeType} node"
                )
            }
        }
    }

    private fun JsonNode.buildJsonStructure(targetValue: JsonNode, targetPath: String) {
        if (targetPath == "/") throw ValueMapperMappingException(
            "Can not put value at path $targetPath. Root node modification is not supported."
        )
        val targetKey = targetPath.substringAfterLast("/")
        val targetPointer = JsonPointer.compile(targetPath.replace(ARRAY_DELIMITER_PARTS_MATCHER, ""))
        val parentPointer = targetPointer.head()

        when (val parentNode = this.at(parentPointer)) {
            is ObjectNode -> {
                when (val targetNode = parentNode.at(targetPointer.last())) {
                    is ArrayNode -> when (targetValue) {
                        is ArrayNode -> targetNode.addAll(targetValue)
                        else -> targetNode.add(targetValue)
                    }

                    else -> parentNode.replace(targetKey, targetValue)
                }
            }

            is ArrayNode -> {
                when (val targetNode = parentNode.at(targetPointer.last())) {
                    is ArrayNode -> when (targetValue) {
                        is ArrayNode -> targetNode.addAll(targetValue)
                        else -> targetNode.add(targetValue)
                    }

                    is MissingNode -> parentNode.add(targetValue)
                    else -> parentNode.set(targetKey.replace(ARRAY_DELIMITER_PARTS_MATCHER, "").toInt(), targetValue)
                }
            }

            else -> this.buildJsonStructureForNonExistingPointer(targetPath, targetValue)
        }
    }


    private fun JsonNode.buildJsonStructureForNonExistingPointer(targetPath: String, targetValue: JsonNode) {
        val pathSteps = targetPath
            .split(JSON_POINTER_PROPERTY_DELIMITER)
            .drop(1)
        val pathIterator = pathSteps.listIterator()

        var secondToLastNode: JsonNode = mapper.missingNode()
        var currentNode: JsonNode = this
        while (pathIterator.hasNext()) {
            secondToLastNode = currentNode
            val nextKey = pathIterator.next()
            val nextNode: JsonNode = when (secondToLastNode.nodeType) {
                JsonNodeType.ARRAY -> secondToLastNode.get(
                    nextKey.replace(ARRAY_DELIMITER_PARTS_MATCHER, "").toInt()
                )

                JsonNodeType.OBJECT -> secondToLastNode.get(nextKey)
                else -> throw ValueMapperMappingException(
                    "Node before \"$nextKey\" was not a ContainerNode in structure \"$targetPath\". " +
                            "This could be due to multiple commands transformed values of incompatible types " +
                            "into same structure."
                )
            } ?: mapper.missingNode()

            currentNode = when (currentNode) {
                is ArrayNode -> when (nextNode.nodeType) {
                    JsonNodeType.MISSING -> when (pathIterator.hasNext()) {
                        true -> {
                            val nextOfNext = pathIterator.next()
                            pathIterator.previous()
                            when (nextOfNext.contains(ARRAY_DELIMITER_INDEX_MATCHER)) {
                                true -> currentNode
                                    .add(mapper.createArrayNode())
                                    .last()

                                false -> currentNode
                                    .add(mapper.createObjectNode())
                                    .last()
                            }
                        }

                        false -> currentNode
                    }

                    JsonNodeType.OBJECT, JsonNodeType.ARRAY -> nextNode

                    else -> currentNode
                        .add(nextNode)
                        .last()
                }

                is ObjectNode -> when (nextNode.nodeType) {
                    JsonNodeType.MISSING -> when (pathIterator.hasNext()) {
                        false -> currentNode.putObject(nextKey)
                        true -> {
                            val nextOfNext = pathIterator.next()
                            pathIterator.previous()
                            when (nextOfNext.contains(ARRAY_DELIMITER_INDEX_MATCHER)) {
                                true -> currentNode.putArray(nextKey)
                                false -> currentNode.putObject(nextKey)
                            }
                        }
                    }

                    JsonNodeType.OBJECT, JsonNodeType.ARRAY -> nextNode

                    else -> currentNode.replace(nextKey, nextNode)
                }

                else -> throw ValueMapperMappingException("Failed to build stucture in target Node for path $targetPath")
            }
        }

        when (secondToLastNode) {
            is ArrayNode -> secondToLastNode.add(targetValue)
            is ObjectNode -> secondToLastNode.replace(pathSteps.last(), targetValue)
            else -> throw ValueMapperMappingException(
                "Can not add item/property to node of type ${secondToLastNode.nodeType}. " +
                        "Make sure that your (transformed) value is compatible with the target structure."
            )
        }

    }


    companion object {
        const val JSON_POINTER_ARRAY_DELIMITER = "[]"
        const val JSON_POINTER_PROPERTY_DELIMITER = "/"
        private val ARRAY_DELIMITER_MATCHER = """\[]""".toRegex()
        private val ARRAY_DELIMITER_PARTS_MATCHER = """[\[\]]""".toRegex()
        private val ARRAY_DELIMITER_INDEX_MATCHER = """[(\[\d*\])]""".toRegex()
        private val logger = KotlinLogging.logger { }
        private val mapper = MapperSingleton.get()
    }
}
