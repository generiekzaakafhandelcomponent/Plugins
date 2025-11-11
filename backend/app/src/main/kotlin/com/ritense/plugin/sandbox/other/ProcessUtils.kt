package com.ritense.plugin.sandbox.other

import com.ritense.authorization.annotation.RunWithoutAuthorization
import com.ritense.valtimo.contract.annotation.ProcessBean
import org.camunda.bpm.engine.RuntimeService
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service
import java.util.*


@Service
@ProcessBean
@Suppress("unused")
class ProcessUtils(
    private val environment: Environment,
    private val runtimeService: RuntimeService
) {
    fun isAnyOfProfilesActive(vararg profiles: String?): Boolean {
        var activeProfiles = environment.getActiveProfiles()

        if (activeProfiles.size == 0) {
            // Fall back to "dev" when no profiles are active
            activeProfiles = arrayOf<String>("dev")
        }

        return Arrays.stream<String?>(activeProfiles)
            .anyMatch { activeProfile: String? -> Arrays.asList<String?>(*profiles).contains(activeProfile) }
    }

    @RunWithoutAuthorization
    fun sendCatchEventMessageToAll(
        message: String?
    ) {
        sendCatchEventMessageToAll(message, null)
    }

    @RunWithoutAuthorization
    fun sendCatchEventMessageToAll(
        message: String?,
        variables: MutableMap<String?, Any?>?
    ) {
        runtimeService
            .createMessageCorrelation(message)
            .setVariables(variables)
            .correlateAll()
    }

    @RunWithoutAuthorization
    fun mapOf(vararg keyValuePairs: Any): MutableMap<String?, Any?> {
        require(!(keyValuePairs == null || keyValuePairs.size % 2 != 0)) { "Must provide even number of arguments as key-value pairs" }

        val map: MutableMap<String?, Any?> = LinkedHashMap<String?, Any?>()
        var i = 0
        while (i < keyValuePairs.size) {
            val key: Any = keyValuePairs[i]
            val value: Any? = keyValuePairs[i + 1]

            require(key is String) { "Map keys must be Strings, found: " + key.javaClass }

            map.put(key, value)
            i += 2
        }
        return Collections.unmodifiableMap<String?, Any?>(map)
    }

    @SafeVarargs
    fun <T> toList(vararg elements: T?): MutableList<T?> {
        return Arrays.asList<T?>(*elements)
    }
}
