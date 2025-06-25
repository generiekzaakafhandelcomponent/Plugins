/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
 *
 */

dockerCompose {
    setProjectName("HaalCentraalAuth")
    isRequiredBy(project.tasks.integrationTesting)

    val valtimoVersion: String by project

    dependencies {
        implementation(platform("com.ritense.valtimo:valtimo-dependency-versions:$valtimoVersion"))
        implementation("com.ritense.valtimo:valtimo-gzac-dependencies")
        implementation("com.ritense.valtimo:wordpress-mail:$valtimoVersion")
        implementation("com.ritense.valtimo:besluit:$valtimoVersion")
        implementation("com.ritense.valtimo:objects-api:$valtimoVersion")
        implementation("com.ritense.valtimo:openzaak-resource:$valtimoVersion")
        implementation("com.ritense.valtimo:openzaak:$valtimoVersion")
        implementation("com.ritense.valtimo:smartdocuments:$valtimoVersion")
        implementation("com.ritense.valtimo:wordpress-mail:$valtimoVersion")
        implementation("com.ritense.valtimoplugins:freemarker:6.0.0")
        implementation("com.ritense.valtimoplugins:object-management:0.2.0")

        implementation("io.github.microutils:kotlin-logging")

        implementation("org.springframework.boot:spring-boot-starter-data-jpa")

        // Netty and WebClient
        implementation("io.projectreactor.netty:reactor-netty-core:1.1.20")
        implementation("io.projectreactor.netty:reactor-netty-http:1.1.20")
        implementation("org.springframework:spring-webflux:6.1.10")

        // Testing
        testImplementation("com.ritense.valtimo:local-resource")
        testImplementation("com.ritense.valtimo:test-utils-common")

        testImplementation("org.springframework.boot:spring-boot-starter-test")

        testImplementation("org.mockito:mockito-core")
        testImplementation("org.hamcrest:hamcrest-library")
        testImplementation("org.mockito.kotlin:mockito-kotlin:5.4.0")

        testImplementation("org.jetbrains.kotlin:kotlin-test")
        testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    }
}
