/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

dockerCompose {
    setProjectName("externe-klanttaak")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    implementation("com.ritense.valtimo:catalogi-api")
    implementation("com.ritense.valtimo:contract")
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:document")
    implementation("com.ritense.valtimo:documenten-api")
    implementation("com.ritense.valtimo:outbox")
    implementation("com.ritense.valtimo:object-management")
    implementation("com.ritense.valtimo:objecten-api")
    implementation("com.ritense.valtimo:objecttypen-api")
    implementation("com.ritense.valtimo:openzaak-plugin-authentication")
    implementation("com.ritense.valtimo:notificaties-api")
    implementation("com.ritense.valtimo:plugin")
    implementation("com.ritense.valtimo:process-document")
    implementation("com.ritense.valtimo:value-resolver")
    implementation("com.ritense.valtimo:zaken-api")

    implementation(kotlin("reflect"))

    implementation("org.springframework.boot:spring-boot-starter-security")

    implementation("io.github.oshai:kotlin-logging-jvm:7.0.3")

    // Testing
    testImplementation("com.ritense.valtimo:local-resource")
    testImplementation("com.ritense.valtimo:test-utils-common")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webflux")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa")
    testImplementation("org.springframework.data:spring-data-jpa")
    testImplementation("com.squareup.okhttp3:mockwebserver:4.12.0")
    testImplementation("org.camunda.community.mockito:camunda-platform-7-mockito:7.21.0")
    testImplementation("org.hamcrest:hamcrest-library")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.4.0")

    testImplementation("org.postgresql:postgresql")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}

apply(from = "gradle/publishing.gradle")