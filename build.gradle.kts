import groovy.json.JsonSlurper
import java.time.Instant
import java.util.Properties
import org.jetbrains.kotlin.com.google.common.io.Files
import org.jetbrains.kotlin.com.google.gson.GsonBuilder
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar
import kotlin.io.path.Path

val valtimoVersion: String by project
val pf4jVersion: String by project
val pf4jSpringVersion: String by project

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
    kotlin("kapt")

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

val fatjarExcludes = file("fatjar-excludes.txt").readText().split("\n").toSet()

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
        apply(plugin = "org.jetbrains.kotlin.kapt")
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

        kapt {
            correctErrorTypes = true
        }

        dependencies {
            implementation(platform("com.ritense.valtimo:valtimo-dependency-versions:$valtimoVersion"))
            implementation("cn.lalaki.central:central:1.2.5")

            compileOnly("org.pf4j:pf4j:$pf4jVersion")
            implementation("org.pf4j:pf4j-spring:$pf4jSpringVersion") {
                exclude(group = "org.pf4j", module = "pf4j")
            }
            kapt("org.pf4j:pf4j:$pf4jVersion")
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
                excludeTags("integration")
            }
        }

        tasks.getByName<BootJar>("bootJar") {
            enabled = false
        }

        apply(from = "$rootDir/gradle/test.gradle.kts")

        val pluginPropertiesFile = file("plugin.properties")
        if (pluginPropertiesFile.exists()) {
            val pluginProperties = Properties()
            pluginProperties.load(pluginPropertiesFile.inputStream())
            extra["pluginProperties"] = pluginProperties
            val pluginArtifactId: String by pluginProperties
            val pluginVersion: String by pluginProperties

            val extensionId: String by pluginProperties
            val extensionName: String by pluginProperties
            val extensionLogo: String by pluginProperties
            val extensionDescription: String by pluginProperties
            val extensionClass: String by pluginProperties
            val extensionProvider: String by pluginProperties
            val extensionDependencies: String by pluginProperties
            val extensionRequires: String by pluginProperties
            val extensionLicense: String by pluginProperties

            tasks.jar {
                manifest {
                    attributes["Implementation-Title"] = pluginArtifactId
                    attributes["Implementation-Version"] = pluginVersion

                    attributes["Plugin-Id"] = extensionId
                    attributes["Plugin-Description"] = extensionDescription
                    attributes["Plugin-Class"] = extensionClass
                    attributes["Plugin-Version"] = pluginVersion
                    attributes["Plugin-Provider"] = extensionProvider
                    attributes["Plugin-Dependencies"] = extensionDependencies
                    attributes["Plugin-Requires"] = extensionRequires
                    attributes["Plugin-License"] = extensionLicense
                }
                duplicatesStrategy = DuplicatesStrategy.EXCLUDE
                val dependencies = configurations.runtimeClasspath.get().filter { dep ->
                    fatjarExcludes.none { ex ->
                        ex.split(':').all {
                            dep.absolutePath.contains(it) || dep.absolutePath.contains(it.replace('.', '/'))
                        }
                    }
                }
                println("Jar dependencies '$pluginArtifactId':")
                dependencies.forEach { dep -> println(dep.absolutePath) }
                println()
                from(dependencies.map { zipTree(it) })
            }

            tasks.register("buildExtensionRepository") {
                group = "build"
                description = "Build a repository folder containing the extension JAR file"
                dependsOn("jar")
                doFirst {
                    val jarFile = getFile(layout.buildDirectory.get().toString(), "libs").listFiles()!!
                        .first { it.name.endsWith(".jar") }
                    val newJarFile = getFile(rootDir.absolutePath, "repository", "$extensionId-$pluginVersion.jar")
                    Files.copy(jarFile, newJarFile)
                    createRepository(
                        extensionId = extensionId,
                        extensionVersion = pluginVersion,
                        extensionName = extensionName,
                        extensionLogo = extensionLogo,
                        extensionDescription = extensionDescription,
                        extensionProvider = extensionProvider,
                        extensionsJsonFolder = getFile(rootDir.absolutePath, "repository").absolutePath,
                        jarFolder = null
                    )
                }
            }

            tasks.register("publishLocalExtension") {
                group = "publication"
                description = "Publish this extension to your local machine"
                dependsOn("buildExtensionRepository")
                doFirst {
                    createRepository(
                        extensionId = extensionId,
                        extensionVersion = pluginVersion,
                        extensionName = extensionName,
                        extensionLogo = extensionLogo,
                        extensionDescription = extensionDescription,
                        extensionProvider = extensionProvider,
                        extensionsJsonFolder = getFile(System.getProperty("user.home"), ".valtimo_extensions")
                            .absolutePath,
                        jarFolder = getFile(rootDir.absolutePath, "repository").absolutePath
                    )
                }
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

tasks.register<Exec>("bundleFrontend") {
    group = "npm"
    description = "npm run build"
    workingDir = File("frontend")
    commandLine = listOf("npm", "run", "libs-webpack-all")
}

tasks.register("clearLocalExtensionCache") {
    group = "publication"
    description = "Clear all extensions that where published to your local machine"
    doFirst {
        getFile(System.getProperty("user.home"), ".valtimo_extensions").deleteRecursively()
        getFile(rootDir.absolutePath, "repository").deleteRecursively()
    }
}

fun createRepository(
    extensionId: String,
    extensionVersion: String,
    extensionName: String,
    extensionLogo: String,
    extensionDescription: String,
    extensionProvider: String,
    extensionsJsonFolder: String,
    jarFolder: String?
) {
    val extensionsFile = getFile(extensionsJsonFolder, "extensions.json").createFile("[]")
    val extensionsJson = JsonSlurper().parseText(extensionsFile.readText()) as MutableList<MutableMap<String, Any>>
    val extensionJson = extensionsJson.firstOrAdd(mutableMapOf()) { it["id"] == extensionId }
    extensionJson["id"] = extensionId
    extensionJson["name"] = extensionName
    extensionJson["logo"] = extensionLogo
    extensionJson["description"] = extensionDescription
    extensionJson["provider"] = extensionProvider
    val releases = extensionJson.getOrPut("releases") { mutableListOf<Any>() } as MutableList<MutableMap<String, Any>>
    val release = releases.firstOrAdd(mutableMapOf()) { it["version"] == extensionVersion }
    release["version"] = extensionVersion
    release["date"] = Instant.now().toString()
    release["url"] = if (jarFolder != null) {
        getFile(jarFolder, "$extensionId-$extensionVersion.jar").absolutePath
    } else {
        "$extensionId-$extensionVersion.jar"
    }
    extensionsFile.write(GsonBuilder().setPrettyPrinting().create().toJson(extensionsJson).toString())
}

fun File.createFile(defaultContent: String): File {
    if (!exists()) {
        createNewFile()
        write(defaultContent)
    }
    return this
}

fun File.write(text: String): File {
    writer().use { it.write(text) }
    return this
}

fun getFile(vararg path: String): File {
    return if (path[path.size - 1].contains('.')) {
        file(Path(path[0], *path.copyOfRange(1, path.size - 1))).mkdirs()
        file(Path(path[0], *path.copyOfRange(1, path.size)))
    } else {
        file(Path(path[0], *path.copyOfRange(1, path.size))).also { it.mkdirs() }
    }
}

fun <V> MutableList<V>.firstOrAdd(value: V, predicate: (V) -> Boolean): V {
    val index = indexOfFirst(predicate)
    return if (index == -1) {
        add(value)
        value
    } else {
        get(index)
    }
}

println("Configuring has finished")
