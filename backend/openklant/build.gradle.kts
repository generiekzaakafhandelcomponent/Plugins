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
    implementation("org.springframework:spring-webflux")
    implementation("io.projectreactor.netty:reactor-netty-core")
    implementation("io.projectreactor.netty:reactor-netty-http")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")

    implementation("io.github.microutils:kotlin-logging")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.mockk:mockk:1.14.9")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test")
}

apply(from = "gradle/publishing.gradle")
