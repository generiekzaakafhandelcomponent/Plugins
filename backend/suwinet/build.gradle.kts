import io.mateo.cxf.codegen.wsdl2java.Wsdl2Java

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

plugins {
    // CFX
    id("io.mateo.cxf-codegen") version "2.4.0"
}

dockerCompose {
    setProjectName("suwinet")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

val kotlinLoggingVersion: String by project
val okhttpVersion: String by project
val apacheCxfVersion: String by project
val sumXmlWsVersion: String by project
val mockitoKotlinVersion: String by project

dependencies {
    implementation("com.ritense.valtimo:contract")
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:value-resolver")
    implementation("com.ritense.valtimo:case")

    implementation("org.springframework.boot:spring-boot-starter-webflux")

    implementation("io.github.oshai:kotlin-logging:$kotlinLoggingVersion")
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("com.fasterxml.jackson.core:jackson-annotations")
    implementation("com.fasterxml.jackson.core:jackson-core")

    // Apache deps
    implementation("org.apache.httpcomponents.client5:httpclient5")
    implementation("org.apache.httpcomponents:httpcore")

    // SOAP Libraries
    implementation("jakarta.xml.ws:jakarta.xml.ws-api")
    cxfCodegen("jakarta.xml.ws:jakarta.xml.ws-api")
    cxfCodegen("jakarta.annotation:jakarta.annotation-api")
    implementation("org.apache.cxf:cxf-rt-frontend-jaxws:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-rt-transports-http:$apacheCxfVersion")
    implementation("com.sun.xml.ws:jaxws-ri:$sumXmlWsVersion")
    implementation("org.apache.cxf:cxf-spring-boot-starter-jaxws:$apacheCxfVersion")

    // Testing
    testImplementation("com.fasterxml.jackson.core:jackson-databind")
    testImplementation("com.fasterxml.jackson.core:jackson-annotations")
    testImplementation("com.fasterxml.jackson.core:jackson-core")
    testImplementation("org.junit.jupiter:junit-jupiter-migrationsupport")
    testImplementation("org.assertj:assertj-core")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.hamcrest:hamcrest-library")
    testImplementation("com.jayway.jsonpath:json-path")
    testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoKotlinVersion")


    testImplementation("com.squareup.okhttp3:mockwebserver:$okhttpVersion")
    testImplementation("com.squareup.okhttp3:okhttp:$okhttpVersion")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")

}

apply(from = "gradle/publishing.gradle")


tasks.register<Wsdl2Java>("genBRPDossierPersoonGSD") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/BRPDossierPersoonGSD/v0200-b02/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf").get().asFile)
        markGenerated.set(true)
        packageNames.set(mutableListOf("com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
}

tasks.named("compileKotlin") {
    dependsOn(
        "genBRPDossierPersoonGSD",
    )
}
