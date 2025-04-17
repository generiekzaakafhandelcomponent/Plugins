## Rotterdam - Oracle E-Business Suite (EBS) Plugin

For handling administration of financial transactions to Oracle E-Business Suite of the Municipality Rotterdam.

### Description

This plugin support communication with the Oracle E-Business Suite of the Municipality Rotterdam which is available via their  Enterprise Service Bus (ESB).

The plugin supports two actions:

1. Journaalpost Opvoeren
2. Verkoopfactuur Opvoeren

### Usage

Using the plugin comes down to a few simple steps:

* Create a configuration instance for the plugin and configure the following properties:
    * `baseUrl` - The URL of the ESB.
    * `mTlsSllContextConfigurationId` - The mTLS SSL Context configuration that should be used.
    * `authenticationEnabled` - Is mTLS SSL authentication applicable for the connection to the ESB.
