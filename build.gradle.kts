import io.spring.gradle.dependencymanagement.org.codehaus.plexus.interpolation.os.Os.FAMILY_MAC
import org.apache.tools.ant.taskdefs.condition.Os
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

val valtimoVersion: String by project

plugins {
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

    // Other
    id("com.avast.gradle.docker-compose")
    id("cn.lalaki.central") version "1.2.5"
}

allprojects {
    repositories {
        mavenLocal()
        mavenCentral()
        maven { url = uri("https://s01.oss.sonatype.org/content/repositories/snapshots/") }
        maven { url = uri("https://repo.ritense.com/repository/maven-public/") }
        maven { url = uri("https://repo.ritense.com/repository/maven-snapshot/") }
    }
}

subprojects {
    println("Configuring ${project.path}")

    if (project.path.startsWith(":backend")) {

        tasks.withType<org.springframework.boot.gradle.tasks.run.BootRun> {
            mainClass.set("com.ritense.plugin.sandbox.PluginApplication")
        }
        apply(plugin = "java")
        apply(plugin = "org.springframework.boot")
        apply(plugin = "io.spring.dependency-management")

        apply(plugin = "idea")
        apply(plugin = "java-library")
        apply(plugin = "kotlin")
        apply(plugin = "kotlin-spring")
        apply(plugin = "kotlin-jpa")
        apply(plugin = "com.avast.gradle.docker-compose")
        apply(plugin = "maven-publish")

        java.sourceCompatibility = JavaVersion.VERSION_17
        java.targetCompatibility = JavaVersion.VERSION_17

        tasks.withType<KotlinCompile> {
            compilerOptions {
                jvmTarget = JvmTarget.JVM_17
                javaParameters = true
            }
        }

        dependencies {
            implementation(platform("com.ritense.valtimo:valtimo-dependency-versions:$valtimoVersion"))
            implementation("cn.lalaki.central:central:1.2.5")
        }

        allOpen {
            annotation("com.ritense.valtimo.contract.annotation.AllOpen")
        }

        java {
            withSourcesJar()
            withJavadocJar()
        }

        if (Os.isFamily(FAMILY_MAC)) {
            println("Configure docker compose for macOs")
            dockerCompose {
                projectNamePrefix = "example-"
                setProjectName("${rootProject.name}-${project.name}")
                executable = "/usr/local/bin/docker-compose"
                dockerExecutable = "/usr/local/bin/docker"
            }
        }

        tasks.test {
            useJUnitPlatform {
                excludeTags("integration")
            }
        }

        tasks.getByName<BootJar>("bootJar") {
            enabled = false
        }

        apply(from = "$rootDir/gradle/test.gradle.kts")
        apply(from = "$rootDir/gradle/plugin-properties.gradle.kts")
        val pluginProperties = extra["pluginProperties"] as Map<*, *>

        tasks.jar {
            enabled = true
            manifest {
                pluginProperties["pluginArtifactId"]?.let { attributes["Implementation-Title"] = it }
                pluginProperties["pluginVersion"]?.let { attributes["Implementation-Version"] = it }
            }
        }
    }
    if (project.path.startsWith(":backend") && project.name != "app" && project.name != "gradle" && project.name != "backend") {
        apply(from = "$rootDir/gradle/publishing.gradle")
    }
}

tasks.bootJar {
    enabled = false
}

println("Configuring has finished")
