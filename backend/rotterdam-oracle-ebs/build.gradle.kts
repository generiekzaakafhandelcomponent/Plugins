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

plugins {
    id("org.openapi.generator") version "7.12.0"
}

val camundaMockitoVersion: String by project
val kotlinLoggingVersion: String by project
val mockitoKotlinVersion: String by project
val okhttpVersion: String by project

dockerCompose {
    setProjectName("rotterdam-oracle-ebs")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    compileOnly("com.ritense.valtimo:core")
    compileOnly("com.ritense.valtimo:contract")
    compileOnly("com.ritense.valtimo:plugin-valtimo")
    compileOnly("com.ritense.valtimo:value-resolver")

    implementation(project(":backend:mTLS-SSLContext"))

    // Spring core web functionality
    compileOnly("org.springframework:spring-web")

    // Logging
    implementation("io.github.oshai:kotlin-logging-jvm:$kotlinLoggingVersion")

    // Jackson FasterXML
    compileOnly("com.fasterxml.jackson.module:jackson-module-kotlin")

    // Apache HTTP Client
    implementation("org.apache.httpcomponents.core5:httpcore5")
    implementation("org.apache.httpcomponents.client5:httpclient5")

    // Testing
    testImplementation("com.ritense.valtimo:core")
    testImplementation("com.ritense.valtimo:contract")
    testImplementation("com.ritense.valtimo:plugin-valtimo")
    testImplementation("com.ritense.valtimo:value-resolver")
    testImplementation("org.springframework:spring-web")
    testImplementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
//    testImplementation("org.camunda.bpm:camunda-bpm-junit5:7.21.0")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoKotlinVersion")
    testImplementation("org.camunda.community.mockito:camunda-platform-7-mockito:$camundaMockitoVersion")
    testImplementation("com.squareup.okhttp3:mockwebserver:$okhttpVersion")
}

apply(from = "gradle/publishing.gradle")

openApiGenerate {
    generatorName = "kotlin"
    inputSpec = "$rootDir/backend/rotterdam-oracle-ebs/src/main/resources/opvoeren_api_journaalpost_verkoopfactuur.yaml"
    outputDir = "${getLayout().buildDirectory.get()}/generated"
    packageName = "com.rotterdam.esb.opvoeren"
    generateApiDocumentation = false
    generateApiTests = false
    generateModelDocumentation = false
    generateModelTests = false
    configOptions = mapOf(
        "library" to "jvm-spring-restclient",
        "serializationLibrary" to "jackson",
        "useSpringBoot3" to "true"
    )
}

sourceSets {
    main {
        java {
            srcDir("${getLayout().buildDirectory.get()}/generated/src/main")
        }
    }
}

tasks.named("compileKotlin") {
    dependsOn(
        "openApiGenerate",
    )
}

tasks.named("sourcesJar") {
    dependsOn(
        "openApiGenerate",
    )
}
