# Xential plugin

<!-- TOC -->
* [Xential plugin](#xential-plugin)
    * [Description](#description)
      * [included plugin actions:](#included-plugin-actions)
      * [included xential endpoints:](#included-xential-endpoints)
  * [usage](#usage)
    * [Plugin action: Toegamg tot Xential toetsen](#plugin-action-toegamg-tot-xential-toetsen)
    * [Plugin action: Prepare content](#plugin-action-prepare-content)
    * [Plugin action: Generate document](#plugin-action-generate-document)
    * [endpoint: /xential/document](#endpoint-xentialdocument)
    * [endpoint: /xential/sjablonen](#endpoint-xentialsjablonen)
  * [Running the example application](#running-the-example-application)
  * [Source code](#source-code)
<!-- TOC -->

### Description

This plugin is intended to be used for sending request to the Xential Service of the Municipality Rotterdam which is
available
via their Enterprise Service Bus (ESB) and provides generating PDF and WORD documents. The plugin supports access to the
Xential platform, and handle callback requests to store generated documents. Documents are generated with templates that
are maintained in Xential.

You can find more information about Xential [here](https://www.xential.com/documentcreatie)

#### included plugin actions:

- <b>validate-xential-toegang</b>
- <b>prepare-content</b>
- <b>generate-document</b>

#### included xential endpoints:

- <b>/xential/document</b>
- <b>/xential/sjablonen</b>

When the job is ready Xential sends a request via a callback url, this is the endpoint in Valtimo that receives the
content of the document. After this the content can be uploaded to the document API etc.
<BR/>

## usage

Plugin actions can be linked to BPMN service tasks. Using the plugin comes down to a few simple steps:

* Create a configuration instance for the plugin and configure the following properties:
    * `baseUrl` - The URL of Xential .
    * `mTlsSllContextConfigurationId` - The mTLS SSL Context configuration that should be used.
    * `applicationName` - Is the name for basic authentication at Xential.
    * `applicationPassword` - Is the password for basic authentication at Xential.
* Create process link between a BPMN service task and the desired plugin action.

### Plugin action: Toegamg tot Xential toetsen

`validate-xential-toegang` checks if the current user has access to Xential and the template folders. It will use the
username of the current user as 'gebruikersId' to access the xential API

* `toegangResultaatId` - process variable id to store the result of the test call to Xential
* `xentialGebruikersId` - process variable with the gebruikersId needed to get access to Xential
* `xentialDocumentProperties` - properties object that includes the UUID of the sjabloon (templates) folder the user
  needs to have access too

### Plugin action: Prepare content

`prepare-content` sets the properties for the process to send the request to generate the document.

* `fileFormat` - format can be <b>PDF</b> or <b>WORD</b>
* `documentFilename` - name of the document that will be generated once the document content has arrived. Note that the
  document is numbered to enable multiple generations of the same document
* `informationObjectType` - Information object type that is connected to the zaaktype in OpenZaak
* `eventMessageName` - Event thrown in BPMN when the document is received via the callback url
* `xentialDocumentPropertiesId` - name of the process variable of the properties object is stored
* `firstTemplateGroupId` - template id of top level folder in Xential
* `secondTemplateGroupId` - template id of the second level folder in Xential
* `thirdTemplateGroupId` - template id of the third level folder in Xential

### Plugin action: Generate document

`generate-content` sends the request to Xential with the content to generate a document. When not all content is present
to generate the document, Xential will send a link that opens a wizard to complete the request, otherwise it will start
a job to generate the document.

* `xentialDocumentProperties` - process variable with the properties object needed to generate a document
* `xentialData` - the data xml template that includes the data to be used in the template
* `xentialSjabloonId` - the UUID of the sjabloon (template) used to generate the document
* `xentialGebruikersId` - the gebruikersId to validate access to the xential service

### endpoint: /xential/document

`/xential/document` will receive the content of the document

* `taakapplicatie` - the name for basic authentication at Xential.
* `gebruiker` - the gebruikersId used in the request to grant access to the xential service
* `documentCreatieSessieId` - id used to find the processinstance id to htrow the message received event
* `formaat` - document format of the data retrieved
* `documentkenmerk` - not used
* `data` - the actual content of the generated document

### endpoint: /xential/sjablonen

`/xential/sjablonen` returns a list of folders and or templates (sjablonen) retrieved from Xential based on the folder
uuid. It enables navigation through the folder structure containing the templates, after which the
desired template can be selected to generate the document. templates are called <b>sjablonen</b>

* `gebruikersId` - the gebruikersId to validate access to the xential service
* `sjabloonGroupId` - the UUID of the sjabloon (template) folder used to generate the document, then not set it will
  request the root folder of xential

## Running the example application
1. See [app frontend](../../frontend/README.md)
2. See [app backend](../README.md)
## Source code

The source code is split up into 2 modules:

1. [Frontend](../../frontend/projects/valtimo-plugins/xential)
2. [Backend](.)
