dockerCompose {
    setProjectName("openklant")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:valtimo-gzac-dependencies")
    implementation("org.springframework:spring-webflux:6.1.14")
    implementation("io.projectreactor.netty:reactor-netty-core:1.1.20")
    implementation("io.projectreactor.netty:reactor-netty-http:1.1.20")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
    implementation("io.github.microutils:kotlin-logging:3.0.5")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.mockk:mockk:1.13.9")
}

apply(from = "gradle/publishing.gradle")