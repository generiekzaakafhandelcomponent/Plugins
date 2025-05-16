## Rotterdam - Oracle E-Business Suite (EBS) Plugin

<!-- TOC -->
  * [Rotterdam - Oracle E-Business Suite (EBS) Plugin](#rotterdam---oracle-e-business-suite-ebs-plugin)
  * [Description](#description)
  * [Development](#development)
    * [Versioning](#versioning)
      * [Adding a new version](#adding-a-new-version)
        * [When adding a new version of an existing action:](#when-adding-a-new-version-of-an-existing-action)
        * [When adding a new action:](#when-adding-a-new-action)
<!-- TOC -->

## Description

This module contains interface components and logic for the 
[Rotterdam - Oracle EBS Plugin](../../../../backend/rotterdam-oracle-ebs/README.md).
The module contains code that can be divided into the following:

* Plugin Specification  
  The plugin specification is in essence the 'definition' of the plugin.  
  It defines the id, logo, actions and translations of the plugin.


* Plugin Components  
  The components in this module mostly consist of Plugin Action Components and a single Plugin Configuration Component.

The plugin supports two actions:

1. Journaalpost opvoeren
2. Verkoopfactuur opvoeren

Both actions are versioned and what form they show to the user is dependent on the selected plugin configuration (when
creating a plugin action configuration) or an already existing prefilled configuration with the latter being leading.

## Development

### Versioning

Every plugin action needs to have versioning because the form components have to be based on the data structures in the
backend of the plugin.
Some version may be reused if their functionality allows for it e.g. `rotterdam-oracle-ebs-v1.1.0` could be usable
with all patch versions, but also with upcoming minors depending on the changes required between versions.
The [models](./src/lib/models/config.ts) in the plugin root hold plugin interfaces and supported versions.

#### Adding a new version

You might need to add a new version of an action should the contract change in the backend or there is a need for a new
action.

##### When adding a new version of an existing action:

1. Modify the contract interfaces in the plugin [models](./src/lib/models/config.ts) if necessary so it matches the 
   version of the data contract from the backend.  
2. Modify the form component if necessary. Make sure your form contract implements the relevant action data interface 
   for prefill to work.
3. Increase the plugin version in [package.json](package.json) and [plugin.properties](plugin.properties)

##### When adding a new action:

1. Add the required contract interfaces in the plugin [models](./src/lib/models/config.ts) so it matches the data contract from the backend.
2. Create the form component. Make sure your form contract implements the relevant action data interface for prefill to
   work.
3. Increase the plugin version in [package.json](package.json) and [plugin.properties](plugin.properties)
