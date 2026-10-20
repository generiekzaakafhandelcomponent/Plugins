# Slack plugin

For sending messages to Slack, and starting or continuing a process when a message is posted in a Slack channel.

## Capabilities

This Slack plugin has three actions:

1. Send message to Slack channel. Optionally as a reply in an existing thread (`threadTs`). The channel and thread
   of the posted message are stored in the process variables `slackChannel`, `slackMessageTs` and `slackThreadTs`.
2. Send message to Slack channel with attachment.
3. Receive message. Link this action to a message start event to start a case for every message posted in a channel,
   or to a receive task / intermediate message catch event to continue a case when a reply is posted in its thread.
   Messages are read by a scheduled poller and can be filtered on text, user, thread scope and bot origin.

### Receive message settings

| Property                         | Default          | Description                                      |
|----------------------------------|------------------|--------------------------------------------------|
| `valtimo.slack.polling-enabled`  | `true`           | Turns the poller off on this node.               |
| `valtimo.slack.poll-cron`        | `0 */5 * * * *`  | How often the linked channels are read.          |
| `valtimo.slack.retention-cron`   | `0 30 3 * * *`   | When old processed-message records are removed.  |
| `valtimo.slack.retention-days`   | `90`             | How long processed-message records are kept.     |

# Requirements

Before you can use the Slack Plugin, you need to:

- Create a Slack-app that will post the messages. A `@Valtimo messenger`
    - This app must have premissions `chat:write` and `files:write`
    - To receive messages, the app also needs `channels:history` (and `groups:history`, `im:history` or
      `mpim:history` for those conversation types)
- Add the `@Valtimo messenger` to the channel.

# Dependencies

## Backend

The following Gradle dependency can be added to your `build.gradle` file:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:slack:5.1.0")
}
```

The most recent version can be found [here](https://mvnrepository.com/artifact/com.ritense.valtimoplugins/slack).

## Frontend

The following dependency can be added to your `package.json` file:

```json
{
  "dependencies": {
    "@valtimo-plugins/slack": "5.1.0"
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
