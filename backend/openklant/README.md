# Open Klant

## Omschrijving

De Open Klant plug-in verzorgt:

- Plug-in acties:
    - Het opslaan van partij op basis van voor- en achternaam, e-mailadres, bsn en zaaknummer.
    - Het ophalen van klantcontacten
- Value resolver:
    - `klant:klantcontacten`
    - `klant:klantcontactenOrNull`
- Custom tabblad component:
    - Het tonen van klantcontacten

Het communiceert met een Open Klant (v2) implementatie.

## Documentatie

### Plug-in properties:

* Open Klant klantinteracties URL (_bv. https://openklant.gemeente.nl/klantinteracties/api/v1/_)

* Open Klant Token

Een algemene beschrijving van het configureren van plug-ins vind je
hier:[https://docs.valtimo.nl/features/plugins#configuring-plugins](https://docs.valtimo.nl/features/plugins#configuring-plugins)

Voorbeeld `*.pluginconfig.json`:

```json   
{
  "id": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "title": "Open Klant",
  "pluginDefinitionKey": "open-klant",
  "properties": {
    "klantinteractiesUrl": "${AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_KLANTINTERACTIES_URL}",
    "token": "${AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_AUTHORIZATION_TOKEN}"
  }
}   
```

Voorbeeld `.env.properties`:

```properties
AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_KLANTINTERACTIES_URL=https://openklant.gemeente.nl/klantinteracties/api/v1/
AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_AUTHORIZATION_TOKEN=AAAAAAAAAAAAAAAAAA
```

### Opslaan partij:

![opslaan partij configuratie](img/opslaan-contactinfo-in-openklant.png)

Voorbeeld `*.processlink.json`:

```json
{
  "activityId": "Activity_OpslaanPartij",
  "activityType": "bpmn:ServiceTask:start",
  "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "pluginActionDefinitionKey": "store-contactinfo",
  "actionProperties": {
    "bsn": "doc:/persoonsgegevens/bsn",
    "firstName": "doc:/persoonsgegevens/voornaam",
    "inFix": "doc:/persoonsgegevens/tussenvoegsel",
    "lastName": "doc:/persoonsgegevens/achternaam",
    "emailAddress": "doc:/contactgegevens/emailadres",
    "caseNumber": "zaak:identificatie"
  },
  "processLinkType": "plugin"
}
```

### Versturen van klantcontact
![versturen klantcontact](img/versturen-klantcontact.png)

Voorbeeld `*.processlink.json`
```json
{
  "activityId": "verstuurKlantcontact",
  "activityType": "bpmn:ServiceTask:start",
  "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "pluginActionDefinitionKey": "register-klantcontact",
  "actionProperties": {
    "hasBetrokkene": true,
    "kanaal": "doc:/klantcontact/kanaal",
    "onderwerp": "doc:/klantcontact/onderwerp",
    "inhoud": "doc:/klantcontact/inhoud",
    "vertrouwelijk": "doc:/klantcontact/vertrouwelijk",
    "taal": "doc:/klantcontact/taal",
    "plaatsgevondenOp": "doc:/klantcontact/plaatsgevondenOp",
    "partijUuid": "doc:/klantcontact/betrokkene/partijUuid",
    "voorletters": "doc:/klantcontact/betrokkene/voorletters",
    "voornaam": "doc:/klantcontact/betrokkene/voornaam",
    "voorvoegselAchternaam": "doc:/klantcontact/betrokkene/voorvoegselAchternaam",
    "achternaam": "doc:/klantcontact/betrokkene/achternaam"
  },
  "processLinkType": "plugin"
}
```

zonder betrokkene:
```json
{
  "activityId": "verstuurKlantcontactZonderBetrokkene",
  "activityType": "bpmn:ServiceTask:start",
  "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "pluginActionDefinitionKey": "register-klantcontact",
  "actionProperties": {
    "hasBetrokkene": false,
    "kanaal": "doc:/klantcontact/kanaal",
    "onderwerp": "doc:/klantcontact/onderwerp",
    "inhoud": "doc:/klantcontact/inhoud",
    "vertrouwelijk": "doc:/klantcontact/vertrouwelijk",
    "taal": "doc:/klantcontact/taal",
    "plaatsgevondenOp": "doc:/klantcontact/plaatsgevondenOp"
  },
  "processLinkType": "plugin"
}
```

### Ophalen klantcontacten (contactgeschiedenis) via Open-Zaaknummer (UUID): plugin-actie:

![ophalen klantcontacten configuratie](img/fetch-contactmomenten.png)

Voorbeeld `*.processlink.json`:

```json
{
  "activityId": "Activity_OphalenKlantcontacten",
  "activityType": "bpmn:ServiceTask:start",
  "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049",
  "pluginActionDefinitionKey": "get-contact-moments-by-case",
  "actionProperties": {
    "objectUuid": "zaak:uuid",
    "resultPvName": "klantcontacten"
  },
  "processLinkType": "plugin"
}
```

### Ophalen klantcontacten via Open-Zaaknummer (UUID): value resolver:

Benodigde configuratie in `.env.properties`:

```properties
AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_KLANTINTERACTIES_URL=https://openklant.gemeente.nl/klantinteracties/api/v1/  
AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_AUTHORIZATION_TOKEN=
```

Tonen klantcontacten:

Benodigde dossier-properties:

```json
{
  ...
  "properties": {
    ...
    "klantcontacten": {
      "type": "array",
      "items": {
        "properties": {
          "plaatsgevondenOp": {
            "type": "string"
          },
          "indicatieContactGelukt": {
            "type": "string"
          }
        }
      },
      "default": []
    },
    ...
  }
```

LET OP: de klantcontacten property moet bereikbaar zijn via `doc:/klantcontacten` om het tab te kunnen laten
werken.


### Ophalen klantcontacten (contactgeschiedenis) via BSN: plugin-actie:

Vul in de process het pad de variabele in waar het BSN gevonden kan worden in onder `bsn`, en geef bij `resultPvName` aan onder welke procesvariabelenaam de lijst van contactmomenten (de volledige contactgeschiedenis voor dit BSN) weggeschreven kan worden. Zie ook het voorbeeldbestand, `bpmn/open-klant/contactgeschiedenis-ophalen-bsn.bpmn`, om een vollediger beeld te krijgen. 

Voorbeeld-`[...].processlink.json`-bestand:

```json
{
  "activityId": "Activity_HaalContactgeschiedenisOpTask",
  "activityType": "bpmn:ServiceTask:start",
  "id": "80ca9599-35bc-4220-b218-4500df2f2f91",
  "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "pluginActionDefinitionKey": "get-contact-moments-by-bsn",
  "actionProperties": {
      "bsn": "pv:bsn",
      "resultPvName": "contactgeschiedenis"
  },
  "processLinkType": "plugin"
}
```

### Frontend

In de frontend moet de volgende waarden toegevoegd worden:

```typescript
@NgModule({
    declarations: [AppComponent,],
    imports: [
        //...
        OpenKlantPluginModule,
    ],
    providers: [
        {
            provide: PLUGINS_TOKEN, useValue: [
                //...
                openKlantPluginSpecification,],
        },
        {
            provide: CASE_TAB_TOKEN,
            useValue: {
                "generieke-contactgeschiedenis": ContactHistoryTabComponent, // voeg deze alleen toe als je het contactgeschiedenistabblad wilt gebruiken.
            }
        }
    ],
    //...
})
```

Zie [toevoegen van plugins](https://docs.valtimo.nl/features/plugins/plugins/custom-plugin-definition#adding-the-plugin-module-to-the-ngmodule) en [toevoegen van case tabs](https://docs.valtimo.nl/features/case/for-developers/case-tabs) in de Valtimo docs.

#### Een custom theme gebruiken voor het Contactgeschiedenis tabblad

Per default wordt er in `contact-history-tab.component.scss` het thema van Carbon gebruikt. Als je jouw eigen override van dit thema wilt gebruiken, uncomment dan simpelweg de regel `@use '/my/carbon/theme/override`, en zorg dat de path naar jouw thema wijst. 

Het onderstaande codefragment is te vinden in `openklant/src/lib/tab/contact-history/components/contact-history-tab/contact-history-tab.component.spec.ts`:
```scss
@use '@carbon/styles/scss/themes';

// Optionally use your own, custom theme:
// @use '/my/carbon/theme/override';

// See: https://docs.valtimo.nl/customizing-valtimo/front-end-customization/customizing-carbon-theme
```