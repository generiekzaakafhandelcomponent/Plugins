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
 */


dockerCompose {
    setProjectName("mTLS-SSLContext")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

val kotlinLoggingVersion: String by project
val openApiGeneratorPluginVersion: String by project
val okhttpVersion: String by project
val squareupMoshiVersion: String by project

dependencies {
    implementation("org.springframework.security:spring-security-config")
    implementation("org.springframework.security:spring-security-web")

    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:temporary-resource-storage")
    implementation("com.ritense.valtimo:value-resolver")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    implementation("io.github.oshai:kotlin-logging:$kotlinLoggingVersion")

    implementation("jakarta.inject:jakarta.inject-api")
    implementation("jakarta.persistence:jakarta.persistence-api")

    implementation("com.squareup.okhttp3:okhttp:$okhttpVersion")
    implementation("com.squareup.moshi:moshi:${squareupMoshiVersion}")
    implementation("com.squareup.moshi:moshi-kotlin:${squareupMoshiVersion}")

    implementation("org.apache.httpcomponents.core5:httpcore5")
    implementation("org.apache.httpcomponents.client5:httpclient5")

    implementation("org.openapitools:openapi-generator-gradle-plugin:$openApiGeneratorPluginVersion")

    // Testing
    testImplementation("com.ritense.valtimo:case")
    testImplementation("com.ritense.valtimo:local-resource")
    testImplementation("com.ritense.valtimo:process-document")
    testImplementation("com.ritense.valtimo:test-utils-common")

    testImplementation( "org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa")

    testImplementation("org.mockito:mockito-core")
    testImplementation("org.hamcrest:hamcrest-library")
    testImplementation("org.mockito.kotlin:mockito-kotlin")

    testImplementation("org.postgresql:postgresql")

    testImplementation("com.squareup.okhttp3:mockwebserver:$okhttpVersion")
    testImplementation("com.squareup.okhttp3:okhttp:$okhttpVersion")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}

apply(from = "gradle/publishing.gradle")
