package com.ritense.valtimoplugins.huggingface.client.gemma

import com.fasterxml.jackson.annotation.JsonProperty

data class GemmaResponse(
    @JsonProperty("choices") val choices: List<Choice>
)

data class Choice(
    @JsonProperty("index") val index: Int,
    @JsonProperty("message") val message: Message,
)

data class Message(
    @JsonProperty("content") val content: String
)
