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

### Usage

Using the plugin comes down to a few simple steps:

* Create a configuration instance for the plugin and configure the following properties:
    * `pluginVersion` - the version of the contract that should be used by this plugin configuration instance.  
      This property tells the plugin which contract to use when invoking the plugin actions on this instance and must
      match one of the available ExterneKlanttaakVersion beans defined in
      the [ExterneKlanttaakVersionsConfiguration](./src/main/kotlin/com/ritense/externeklanttaak/autoconfiguration/ExterneKlanttaakVersionsConfiguration.kt).
    * `objectManagementConfigurationId` - an object management configuration that is compatible with the chosen
      version.  
      This is used for creating and handling changes on Externe Klanttaak objects in the Objecten API.
    * `notificatiesApiPluginConfiguration` - a notificaties api configuration that can be used to listen to Externe
      Klanttaak object updates.
    * `finalizerProcess` - the handling process that will be started when an Externe Klanttaak object should be handled
      and finalized by this plugin.  
      This allows the implementation to customize what happens during the finalization of an Externe Klanttaak.

#### Example

For example usage run the Plugins Example app in this repository or look at the relevant autodeployments in the
following path: `/backend/app/src/resources/config`. This example only includes version `1.1.1` of the Externe Klanttaak
contract.

##### Example Usage Instructions

* Create a new `Name Change` case
* Verify that an `Externe Klantaak V1.1.0` object has been created in objecten api (or within GZAC from the Object
  Management page)
* Modify above object with an answer from the user and set the status of the Externe Klanttaak to `afgerond`
* See changes being caught and processed by gzac shortly after
  * Case should reflect user input and modify both the process instance variable and json schema document values.

### Development

##### Adding a new version

You might need to add a new version of an action should the contract change in the specification or a customized object
structure is necessary.

###### When adding a new version of an existing action:

1. Implement the IExterneKlanttaak interface if you have any domain changes in the new version and add it as a deducible
   to the interface class.
2. Create a new ExterneKlanttaakVersion implementation either based on an existing older version or with your own logic
   that can create your domain implementation. Make sure the `version` property matches the semver of the Externe
   Klanttaak object specification version and is unique.
3. Make your newly added ExterneKlanttaakVersion into a bean within the
   [ExterneKlanttaakVersionsConfiguration](./src/main/kotlin/com/ritense/externeklanttaak/autoconfiguration/ExterneKlanttaakVersionsConfiguration.kt)

## Wishlist

Future functionality wishlist:

* replace IPluginAction and IPluginActionConfig type deduction with a type property to avoid possible future ambiguity
  between multiple version