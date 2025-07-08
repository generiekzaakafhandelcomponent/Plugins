package com.ritense.valtimoplugins.huggingface.client.mistral

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable

data class MistralResponse(
    @JsonProperty("choices") val choices: List<Choice>
)

data class Choice(
    @JsonProperty("index") val index: Int,
    @JsonProperty("message") val message: Message,
)

data class Message(
    @JsonProperty("content") val content: String
)

data class StringWrapper(
    val value: String
) : Serializable
