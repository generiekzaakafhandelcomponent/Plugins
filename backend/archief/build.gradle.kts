dockerCompose {
    setProjectName("archief")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    implementation("com.ritense.valtimo:case")
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:contract")
    implementation("com.ritense.valtimo:process-document")
    implementation("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:notificaties-api")
    implementation("com.ritense.valtimo:zaken-api")

    implementation("io.github.oshai:kotlin-logging:7.0.3")
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.4.0")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.junit.jupiter:junit-jupiter")
}

apply(from = "gradle/publishing.gradle")
