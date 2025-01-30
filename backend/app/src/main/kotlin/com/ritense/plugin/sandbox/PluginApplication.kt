/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.plugin.sandbox

import java.net.InetAddress
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(scanBasePackages = ["com.ritense.*"])
class PluginApplication {

    companion object {
        private val logger = KotlinLogging.logger {}

        @JvmStatic
        fun main(args: Array<String>) {
            val app = runApplication<PluginApplication>(*args)

            logger.info(
                """
----------------------------------------------------------
	Application '{}' is running! Access URLs:
	Local: 		http://localhost:{}
	External: 	http://{}:{}
----------------------------------------------------------""",
                app.environment.getProperty("spring.application.name"),
                app.environment.getProperty("server.port"),
                InetAddress.getLocalHost().hostAddress,
                app.environment.getProperty("server.port")
            )
        }
    }

}
