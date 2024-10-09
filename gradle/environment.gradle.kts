fun configureEnvironment(task: ProcessForkOptions) {
    val f = File("${rootProject.projectDir}/.env.properties")
    if (f.isFile) {
        f.readLines().forEachIndexed { index, line ->
            if (line.isNotEmpty() && !line.startsWith("#")) {
                val pair = line.split("=", limit = 2)
                if (pair.size != 2) {
                    project.logger.error("Error in .env.properties on line ${index+1}: '$line'")
                }
                task.environment[pair[0]] = pair[1]
            }
        }
    }
}
extra["configureEnvironment"] = { task: ProcessForkOptions -> configureEnvironment(task) }
