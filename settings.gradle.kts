rootProject.name = "Plugins"
include(
    "backend",
    "backend:app",
    "backend:alfresco-authentication",
    "backend:amsterdam-email-api",
    "backend:berkelybridge-textgenerator",
    "backend:freemarker",
    "backend:publictask",
    "backend:slack",
    "backend:smtpmail",
    "backend:spotler",
    "backend:suwinet",
    "frontend",
)

// Background info https://github.com/gradle/gradle/issues/1697
pluginManagement {
    val ideaExt: String by settings
    val springBootVersion: String by settings
    val springDependencyManagementVersion: String by settings
    val kotlinVersion: String by settings
    val ktlintVersion: String by settings
    val spotlessVersion: String by settings
    val dockerComposePluginVersion: String by settings

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
    }
}