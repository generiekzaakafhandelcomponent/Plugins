import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

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
            kotlinOptions {
                jvmTarget = "17"
                javaParameters = true
            }
        }

        dependencies {
            implementation(platform("com.ritense.valtimo:valtimo-dependency-versions:$valtimoVersion"))
        }

        allOpen {
            annotation("com.ritense.valtimo.contract.annotation.AllOpen")
        }

        java {
            withSourcesJar()
            withJavadocJar()
        }

        dockerCompose {
            useDockerComposeV2 = true
        }

        tasks.test {
            useJUnitPlatform {
                excludeTags ("integration")
            }
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
}
println("Configuring has finished")
