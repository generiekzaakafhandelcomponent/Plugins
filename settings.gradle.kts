rootProject.name = "Plugins"
include(
    "backend",
    "backend:app",
    "backend:valtimo-ocr",
    "backend:externe-klanttaak",
    "backend:freemarker",
    "backend:haal-centraal",
    "backend:haal-centraal-auth",
    "backend:mTLS-SSLContext",
    "backend:notify-nl",
    "backend:object-management",
    "backend:openklant",
    "backend:publictask",
    "backend:rotterdam-oracle-ebs",
    "backend:slack",
    "backend:smtpmail",
    "backend:spotler",
    "backend:suwinet",
    "backend:valtimo-s2t",
    "backend:xential",
    "backend:valtimo-llm",
    "backend:kvk-handelsregister",
    "frontend",
)

// Background info https://github.com/gradle/gradle/issues/1697
pluginManagement {
    val ideaExt: String by settings
    val springBootVersion: String by settings
    val springDependencyManagementVersion: String by settings
    val kotlinVersion: String by settings
    val dockerComposePluginVersion: String by settings
    val lalakiCentralVersion: String by settings
    val ktlintVersion: String by settings

    plugins {
        // Idea
        idea
        id("org.jetbrains.gradle.plugin.idea-ext") version ideaExt

        // Spring
        id("org.springframework.boot") version springBootVersion
        id("io.spring.dependency-management") version springDependencyManagementVersion

        // Kotlin
        kotlin("jvm") version kotlinVersion
        kotlin("plugin.spring") version kotlinVersion
        kotlin("plugin.jpa") version kotlinVersion
        kotlin("plugin.allopen") version kotlinVersion

        // Other
        id("com.avast.gradle.docker-compose") version dockerComposePluginVersion
        id("cn.lalaki.central") version lalakiCentralVersion

        // Checkstyle
        id("org.jlleitschuh.gradle.ktlint") version ktlintVersion
    }
}
