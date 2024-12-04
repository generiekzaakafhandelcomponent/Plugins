# Externe Klanttaak Plugin

<!-- TOC -->
* [Externe Klanttaak Plugin](#externe-klanttaak-plugin)
  * [Description](#description)
  * [Development](#development)
    * [Versioning](#versioning)
      * [Adding a new version](#adding-a-new-version)
        * [When adding a new version of an existing action:](#when-adding-a-new-version-of-an-existing-action)
        * [When adding a new action:](#when-adding-a-new-action)
  * [Wishlist](#wishlist)
<!-- TOC -->

## Description

This module contains interface components and logic for the
[Externe Klanttaak Plugin](../../../../backend/externe-klanttaak/README.md).
The module contains code that can be divided into the following:

* Plugin Specification  
  The plugin specification is in essence the 'definition' of the plugin.  
  It defines the id, logo, actions and translations of the plugin.


* Plugin Components  
  The components in this module mostly consist of Plugin Action Components and a single Plugin Configuration Component.

The plugin supports two actions:

1. Create Externe Klanttaak
2. Complete Externe Klanttaak

Both actions are versioned and what form they show to the user is dependent on the selected plugin configuration (when
creating a plugin action configuration) or an already existing prefilled configuration with the latter being leading.

## Development

### Versioning

Every plugin action needs to have versioning because the form components have to be based on the data structures in the
backend of the plugin that themselves are based on a
[public contract](https://dienstverleningsplatform.gitbook.io/platform-generieke-dienstverlening-public/patronen/taken/externe-klanttaak).
Some version may be reused if their functionality allows for it e.g. `complete-externe-klanttaak-v1.1.0` could be usable
with all patch versions, but also with upcoming minors depending on the changes required between versions.
The [models](./src/lib/models/config.ts) in the plugin root hold plugin interfaces and supported versions.

#### Adding a new version

You might need to add a new version of an action should the contract change in the backend or there is a need for a new
action.

##### When adding a new version of an existing action:

1. Expand the `ExterneKlanttaakVersion` in the plugin [models](./src/lib/models/config.ts) with the corresponding
   version of the contract from the backend.  
   **NB! This HAS TO match the semver version string returned from the backend**
2. Create your own contract and form component. Make sure your form contract implements the relevant action data
   interface for prefill to work e.g. The `create-externe-klanttaak-v1x1x0` form prefills and creates
   `CreateExterneKlanttaakV1x1x0Config` which implements the `CreateExterneKlanttaakConfigData` interface.
3. Modify the root action component template with a case for your added version.

##### When adding a new action:

1. Expand the `ExterneKlanttaakVersion` in the plugin [models](./src/lib/models/config.ts) with the corresponding
   version of the contract from the backend.  
   **NB! This HAS TO match the semver version string returned from the backend**
2. Add a new interface for the to be added action config contract.
3. Create a base action component. See existing action config components for inspiration.
4. Create a version contract and form component. Make sure your form contract implements the relevant action data
   interface for prefill to work e.g. The `create-externe-klanttaak-v1x1x0` form prefills and creates
   `CreateExterneKlanttaakV1x1x0Config` which implements the `CreateExterneKlanttaakConfigData` interface.
5. Modify the root action component template with a case for your added version.

## Wishlist

Future functionality wishlist:

* rendering versioned forms dynamically based on plugin/action version instead of switch-case in the base template of a plugin action