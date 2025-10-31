# Docsys plugin

For generating PDF files using Docsys.

## Capabilities

This Docsys plugin has two actions:

1. /TODO
2. /TODO

# Requirements

Before you can use the Docsys Plugin, you need to:

/TODO

# Dependencies

## Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:docsys:1.0.0")
}
```

The most recent version can be found [here](https://mvnrepository.com/artifact/com.ritense.valtimoplugins/docsys).

## Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/docsys": "1.0.0"
  }
}
```

The most recent version can be found [here](https://www.npmjs.com/package/@valtimo-plugins/slack?activeTab=versions).

In order to use the plugin in the frontend, the following must be added to your `app.module.ts`:

```typescript
import {
    DocsysPluginModule, docsysPluginSpecification
} from '@valtimo-plugins/docsys';

@NgModule({
    imports: [
        DocsysPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                docsysPluginSpecification,
            ]
        }
    ]
})
```
