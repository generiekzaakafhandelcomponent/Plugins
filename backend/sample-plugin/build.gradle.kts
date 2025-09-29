@file:Suppress("UNCHECKED_CAST")

dockerCompose {
    setProjectName("sample-plugin")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

val valtimoVersion: String = "12.16.1.RELEASE"
val postgresqlDriverVersion: String = "42.7.4"
val nettyResolverDnsNativeMacOsVersion: String = "4.1.105.Final"
val mockitoKotlinVersion: String = "5.4.0"
val camundaBpmAssertVersion: String = "15.0.0"

dependencies {
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:temporary-resource-storage")
    implementation("com.ritense.valtimo:value-resolver")

    implementation("org.springframework.boot:spring-boot-starter-webflux")

    implementation("io.github.oshai:kotlin-logging-jvm:7.0.3")

    // Testing
    testImplementation("com.ritense.valtimo:document")
    testImplementation("com.ritense.valtimo:local-resource")
    testImplementation("com.ritense.valtimo:process-document")
    testImplementation("com.ritense.valtimo:test-utils-common")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa")

    testImplementation("org.mockito:mockito-core")
    testImplementation("org.hamcrest:hamcrest-library")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.4.0")

    testImplementation("org.postgresql:postgresql")

    testImplementation("com.squareup.okhttp3:mockwebserver")
    testImplementation("com.squareup.okhttp3:okhttp")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}

apply(from = "gradle/publishing.gradle")