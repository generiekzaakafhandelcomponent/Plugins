# SMTP mail Plugin

<!-- TOC -->
* [SMTP mail Plugin](#smtp-mail-plugin)
  * [Description](#description)
    * [Requirements](#requirements)
  * [Usage](#usage)
    * [Plugin configuration](#plugin-configuration)
    * [Plugin action: Send Mail](#plugin-action-send-mail)
      * [Addressing multiple recipients](#addressing-multiple-recipients)
    * [Prepare mail contents](#prepare-mail-contents)
      * [Mail template plugin](#mail-template-plugin)
      * [Text template plugin](#text-template-plugin)
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
Send mail through SMTP with the SMTP mail plugin. 

> Tip: The SMTP mail Plugin can be used together with the [Mail Template Plugin](../freemarker/README.md), see [prepare step](#prepare-email-with-the-mail-template-plugin)

### Requirements
Before you can use the SMTP mail Plugin, you need to:
- Locate or set up an SMTP Server
- Install the plugin dependencies. See [Dependencies](#dependencies)
## Usage
Plugin actions can be linked to BPMN service tasks. Using the plugin comes down to two steps:
### Plugin configuration
Create a configuration instance for the plugin and configure the following properties:
* `configurationTitle` - Title of the plugin instance
* `Host` - SMTP Host URL 
* `Port` - port of the SMTP Mail (default is 465)
* `Username` - The email address or account name used to send mail.
* `Password` - The authentication password
* `Protocol` - smtp
* `debug` - optional, off by default. Only enable while troubleshooting: it writes the complete SMTP dialogue -
  envelope recipients (including Bcc), headers and the message body - to the application log at `DEBUG` level for
  logger `com.ritense.valtimoplugins.smtpmail.client.SmtpMailClient`. The SMTP password is never traced.
* `Authentication` - set to true when authentication is needed
* `STARTTLS` - set connection to SMTP Host using TLS
Create process link between a BPMN service task and the desired plugin action.

### Plugin action: Send Mail
`send-mail` Send the email using an SMTP Host

* `sender`- Sender Email address
* `fromName` - Sender Email name
* `recipients` - TO email addresses, see [addressing multiple recipients](#addressing-multiple-recipients)
* `cc` - CC email addresses (optional)
* `bcc` - BCC email addresses (optional)
* `subject` - Subject of email
* `contentId` - The content ID of the contents of the mail, see [options](#prepare-mail-contents) to generate content
* `attachmentIds` - List with IDs of files in local storage are added as attachment of the mail (optional)

Before sending, the plugin rejects a CR or LF character in `sender`, `fromName`, `recipients`, `cc`, `bcc` and
`subject` to prevent mail header injection, and it rejects malformed addresses. A host without a dot - a local mail
catcher or an internal hostname such as `dev@localhost` or `test@mailhog` - is a valid address.

The mail is always sent through the plugin configuration that is linked to the service task.

#### Addressing multiple recipients
`recipients`, `cc` and `bcc` each accept either a list of addresses or a single value, so the property can point at a
form field or process variable of either shape:

```json
"recipients": "doc:recipients"
```

Every value is split on commas and semicolons, which lets a single text field carry more than one recipient. A
semicolon is not an RFC 5322 separator but is accepted because that is the separator Outlook uses. Surrounding
whitespace and empty entries are discarded, and each resulting address is validated individually. All of the following
therefore address the same two recipients:

```text
["jan@example.com", "piet@example.com"]
"jan@example.com,piet@example.com"
"jan@example.com; piet@example.com"
["jan@example.com", "piet@example.com;"]
```

`recipients` must hold at least one address once this normalisation is done; `cc` and `bcc` may end up empty. The
`sender` is a single address and is never split.

Note that splitting means one value can address more than one mailbox: a property that resolves to a single string the
submitter controls, such as a form field, can expand to any number of recipients. Only point `recipients`, `cc` and
`bcc` at values the process itself determines, or at a field whose addresses you are willing to deliver to.

### Prepare mail contents
There are 2 plugins available to generate the contents of an email:

#### Mail template plugin
Generate Mail contents with plugin action `Generate Mail File` with a case mail template
* `mailTemplateKey` - A Case Mail template  
* `processVariableName` - process variable name of the generated mail contents

#### Text template plugin
Generate Mail File with plugin action `Generate Text Filee`, select a case text template
* `textTemplateKey` - Text Template
* `processVariableName` - process variable name of the generated mail contents
 
## Development
### Source code
The source code is split up into 2 modules:
1. [Frontend](../../frontend/projects/valtimo-plugins/smtpmail)
2. [Backend](.)

### Dependencies
#### Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:smtpmail:$smtpMailVersion")
}
```

The most recent version can be found [here](https://mvnrepository.com/artifact/com.ritense.valtimoplugins/smtpmail).

#### Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/smtpmail": "<latest version>"
  }
}
```

The most recent version can be found [here](https://www.npmjs.com/package/@valtimo-plugins/smtpmail?activeTab=versions).

In order to use the plugin in the frontend, the following must be added to your `app.module.ts`:

```typescript
import {
    SmtpMailPluginModule, smtpmailPluginSpecification
} from '@valtimo-plugins/smtpmail';

@NgModule({
    imports: [
        SmtpMailPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                smtpmailPluginSpecification,
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
      [smtpMailPlugin](src/main/kotlin/com/ritense/valtimoplugins/smtpmail/plugin/SmtpMailPlugin.kt).
    * at the frontend:
      [smtpMailPluginModule](../../frontend/projects/valtimo-plugins/smtpmail/src/lib/smtpmail.plugin.module.ts).
2. Update the README if necessary.
3. Increase the plugin versions:
    * in the backend: [plugin.properties](plugin.properties).
    * in the frontend: [package.json](../../frontend/projects/valtimo-plugins/smtpmail/package.json).

#### When adding a action:

1.  Make the required changes to the action in the plugin
    * at the backend:
      [SmtpMailPlugin](src/main/kotlin/com/ritense/valtimoplugins/smtpmail/plugin/SmtpMailPlugin.kt).
    * at the frontend:
      [SmtpMailPluginModule](../../frontend/projects/valtimo-plugins/smtpmail/src/lib/smtpmail.plugin.module.ts).
2. Update the README if necessary.
3. Increase the plugin versions:
    * in the backend: [plugin.properties](plugin.properties).
    * in the frontend: [package.json](../../frontend/projects/valtimo-plugins/smtpmail/package.json).
