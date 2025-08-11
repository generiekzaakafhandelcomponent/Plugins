# Xential plugin

<!-- TOC -->
* [Xential plugin](#xential-plugin)
  * [Description](#description)
    * [Sjablonen](#sjablonen)
    * [Document creation requests](#document-creation-requests)
    * [Receiving document content](#receiving-document-content)
    * [Included plugin actions:](#included-plugin-actions)
    * [Included xential endpoints:](#included-xential-endpoints)
  * [Usage](#usage)
    * [Plugin action: Toegamg tot Xential toetsen](#plugin-action-toegamg-tot-xential-toetsen)
    * [Plugin action: Prepare content](#plugin-action-prepare-content)
    * [Plugin action: Generate document](#plugin-action-generate-document)
    * [Endpoint: /xential/document](#endpoint-xentialdocument)
    * [Endpoint: /xential/sjablonen](#endpoint-xentialsjablonen)
  * [Running the example application](#running-the-example-application)
  * [Development](#development)
    * [Source code](#source-code)
    * [Dependencies](#dependencies)
      * [Backend](#backend)
      * [Frontend](#frontend)
    * [Adding a new version](#adding-a-new-version)
      * [When adding a new version of an existing action:](#when-adding-a-new-version-of-an-existing-action)
      * [When adding a action:](#when-adding-a-action)
<!-- TOC -->

## Description

This plugin is designed to send requests to the Xential Service of the **Municipality of Rotterdam**, which is accessible via their **Enterprise Service Bus** (ESB). The service enables the generation of **PDF** and **Word documents**.

The plugin provides:
* Access to the sjablonen repository in Xential, structured as a hierarchical tree map
* Sending requests to generate documents in the Xential platform
* Support for handling callback requests to store generated documents

### Sjablonen
* Documents are created using sjablonen (templates) managed within Xential.
Before sending a request to generate a document, the user selects the appropriate sjabloon.
* Sjablonen are stored in Xential’s hierarchical tree structure.
Access to specific sjabloon folders depends on the user’s permissions. The username of the frontend user is passed to Xential as the gebruikersId.

### Document creation requests
* The document generation process is asynchronous.
  When a request is made and all required variables for the template are included, a job is created in Xential to generate the document.
* If any required variables are missing, a URL to a wizard in Xential is returned, allowing the end user to complete the request manually.

### Receiving document content
Once the job is complete, Xential sends a callback request to a specific URL—namely the /xential/document endpoint in Valtimo.
At this endpoint, the generated document content is decoded and saved as a temporary file resource in the requested format (e.g. PDF or Word).
As a final step, the document can be uploaded to the Document API.

You can find more information about Xential [here](https://www.xential.com/documentcreatie)

### Included plugin actions:

- <b>validate-xential-toegang</b>
- <b>prepare-content</b>
- <b>generate-document</b>

### Included xential endpoints:

- <b>/xential/document</b>
- <b>/xential/sjablonen</b>

## Usage

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

### Endpoint: /xential/document

`/xential/document` will receive the content of the document

* `taakapplicatie` - the name for basic authentication at Xential.
* `gebruiker` - the gebruikersId used in the request to grant access to the xential service
* `documentCreatieSessieId` - id used to find the processinstance id to htrow the message received event
* `formaat` - document format of the data retrieved
* `documentkenmerk` - not used
* `data` - the actual content of the generated document

### Endpoint: /xential/sjablonen

`/xential/sjablonen` returns a list of folders and or templates (sjablonen) retrieved from Xential based on the folder
uuid. It enables navigation through the folder structure containing the templates, after which the
desired template can be selected to generate the document. templates are called <b>sjablonen</b>

* `gebruikersId` - the gebruikersId to validate access to the xential service
* `sjabloonGroupId` - the UUID of the sjabloon (template) folder used to generate the document, then not set it will
  request the root folder of xential

## Running the example application
1. See [app frontend](../../frontend/README.md)
2. See [app backend](../README.md)

## Development
### Source code
The source code is split up into 2 modules:

1. [Frontend](../../frontend/projects/valtimo-plugins/xential)
2. [Backend](.)

### Dependencies

#### Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:xential:$xentialPluginVersion")
}
```

The most recent version can be found [here](https://mvnrepository.com/artifact/com.ritense.valtimoplugins/xential).

#### Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/xential": "<latest version>"
  }
}
```

The most recent version can be found [here](https://www.npmjs.com/package/@valtimo-plugins/xential?activeTab=versions).

In order to use the plugin in the frontend, the following must be added to your `app.module.ts`:

```typescript
import {
    XentialPluginModule, XentialPluginSpecification
} from '@valtimo-plugins/xential';

@NgModule({
    imports: [
        XentialPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                XentialPluginSpecification,
            ]
        }
    ]
})
```

### Adding a new version

You might need to add a new version of an action should the contract change in the specification or a new action has to
be added/supported.

#### When adding a new version of an existing action:

1. Make the required changes to the action in the plugin
   * at the backend:
      [XentialPlugin](src/main/kotlin/com/ritense/valtimoplugins/xential/plugin/XentialPlugin.kt).
   * at the frontend:
      [XentialPluginModule](../../frontend/projects/valtimo-plugins/xential/src/lib/xential.plugin.module.ts). 
2. Update the README if necessary.
3. Increase the plugin versions:
   * in the backend: [plugin.properties](plugin.properties).
   * in the frontend: [package.json](../../frontend/projects/valtimo-plugins/xential/package.json).

#### When adding a action:

1.  Make the required changes to the action in the plugin
     * at the backend:
     [XentialPlugin](src/main/kotlin/com/ritense/valtimoplugins/xential/plugin/XentialPlugin.kt).
     * at the frontend:
       [XentialPluginModule](../../frontend/projects/valtimo-plugins/xential/src/lib/xential.plugin.module.ts).
2. Update the README if necessary.
3. Increase the plugin versions:
   * in the backend: [plugin.properties](plugin.properties).
   * in the frontend: [package.json](../../frontend/projects/valtimo-plugins/xential/package.json).
