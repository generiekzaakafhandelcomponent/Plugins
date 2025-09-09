import io.mateo.cxf.codegen.wsdl2java.Wsdl2Java
import io.spring.gradle.dependencymanagement.org.apache.maven.model.Build

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

    // CXF Codegen
    cxfCodegen("jakarta.xml.ws:jakarta.xml.ws-api:4.0.2")
    cxfCodegen("jakarta.annotation:jakarta.annotation-api:3.0.0")
    cxfCodegen("jakarta.xml.bind:jakarta.xml.bind-api:4.0.2")
    cxfCodegen("jakarta.jws:jakarta.jws-api:3.0.0")

    // Apache CXF and Jakarta dependencies
    implementation("org.apache.cxf:cxf-rt-frontend-jaxws:4.0.7")
    implementation("org.apache.cxf:cxf-rt-transports-http:4.0.7")
    implementation("com.sun.xml.ws:jaxws-ri:4.0.3")
    implementation("org.glassfish.jaxb:jaxb-runtime:4.0.5")

    implementation("org.apache.cxf:cxf-tools-common:4.0.7")
    implementation("org.apache.cxf:cxf-tools-wsdlto-core:4.0.7")
    implementation("org.apache.cxf:cxf-tools-wsdlto-databinding-jaxb:4.0.7")
    implementation("org.apache.cxf:cxf-tools-wsdlto-frontend-jaxws:4.0.7")

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

apply(from = "gradle/publishing.gradle")


tasks.register<Wsdl2Java>("genBRPDossierPersoonGSD") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/BRPDossierPersoonGSD/v0200-b02/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/genBRPDossierPersoonGSD").get().asFile)
        markGenerated.set(true)
        packageNames.set(mutableListOf("com.ritense.valtimoplugins.dkd.brpdossierpersoongsd"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
}

tasks.register<Wsdl2Java>("genDUODossierPersoonGSD") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/DUODossierPersoonGSD/v0300-b01/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/genDUODossierPersoonGSD").get().asFile)
        markGenerated.set(true)
        packageNames.set(listOf("com.ritense.valtimoplugins.dkd.duodossierpersoongsd"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.register<Wsdl2Java>("genDUODossierStudiefinancieringGSD") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/DUODossierStudiefinancieringGSD/v0200-b01/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/DUODossierStudiefinancieringGSD").get().asFile)
        markGenerated.set(true)
        packageNames.set(listOf("com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.register<Wsdl2Java>("genKadasterDossierGSD") {
    toolOptions {
        wsdl ="src/main/resources/soap/suwinet/Diensten/KadasterDossierGSD/v0300-b02/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/genKadasterDossierGSD").get().asFile)
        markGenerated.set(true)
        packageNames.set(listOf("com.ritense.valtimo.implementation.dkd.KadasterInfo"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.register<Wsdl2Java>("genRDWDossierGSD") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/RDWDossierGSD/v0200-b02/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/genRDWDossierGSD").get().asFile)
        markGenerated.set(true)
        packageNames.set(listOf("com.ritense.valtimoplugins.dkd.rdwdossier"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.register<Wsdl2Java>("genSVBDossierPersoonGSD") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/SVBDossierPersoonGSD/v0200-b01/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/genSVBDossierPersoonGSD").get().asFile)
        markGenerated.set(true)
        packageNames.set(listOf("com.ritense.valtimoplugins.dkd.svbdossierpersoongsd"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.register<Wsdl2Java>("genUWVDossierInkomstenGSD") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/UWVDossierInkomstenGSD/v0200-b02/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/genUWVDossierInkomstenGSD").get().asFile)
        markGenerated.set(true)
        packageNames.set(listOf("com.ritense.valtimo.implementation.dkd.UWVDossierInkomstenGSD"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.named("compileKotlin") {
    dependsOn(
        "genBRPDossierPersoonGSD",
        "genDUODossierPersoonGSD",
        "genDUODossierStudiefinancieringGSD",
        "genKadasterDossierGSD",
        "genRDWDossierGSD",
        "genSVBDossierPersoonGSD",
        "genUWVDossierInkomstenGSD",
    )
}
