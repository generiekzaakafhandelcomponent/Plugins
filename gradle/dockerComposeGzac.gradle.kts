import java.net.URL
import org.gradle.api.tasks.Copy

afterEvaluate {
    tasks.register("downloadGzacDockerCompose") {
        doFirst {
            val dockerDir = file("${buildDir}/docker")
            dockerDir.mkdirs()
            val dockerFile = file("${dockerDir}/gzac-docker-compose.zip")
            URL("https://codeload.github.com/generiekzaakafhandelcomponent/gzac-docker-compose/zip/refs/heads/main").openStream()
                .use { input ->
                    dockerFile.outputStream().use { output ->
                        input.copyTo(output)
                    }
                }
        }
    }

    tasks.register<Copy>("downloadAndUnzipGzacDockerCompose") {
        dependsOn("downloadGzacDockerCompose")
        from(zipTree("${buildDir}/docker/gzac-docker-compose.zip"))
        into(file("${buildDir}/docker/extract/"))
    }

    tasks.register("composeUpGzac") {
        group = "docker"
        dependsOn("downloadAndUnzipGzacDockerCompose", "composeUp")
        mustRunAfter("downloadAndUnzipGzacDockerCompose")
    }

    tasks.named("composeBuild") {
        dependsOn("downloadAndUnzipGzacDockerCompose")
    }

    tasks.named("composeUp") {
        dependsOn("downloadAndUnzipGzacDockerCompose")
    }
}
