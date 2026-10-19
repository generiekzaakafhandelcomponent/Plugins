val mockkVersion: String by project

dockerCompose {
    setProjectName("openklant")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    compileOnly("com.ritense.valtimo:core")
    compileOnly("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:valtimo-gzac-dependencies")
    compileOnly("org.springframework:spring-webflux")
    implementation("io.projectreactor.netty:reactor-netty-core")
    implementation("io.projectreactor.netty:reactor-netty-http")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")

    compileOnly("io.github.microutils:kotlin-logging")
    testImplementation("com.ritense.valtimo:core")
    testImplementation("com.ritense.valtimo:plugin-valtimo")
    testImplementation("org.springframework:spring-webflux")
    testImplementation("io.github.microutils:kotlin-logging")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.mockk:mockk:$mockkVersion")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test")
}

apply(from = "gradle/publishing.gradle")
