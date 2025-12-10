# OIP Klanttaak plugin

For handling User tasks created by Valtimo GZAC via the Open Inwonder Platform (OIP).

## Capabilities

This plugin is intended to be used within the ZGW landscape and work with objecttypes/objects that are based on the
specification . 

The plugin supports two actions:

1. Delegate User task to OIP
2. Handle to OIP delegated User task

# Requirements

Before you can use the OIP Klantaak Plugin, you need to:

- Configure:
  - An Objecttype definition in the Objecttype API representing the payload of the task.
  - A subscription to the Open Notificaties API for updates on the Objects of the Objecttype.

# Dependencies

- [Objecten & Objectypen API](https://objects-and-objecttypes-api.readthedocs.io)
- [Open Notificaties](https://open-notificaties.readthedocs.io/)
- [Open Formulieren](https://open-forms.readthedocs.io/)

## Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:oip-klanttaak:0.0.1")
}
```

The most recent version can be found [here](https://mvnrepository.com/artifact/com.ritense.valtimoplugins/oip-klanttaak).

## Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/oip-klanttaak": "0.0.1"
  }
}
```

The most recent version can be found [here](https://www.npmjs.com/package/@valtimo-plugins/oip-klanttaak?activeTab=versions).

In order to use the plugin in the frontend, the following must be added to your `app.module.ts`:

```typescript
import {
    OipKlanttaakPluginModule, oipKlanttaakPluginSpecification
} from '@valtimo-plugins/oip-klanttaak';

@NgModule({
    imports: [
        OipKlanttaakPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                oipKlanttaakPluginSpecification,
            ]
        }
    ]
})
```
