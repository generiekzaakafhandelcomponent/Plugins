import java.util.Properties

extra["pluginProperties"] = Properties().apply {
    val f = File(projectDir, "plugin.properties")
    if (f.exists()) {
        f.inputStream().use {
            load(it)
        }
    }
}
