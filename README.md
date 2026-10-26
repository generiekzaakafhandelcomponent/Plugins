# Plugins

Plugins offers optional functionality to the GZAC platform. For installation and configuration tips, look [here](https://docs.valtimo.nl/features/plugins/configure-plugin)

## Deprecated: Http Client Authentication

The Http Client Authentication plugin in this repository (`backend/http-client-authentication`,
`frontend/projects/valtimo-plugins/http-client-authentication`, Maven `http-client-authentication-plugin`, npm
`@valtimo-plugins/http-client-authentication` 1.0.0) is deprecated and won't be released again. The plugin moved to
[generiekzaakafhandelcomponent/http-client-authentication-plugin](https://github.com/generiekzaakafhandelcomponent/http-client-authentication-plugin).

- Use `com.ritense.valtimoplugins:http-client-authentication` and `@valtimo-plugins/http-client-authentication` with an
  exact `-V12` version on Valtimo 12 (a caret range such as `^2.1.1-V12` also matches the Valtimo 13 releases).
- Remove `http-client-authentication-plugin` from the application first: both contain the same classes.
- The plugin key changed from `http-client-authentication-plugin` to `http-client-authentication`. From `2.2.0-V12` on,
  the plugin moves existing configurations to the new key when the application starts. Change the key in
  `*.pluginconfig.json` files as well, keeping their ids.
