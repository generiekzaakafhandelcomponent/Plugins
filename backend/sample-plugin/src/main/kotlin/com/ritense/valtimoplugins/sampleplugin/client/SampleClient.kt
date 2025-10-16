package com.ritense.valtimoplugins.sampleplugin.client

import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Component
class SampleClient(private val restClient: RestClient = RestClient.create()) {
    fun fetchTimeAPI(api_url: String): ApiResponse {
        return try {
            val response = restClient.get()
                .uri(api_url)
                .retrieve()
                .toEntity(Timezone::class.java)

            val status = response.statusCode.value().toString()

            if (status !== "200") {
                ApiResponse(error = "Error: status code $status")
            }

            ApiResponse(result = response, responseStatus = status)
        } catch(e: Exception) {
            ApiResponse(error = "Error: ${e.message}")
        }
    }
}

@Service
class SampleService(private val sampleClient: SampleClient) {
    fun printAPIResults(api_url: String): String {
        val apiResponse = sampleClient.fetchTimeAPI(api_url)

        if (apiResponse.error != null) {
            return "Failed: ${apiResponse.error}"
        }

        val tz = apiResponse.result?.body
        return "Timezone: ${tz?.timezone}, DateTime: ${tz?.datetime}, Client IP: ${tz?.client_ip}, HTTP Status: ${apiResponse.responseStatus}"
    }
}