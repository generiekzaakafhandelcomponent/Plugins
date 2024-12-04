# Externe klanttaak library

Contains the following plugin(s):

## Externe klanttaak Plugin

For handling external user tasks in the ZGW landscape.

### Description

This plugin is intended to be used within the ZGW landscape and work with object that are based on the
[Externe Klanttaak](https://dienstverleningsplatform.gitbook.io/platform-generieke-dienstverlening-public/patronen/taken/externe-klanttaak)
specification. The plugin is internally versioned (the plugin framework doesn't support versioning) and does very little
on its own. Versions of the Externe Klanttaak handle their own creation and completion (or any future) logic.

The plugin supports two actions:

1. Create Externe Klanttaak
2. Complete Externe Klanttaak

### Development

##### Adding a new version

You might need to add a new version of an action should the contract change in the specification or a customized object
structure is necessary.

###### When adding a new version of an existing action:

1. Implement the IExterneKlanttaak interface if you have any domain changes in the new version and add it as a deducible
to the interface class.
2. Create a new ExterneKlanttaakVersion implementation either based on an existing older version or with your own logic
that can create your domain implementation.
3. Make your newly added ExterneKlanttaakVersion into a bean within the
[ExterneKlanttaakVersionsConfiguration](./src/main/kotlin/com/ritense/externeklanttaak/autoconfiguration/ExterneKlanttaakVersionsConfiguration.kt)