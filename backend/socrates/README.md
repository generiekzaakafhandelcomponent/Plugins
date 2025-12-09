# Socrates plugin

Add tasks to Socrates system.
## Capabilities

This Socrates plugin has one action:

- POST task in Socrates system


# Requirements

Before you can use the Socrates Plugin, you need to:

# Dependencies

## Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:socrates:1.0.0")
}
```

The most recent version can be found [here](https://mvnrepository.com/artifact/com.ritense.valtimoplugins/socrates).

## Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/socrates": "1.0.0"
  }
}
```

The most recent version can be found [here](https://www.npmjs.com/package/@valtimo-plugins/slack?activeTab=versions).

In order to use the plugin in the frontend, the following must be added to your `app.module.ts`:

```typescript
import {
    socratesPluginModule, socratesPluginSpecification
} from '@valtimo-plugins/socrates';

@NgModule({
    imports: [
        socratesPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                socratesPluginSpecification,
            ]
        }
    ]
})
```
