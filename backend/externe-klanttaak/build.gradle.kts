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

val camundaMockitoVersion: String by project
val kotlinLoggingVersion: String by project
val mockitoKotlinVersion: String by project
val okhttpVersion: String by project

dockerCompose {
    setProjectName("externe-klanttaak")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    implementation("com.ritense.valtimo:catalogi-api")
    compileOnly("com.ritense.valtimo:contract")
    compileOnly("com.ritense.valtimo:core")
    compileOnly("com.ritense.valtimo:document")
    implementation("com.ritense.valtimo:documenten-api")
    compileOnly("com.ritense.valtimo:outbox")
    implementation("com.ritense.valtimo:object-management")
    implementation("com.ritense.valtimo:objecten-api")
    implementation("com.ritense.valtimo:objecttypen-api")
    implementation("com.ritense.valtimo:openzaak-plugin-authentication")
    implementation("com.ritense.valtimo:notificaties-api")
    compileOnly("com.ritense.valtimo:plugin")
    compileOnly("com.ritense.valtimo:process-document")
    compileOnly("com.ritense.valtimo:value-resolver")
    implementation("com.ritense.valtimo:zaken-api")

    implementation(kotlin("reflect"))

    compileOnly("org.springframework.boot:spring-boot-starter-security")

    implementation("io.github.oshai:kotlin-logging-jvm:$kotlinLoggingVersion")

    // Testing
    testImplementation("com.ritense.valtimo:contract")
    testImplementation("com.ritense.valtimo:core")
    testImplementation("com.ritense.valtimo:document")
    testImplementation("com.ritense.valtimo:outbox")
    testImplementation("com.ritense.valtimo:plugin")
    testImplementation("com.ritense.valtimo:process-document")
    testImplementation("com.ritense.valtimo:value-resolver")
    testImplementation("org.springframework.boot:spring-boot-starter-security")
    testImplementation("com.ritense.valtimo:local-resource")
    testImplementation("com.ritense.valtimo:test-utils-common")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webflux")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa")
    testImplementation("org.springframework.data:spring-data-jpa")
    testImplementation("com.squareup.okhttp3:mockwebserver:$okhttpVersion")
    testImplementation("org.camunda.community.mockito:camunda-platform-7-mockito:$camundaMockitoVersion")
    testImplementation("org.hamcrest:hamcrest-library")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoKotlinVersion")

    testImplementation("org.postgresql:postgresql")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}

apply(from = "gradle/publishing.gradle")