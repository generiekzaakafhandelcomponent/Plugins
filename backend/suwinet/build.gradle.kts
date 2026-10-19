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

val apacheCxfVersion: String by project
val auth0JavaJwtVersion: String by project
val jakartaAnnotationApiVersion: String by project
val jakartaJwsApiVersion: String by project
val jakartaXmlBindApiVersion: String by project
val jakartaXmlWsApiVersion: String by project
val kotlinLoggingVersion: String by project
val mockitoKotlinVersion: String by project
val okhttpVersion: String by project
val sumXmlWsVersion: String by project

dockerCompose {
    setProjectName("suwinet")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    implementation(project(":backend:suwinet-auth"))

    compileOnly("com.ritense.valtimo:contract")
    compileOnly("com.ritense.valtimo:core")
    compileOnly("com.ritense.valtimo:plugin-valtimo")
    compileOnly("com.ritense.valtimo:value-resolver")
    compileOnly("com.ritense.valtimo:document")

    compileOnly("org.springframework.boot:spring-boot-starter-webflux")

    implementation("io.github.oshai:kotlin-logging-jvm:$kotlinLoggingVersion")
    compileOnly("com.fasterxml.jackson.core:jackson-databind")
    compileOnly("com.fasterxml.jackson.core:jackson-annotations")
    compileOnly("com.fasterxml.jackson.core:jackson-core")

    // Apache deps
    implementation("org.apache.httpcomponents.client5:httpclient5")
    implementation("org.apache.httpcomponents:httpcore")

    implementation("com.auth0:java-jwt:$auth0JavaJwtVersion")

    // CXF Codegen
    cxfCodegen("jakarta.xml.ws:jakarta.xml.ws-api:$jakartaXmlWsApiVersion")
    cxfCodegen("jakarta.annotation:jakarta.annotation-api:$jakartaAnnotationApiVersion")
    cxfCodegen("jakarta.xml.bind:jakarta.xml.bind-api:$jakartaXmlBindApiVersion")
    cxfCodegen("jakarta.jws:jakarta.jws-api:$jakartaJwsApiVersion")
    cxfCodegen("org.apache.cxf:cxf-rt-ws-addr:$apacheCxfVersion")

    // Apache CXF and Jakarta dependencies
    implementation("org.apache.cxf:cxf-rt-frontend-jaxws:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-rt-transports-http:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-rt-features-logging:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-rt-bindings-soap:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-rt-ws-addr:$apacheCxfVersion")
    implementation("com.sun.xml.ws:jaxws-ri:$sumXmlWsVersion")
    implementation("org.glassfish.jaxb:jaxb-runtime")

    implementation("org.apache.cxf:cxf-tools-common:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-tools-wsdlto-core:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-tools-wsdlto-databinding-jaxb:$apacheCxfVersion")
    implementation("org.apache.cxf:cxf-tools-wsdlto-frontend-jaxws:$apacheCxfVersion")

    // Testing
    testImplementation("com.ritense.valtimo:contract")
    testImplementation("com.ritense.valtimo:core")
    testImplementation("com.ritense.valtimo:plugin-valtimo")
    testImplementation("com.ritense.valtimo:value-resolver")
    testImplementation("com.ritense.valtimo:document")
    testImplementation("org.springframework.boot:spring-boot-starter-webflux")
    testImplementation("com.fasterxml.jackson.core:jackson-databind")
    testImplementation("com.fasterxml.jackson.core:jackson-annotations")
    testImplementation("com.fasterxml.jackson.core:jackson-core")
    testImplementation("org.junit.jupiter:junit-jupiter-migrationsupport")
    testImplementation("org.assertj:assertj-core")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.mockito:mockito-junit-jupiter")
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
        packageNames.set(listOf("com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd"))
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
        packageNames.set(listOf("com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD"))
        extendedSoapHeaders.set(true)
        autoNameResolution.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.register<Wsdl2Java>("genBijstandsregelingen") {
    toolOptions {
        wsdl = "src/main/resources/soap/suwinet/Diensten/Bijstandsregelingen/v0500-b04/Impl/BKWI.wsdl"
        outputDir.set(layout.buildDirectory.dir("generated-sources/cxf/genBijstandsregelingen").get().asFile)
        markGenerated.set(true)
        packageNames.set(listOf("com.ritense.valtimoplugins.dkd.Bijstandsregelingen"))
        extendedSoapHeaders.set(true)
    }
    allJvmArgs = listOf("-Duser.language=en", "-Duser.country=NL")
    doFirst {
        classpath = configurations["runtimeClasspath"]
    }
}

tasks.named("compileKotlin") {
    dependsOn(
        "genBijstandsregelingen",
        "genBRPDossierPersoonGSD",
        "genDUODossierPersoonGSD",
        "genDUODossierStudiefinancieringGSD",
        "genKadasterDossierGSD",
        "genRDWDossierGSD",
        "genSVBDossierPersoonGSD",
        "genUWVDossierInkomstenGSD",
    )
}
