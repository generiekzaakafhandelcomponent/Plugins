# Archief Plugin

## Beschrijving

De Archief-plugin luistert naar notificaties van de Notificaties API en start een configureerbaar proces wanneer
een notificatie overeenkomt met het geconfigureerde kanaal en de filters. Hiermee kunnen documenten automatisch
gearchiveerd of verwijderd worden wanneer een archiveringsevent binnenkomt.

### Hoe werkt het?

1. De plugin abonneert zich op een of meer notificatiekanalen via de Notificaties API.
2. Wanneer een notificatie binnenkomt, controleert de plugin of het kanaal en de kenmerken van het event overeenkomen
   met de geconfigureerde filters.
3. Bij een match wordt het geconfigureerde proces gestart met de event-data als procesvariabelen.

### Plugin-acties

- **Systeemproces koppelen aan document** (`link-process-to-document`) — Koppelt het huidige systeemproces aan een
  document, zodat het proces zichtbaar is vanuit het dossier. Minimaal één van de twee parameters moet meegegeven worden.
- **Document verwijderen** (`delete-document`) — Verwijdert het document dat gekoppeld is aan het huidige proces.
  Geen configuratie nodig; gebruikt de process-document-koppeling.

### Meegeleverd BPMN-proces

De plugin bevat een kant-en-klaar systeemproces (`archief-event-afhandel-proces`) met twee servicetaken:

1. **Link process to document** — Koppelt het proces aan het document via de zaak-instance-URL uit de notificatie.
2. **Delete document** — Verwijdert het gekoppelde document.

## Gebruik

### Pluginconfiguratie

Maak een configuratie-instantie aan voor de plugin en configureer de volgende eigenschappen:

- `configurationTitle` — Naam van de plugin-instantie
- `notificatiesApiPluginConfiguration` — Verwijzing naar een Notificaties API-pluginconfiguratie
- `processToStart` — De procesdefinitiesleutel van het proces dat gestart wordt bij een matchende notificatie
- `archiefProperties` — Lijst van kanalen en filters:
    - `kanaal` — Het notificatiekanaal om op te luisteren (bijv. `zaakdossier`)
    - `filters` — Key-value-paren die moeten overeenkomen met de kenmerken van de notificatie

### Plugin-actie: Systeemproces koppelen aan document

Koppel deze actie aan een BPMN-servicetaak om het proces te linken aan een document. Minimaal één van de twee
parameters moet worden ingevuld:

- `zaakInstanceUrl` *(optioneel)* — De URL van de zaak-instance. Het document-ID wordt opgezocht via de
  zaak-instance-link. (bijv. `pv:resourceUrl`)
- `documentId` *(optioneel)* — Het UUID van het document. (bijv. `pv:documentId`)

### Plugin-actie: Document verwijderen

Koppel deze actie aan een BPMN-servicetaak om een document te verwijderen. Deze actie heeft geen parameters nodig;
het document wordt bepaald via de process-document-koppeling die eerder is aangemaakt door de
`link-process-to-document`-actie.

### Testen met HTTP-requests

Zie [archief-requests.http](scripts/archief-requests.http) voor voorbeeldrequests om de plugin te testen.

## Ontwikkeling

### Broncode

De broncode is opgesplitst in 2 modules:

1. [Backend](.)
2. [Frontend](../../frontend/projects/valtimo-plugins/archief)

### Afhankelijkheden

#### Backend

De volgende Gradle-dependency kan worden toegevoegd aan je `build.gradle`-bestand:

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:archief:$archiefVersion")
}
```

#### Frontend

De volgende dependency kan worden toegevoegd aan je `package.json`-bestand:

```json
{
    "dependencies": {
        "@valtimo-plugins/archief": "<versie>"
    }
}
```

Om de plugin in de frontend te gebruiken, moet het volgende worden toegevoegd aan je `app.module.ts`:

```typescript
import {
    ArchiefPluginModule, archiefPluginSpecification
} from '@valtimo-plugins/archief';

@NgModule({
    imports: [
        ArchiefPluginModule,
    ],
    providers: [
        {
            provide: PLUGINS_TOKEN,
            useValue: [
                archiefPluginSpecification,
            ]
        }
    ]
})
```

### Een nieuwe versie toevoegen

1. Maak de benodigde wijzigingen in de plugin:
    - Backend: [ArchiefPlugin](src/main/kotlin/com/ritense/valtimoplugins/archief/ArchiefPlugin.kt)
    - Frontend: [ArchiefPluginModule](../../frontend/projects/valtimo-plugins/archief/src/lib/archief-plugin.module.ts)
2. Werk deze README bij indien nodig.
3. Verhoog de pluginversies:
    - Backend: [plugin.properties](plugin.properties)
    - Frontend: [package.json](../../frontend/projects/valtimo-plugins/archief/package.json)
    - Frontend: [package.json](../../frontend/projects/valtimo-plugins/archief/plugin.properties)
