# Slack plugin

For sending messages to Slack.

## Capabilities

This Slack plugin has two actions:

1. Send message to Slack channel.
2. Send message to Slack channel with attachment.

# Requirements

Before you can use the Slack Plugin, you need to:

- Create a Slack-app that will post the messages. A `@Valtimo messenger`
    - This app must have premissions `chat:write` and `files:write`
- Add the `@Valtimo messenger` to the channel.

# Dependencies

## Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:slack:5.0.0")
}
```

The most recent version can be found [here](https://mvnrepository.com/artifact/com.ritense.valtimoplugins/slack).

## Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/slack": "5.0.1"
  }
}
```

The most recent version can be found [here](https://www.npmjs.com/package/@valtimo-plugins/slack?activeTab=versions).

In order to use the plugin in the frontend, the following must be added to your `app.module.ts`:

```typescript
import {
    SlackPluginModule, slackPluginSpecification
} from '@valtimo-plugins/slack';

@NgModule({
    imports: [
        SlackPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                slackPluginSpecification,
            ]
        }
    ]
})
```
