# Freemarker library

Contains two plugins which both use Freemarker.

## Mail Template Plugin

For creating HTML mail templates with Freemarker.

## Text Template Plugin

For creating text templates with Freemarker. These text templates can be used in a value-resolver. For example:
`template:my-template`.

https://github.com/user-attachments/assets/3b27631d-bbda-406e-b6b7-f6e5be21f9b9

# Dependencies

In order to use the plugins, the module needs to be added as a dependency. The
following can be added to your project, depending on whether Maven or Gradle is used:

##### Backend
The samples below assume the [valtimo-dependency-versions](valtimo-dependency-versions.md) module is used.
If not, please specify the artifact version as well.

#### Maven dependency:
```xml
<dependencies>
    <dependency>
        <groupId>com.ritense.valtimoplugins</groupId>
        <artifactId>freemarker</artifactId>
        <version>6.0.0</version>
    </dependency>
</dependencies>
```

#### Gradle dependency:
```kotlin
dependencies {
  implementation("com.ritense.valtimoplugins:freemarker:6.0.0")
}
```

### Frontend

```json
{
    "dependencies": {
        "@valtimo-plugins/freemarker": "<valtimo_frontend_version>"
    }
}
```

In order to use the plugins in the frontend, the following must be added to your `app.module.ts`:

```typescript
import {
    MailTemplatePluginModule, mailTemplatePluginSpecification, // remove this line if you don't need the mail-template plugin
    TextTemplatePluginModule, textTemplatePluginSpecification // remove this line if you don't need the text-template plugin
} from '@valtimo-plugins/freemarker';

@NgModule({
    imports: [
        MailTemplatePluginModule,
        TextTemplatePluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                mailTemplatePluginSpecification,
                textTemplatePluginSpecification,
            ]
        }
    ]
})
```
