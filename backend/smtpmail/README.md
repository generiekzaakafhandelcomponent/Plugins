# SMTP mail Plugin

Send mail through SMTP with the SMTP mail plugin.

> Tip: The SMTP mail Plugin can be used together with the [Mail Template Plugin](../freemarker/README.md)

# Requirements

Before you can use the SMTP mail Plugin, you need to:

- Locate or set up an SMTP Server
- Install the plugin dependencies. See the steps below

# Dependencies

## Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:smtpmail:1.0.2")
}
```

## Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/smtpmail": "1.0.2"
  }
}
```

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
