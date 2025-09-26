@file:Suppress("UNCHECKED_CAST")

import org.gradle.nativeplatform.platform.internal.DefaultNativePlatform
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.run.BootRun
import java.util.Properties

plugins {
    war
    // Idea
    idea
    id("org.jetbrains.gradle.plugin.idea-ext")

    // Spring
    id("org.springframework.boot")
    id("io.spring.dependency-management")

    // Kotlin
    kotlin("jvm")
    kotlin("plugin.spring")
    kotlin("plugin.jpa")
    kotlin("plugin.allopen")

    // Checkstyle
    id("org.jlleitschuh.gradle.ktlint") version "13.1.0"
    id("com.diffplug.spotless") version "8.0.0"

    // Other
    id("com.avast.gradle.docker-compose")
}

java.sourceCompatibility = JavaVersion.VERSION_17
java.targetCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
    maven { url = uri("https://s01.oss.sonatype.org/content/repositories/releases/") }
    maven { url = uri("https://s01.oss.sonatype.org/content/repositories/snapshots/") }
}

val valtimoVersion: String by project
val postgresqlDriverVersion: String by project
val nettyResolverDnsNativeMacOsVersion: String by project
val mockitoKotlinVersion: String by project
val camundaBpmAssertVersion: String by project

dependencies {
    implementation(platform("com.ritense.valtimo:valtimo-dependency-versions:$valtimoVersion"))

    implementation("com.ritense.valtimo:valtimo-dependencies")

    // implementation("com.ritense.valtimo:process-link-url:$valtimoVersion")
    implementation("com.ritense.valtimo:local-document-generation")
    implementation("com.ritense.valtimo:local-resource")
    implementation("com.ritense.valtimo:local-mail")
    implementation("com.ritense.valtimo:milestones")
    implementation("com.ritense.valtimo:object-management")
    implementation("com.ritense.valtimo:objecten-api-authentication")
    implementation("com.ritense.valtimo:objecten-api")
    implementation("com.ritense.valtimo:objecttypen-api")
    implementation("com.ritense.valtimo:openzaak")
    implementation("com.ritense.valtimo:zaken-api")
    implementation("com.ritense.valtimo:plugin:${valtimoVersion}")

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")

    implementation("org.postgresql:postgresql:$postgresqlDriverVersion")

    if (System.getProperty("os.arch") == "aarch64") {
        runtimeOnly("io.netty:netty-resolver-dns-native-macos:$nettyResolverDnsNativeMacOsVersion:osx-aarch_64")
    }

    // Kotlin logger
    implementation("io.github.microutils:kotlin-logging")

    // Testing
    testImplementation("com.ritense.valtimo:test-utils-common")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.camunda.bpm.assert:camunda-bpm-assert:$camundaBpmAssertVersion")
    testImplementation("org.camunda.bpm.extension:camunda-bpm-junit5:1.1.0")
    testImplementation("org.camunda.bpm.extension:camunda-bpm-assert:1.2")
    testImplementation("org.camunda.bpm.extension:camunda-bpm-assert-scenario:1.1.1")
    testImplementation("org.camunda.bpm.extension.mockito:camunda-bpm-mockito:5.16.0")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoKotlinVersion")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

dockerCompose {
    setProjectName("valtimo-docker-compose")
    useDockerComposeV2 = true
    useComposeFiles.add("${buildDir.absolutePath}/docker/extract/valtimo-docker-compose-v-12/docker-compose.yaml")
    stopContainers = false
    removeContainers = false
    removeVolumes = false
    if (DefaultNativePlatform.getCurrentOperatingSystem().isMacOsX) {
        executable = "/usr/local/bin/docker-compose"
        dockerExecutable = "/usr/local/bin/docker"
    }
}

ktlint {
    version.set("1.4.1")
}