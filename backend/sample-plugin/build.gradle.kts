dockerCompose {
    setProjectName("sample-plugin")
    isRequiredBy(project.tasks.integrationTesting)

    tasks.integrationTesting {
        useComposeFiles.addAll("$rootDir/docker-resources/docker-compose-base-test.yml", "docker-compose-override.yml")
    }
}

dependencies {
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:plugin-valtimo")
}

apply(from = "gradle/publishing.gradle")