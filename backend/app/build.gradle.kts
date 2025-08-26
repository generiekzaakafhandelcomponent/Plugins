val kotlinLoggingVersion: String by project
val nettyResolverDnsNativeMacOsVersion: String by project

dependencies {
    implementation(platform("com.ritense.valtimo:valtimo-dependency-versions"))

    implementation("com.ritense.valtimo:valtimo-dependencies")
    implementation("com.ritense.valtimo:valtimo-gzac-dependencies")
    implementation("com.ritense.valtimo:local-mail")

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.postgresql:postgresql")
    implementation("io.github.oshai:kotlin-logging:$kotlinLoggingVersion")


    if (System.getProperty("os.arch") == "aarch64") {
        runtimeOnly("io.netty:netty-resolver-dns-native-macos:$nettyResolverDnsNativeMacOsVersion:osx-aarch_64")
    }

    // Plugins
//    implementation(project(":backend:alfresco-authentication"))
//    implementation(project(":backend:amsterdam-email-api"))
//    implementation(project(":backend:berkelybridge-textgenerator"))
//    implementation(project(":backend:externe-klanttaak"))
    implementation(project(":backend:freemarker"))
//    implementation(project(":backend:kvk-handelsregister"))
    implementation(project(":backend:mTLS-SSLContext"))
//    implementation(project(":backend:notify-nl"))
//    implementation(project(":backend:object-management"))
//    implementation(project(":backend:publictask"))
    implementation(project(":backend:rotterdam-oracle-ebs"))
//    implementation(project(":backend:slack"))
//    implementation(project(":backend:haal-centraal"))
//    implementation(project(":backend:haal-centraal-auth"))
    implementation(project(":backend:smtpmail"))
//    implementation(project(":backend:spotler"))
//    implementation(project(":backend:suwinet"))
    implementation(project(":backend:xential"))
//    implementation(project(":backend:hugging-face"))
}

tasks.jar {
    enabled = false
}

apply(from = "../../gradle/environment.gradle.kts")
val configureEnvironment = extra["configureEnvironment"] as (task: ProcessForkOptions) -> Unit

apply(from = "../../gradle/dockerComposeGzac.gradle.kts")
dockerCompose {
    setProjectName("gzac-docker-compose")
    useComposeFiles.set(listOf("${buildDir}/docker/extract/gzac-docker-compose-main/docker-compose.yaml"))
    composeAdditionalArgs.set(listOf("--profile", "zgw"))
    stopContainers.set(false)
    removeContainers.set(false)
    removeVolumes.set(false)
}

tasks.bootRun {
    dependsOn("composeUpGzac")
    systemProperty("spring.profiles.include", "dev")
    val t = this
    doFirst {
        configureEnvironment(t)
    }
}
