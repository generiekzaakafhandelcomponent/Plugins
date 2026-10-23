/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

val mockitoKotlinVersion: String by project

dockerCompose {
    setProjectName("http-client-authentication")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    compileOnly("com.ritense.valtimo:plugin-valtimo")
    compileOnly("com.ritense.valtimo:contract")
    compileOnly("com.ritense.valtimo:zaken-api")
    compileOnly("com.ritense.valtimo:documenten-api")
    compileOnly("com.ritense.valtimo:catalogi-api")
    compileOnly("com.ritense.valtimo:besluiten-api")
    compileOnly("com.ritense.valtimo:notificaties-api")
    compileOnly("com.ritense.valtimo:objecten-api")
    compileOnly("com.ritense.valtimo:objecttypen-api")
    compileOnly("com.ritense.valtimo:openzaak-plugin-authentication")
    compileOnly("org.springframework.boot:spring-boot-autoconfigure")
    compileOnly("org.springframework.boot:spring-boot-starter-web")
    compileOnly("org.springframework:spring-webflux")
    compileOnly("org.apache.httpcomponents.client5:httpclient5")

    compileOnly("io.github.microutils:kotlin-logging")

    // Testing
    testImplementation("com.ritense.valtimo:plugin-valtimo")
    testImplementation("com.ritense.valtimo:process-document")
    testImplementation("com.ritense.valtimo:local-resource")
    testImplementation("com.ritense.valtimo:test-utils-common")
    testImplementation("com.ritense.valtimo:authorization")
    testImplementation("com.ritense.valtimo:zaken-api")
    testImplementation("com.ritense.valtimo:documenten-api")
    testImplementation("com.ritense.valtimo:catalogi-api")
    testImplementation("com.ritense.valtimo:besluiten-api")
    testImplementation("com.ritense.valtimo:notificaties-api")
    testImplementation("com.ritense.valtimo:objecten-api")
    testImplementation("com.ritense.valtimo:objecttypen-api")
    testImplementation("com.ritense.valtimo:openzaak-plugin-authentication")
    testImplementation("io.github.microutils:kotlin-logging")

    testImplementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework:spring-webflux")
    testImplementation("org.apache.httpcomponents.client5:httpclient5")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa")
    testImplementation("org.springframework.boot:spring-boot-starter-security")
    testImplementation("org.springframework.boot:spring-boot-starter-test")

    testImplementation("org.mockito:mockito-core")
    testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoKotlinVersion")

    testImplementation("org.postgresql:postgresql")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}

apply(from = "gradle/publishing.gradle")
