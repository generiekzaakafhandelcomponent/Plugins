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
    setProjectName("kvk-handelsregister")
    isRequiredBy(project.tasks.integrationTesting)
    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}


dependencies {
    implementation("com.ritense.valtimo:contract")
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:value-resolver")
    implementation("com.ritense.valtimo:document")

    implementation("org.springframework.boot:spring-boot-starter-webflux")

    implementation("io.github.oshai:kotlin-logging-jvm:7.0.3")
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("com.fasterxml.jackson.core:jackson-annotations")
    implementation("com.fasterxml.jackson.core:jackson-core")

    // Apache deps
    implementation("org.apache.httpcomponents.client5:httpclient5:5.4")
    implementation("org.apache.httpcomponents:httpcore:4.4.15")

    implementation("com.auth0:java-jwt:4.4.0")

    // Testing
    testImplementation("com.fasterxml.jackson.core:jackson-databind:2.14.2")
    testImplementation("com.fasterxml.jackson.core:jackson-annotations:2.14.2")
    testImplementation("com.fasterxml.jackson.core:jackson-core:2.14.2")
    testImplementation("org.junit.jupiter:junit-jupiter-migrationsupport:5.9.1")
    testImplementation("org.assertj:assertj-core")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.hamcrest:hamcrest-library")
    testImplementation("com.jayway.jsonpath:json-path:2.7.0")
    testImplementation("org.mockito.kotlin:mockito-kotlin:4.1.0")

    testImplementation("com.squareup.okhttp3:mockwebserver:4.10.0")
    testImplementation("com.squareup.okhttp3:okhttp:4.10.0")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")

}

//apply(from = "gradle/publishing.gradle")
