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

val haalCentraalAuthenticationPluginVersion: String by project
val mockitoKotlinVersion: String by project

dockerCompose {
    setProjectName("HaalCentraalAuth")
    isRequiredBy(project.tasks.integrationTesting)

    val valtimoVersion: String by project

    dependencies {
        implementation(platform("com.ritense.valtimo:valtimo-dependency-versions:$valtimoVersion"))
        implementation("com.ritense.valtimo:valtimo-gzac-dependencies")

        implementation(project(":backend:object-management"))

        compileOnly("io.github.microutils:kotlin-logging")

        compileOnly("org.springframework.boot:spring-boot-starter-data-jpa")

        implementation("com.ritense.valtimoplugins:haal-centraal-authentication-plugin:$haalCentraalAuthenticationPluginVersion")

        // Netty and WebClient
        implementation("io.projectreactor.netty:reactor-netty-core")
        implementation("io.projectreactor.netty:reactor-netty-http")
        compileOnly("org.springframework:spring-webflux")

        // Testing
        testImplementation("com.ritense.valtimo:local-resource")
        testImplementation("com.ritense.valtimo:test-utils-common")

        testImplementation("org.springframework.boot:spring-boot-starter-test")

        testImplementation("org.mockito:mockito-core")
        testImplementation("org.hamcrest:hamcrest-library")
        testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoKotlinVersion")

        testImplementation("org.jetbrains.kotlin:kotlin-test")
        testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    }
}

apply(from = "gradle/publishing.gradle")
