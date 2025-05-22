## Rotterdam - Oracle E-Business Suite (EBS) Plugin

<!-- TOC -->
  * [Rotterdam - Oracle E-Business Suite (EBS) Plugin](#rotterdam---oracle-e-business-suite-ebs-plugin)
    * [Description](#description)
  * [Usage](#usage)
    * [Plugin action: Journaalpost Opvoeren](#plugin-action-journaalpost-opvoeren)
    * [Plugin action: Verkoopfactuur Opvoeren](#plugin-action-verkoopfactuur-opvoeren)
  * [Development](#development)
    * [Adding a new version](#adding-a-new-version)
      * [When adding a new version of an existing action:](#when-adding-a-new-version-of-an-existing-action)
      * [When adding a action:](#when-adding-a-action)
<!-- TOC -->

### Description

This plugin is intended to be used for communication with the Oracle E-Business Suite of the Municipality Rotterdam which is available 
via their Enterprise Service Bus (ESB) and provides handling of administration of financial transactions.

This plugin contains the logic to support the components in the module
[Rotterdam - Oracle EBS Plugin](../../frontend/projects/valtimo-plugins/rotterdam-oracle-ebs/README.md).

The plugin supports two actions:

1. Journaalpost Opvoeren
2. Verkoopfactuur Opvoeren

## Usage

Using the plugin comes down to a few simple steps:

* Create a configuration instance for the plugin and configure the following properties:
  * `baseUrl` - The URL of the ESB.
  * `mTlsSllContextConfigurationId` - The mTLS SSL Context configuration that should be used.
  * `authenticationEnabled` - Is mTLS SSL authentication applicable for the connection to the ESB.  
    NOTE: Disabling the mTLS SSL authentication should in practise only be done for development purposes.
* Create process link between a BPMN service task and the desired plugin action.

### Plugin action: Journaalpost Opvoeren

The `Journaalpost Opvoeren` plugin action expects the following properties which can be provided hard coded or via value resolvers (case:, doc: and pv:)

* pvResultVariable (string), the name of the process variable in which the result of the action will be stored.
* procesCode (string)
* referentieNummer (string)
* sleutel (string)
* boekdatumTijd (string, format: IOS-8601. example: `2007-12-03T10:15:30+01:00`)
* categorie (string)
* saldoSoort (one of: Budget, Reservering, Werkelijk) 
* omschrijving (optional)
* boekjaar (string, optional)
* boekperiode (string, optional)

Only provide one of the properties for the journaalpost lines via `regels` or `regelsViaResolver`.
* regels (list of)
  * grootboekSleutel (string)
  * boekingType (one of: Credit, Debit)
  * bedrag (string)
  * omschrijving (string, optional)
* regelsViaResolver (string)

The response of the plugin action is stored as an object in a process instance variable named according specified via 
the property `pvResultVariable` with the properties:

* isGeslaagd (string)
* melding (string)
* foutcode (string)
* foutmelding (string)

These values can be accessed by specifying `pv:[value of pvResultVariable].[property name]`

### Plugin action: Verkoopfactuur Opvoeren

The `Verkoopfactuur Opvoeren` plugin action expects the following properties which can be provided hard coded or via value resolvers (case:, doc: and pv:)

* pvResultVariable (string), the name of the process variable in which the result of the action will be stored.
* procesCode (string)
* referentieNummer (string)
* factuurKlasse (string)
* inkoopOrderReferentie (string)
* relatieType (one of: Natuurlijk persoon, Niet natuurlijk persoon)

Only provide one of the properties for the relationship type details via `natuurlijkPersoon` or `nietNatuurlijkPersoon`.
* natuurlijkPersoon (optional)
  * achternaam (string)
  * voornamen (string)
* nietNatuurlijkPersoon (optional)
  * statutaireNaam (string)

Only provide one of the properties for the journaalpost lines via `regels` or `regelsViaResolver`.
* regels
  * hoeveelheid (string)
  * tarief (string)
  * btwPercentage (string)
  * grootboekSleutel (string)
  * omschrijving (string)
* regelsViaResolver (string, optional) 

The response of the plugin action is stored as an object in a process instance variable named according specified via 
the property `pvResultVariable` with the properties:

* isGeslaagd (string)
* melding (string)
* factuurID (string)
* foutcode (string)
* foutmelding (string)

These values can be accessed by specifying `pv:[value of pvResultVariable].[property name]`

## Development

### Adding a new version

You might need to add a new version of an action should the contract change in the specification or a new action has to 
be added/supported.

#### When adding a new version of an existing action:

1. Make the required changes to the action in the plugin 
   [OracleEbsPlugin](src/main/kotlin/com/ritense/valtimoplugins/rotterdam/oracleebs/plugin/OracleEbsPlugin.kt)..
2. Update the README if necessary.
3. Increase the plugin version in the [plugin.properties](plugin.properties).

#### When adding a action:

1. Add the new action in the plugin
   [OracleEbsPlugin](src/main/kotlin/com/ritense/valtimoplugins/rotterdam/oracleebs/plugin/OracleEbsPlugin.kt).
2. Update the README if necessary.
3. Increase the plugin version in the [plugin.properties](plugin.properties).
