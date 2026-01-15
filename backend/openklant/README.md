# OpenKlant

## Omschrijving

De OpenKlant plug-in verzorgt:

- Plug-in acties:
    - Het opslaan van partij op basis van voor- en achternaam, e-mailadres, bsn en zaaknummer.
    - Het ophalen van klantcontacten
- Value resolver:
    - `klant:klantcontacten`
    - `klant:klantcontactenOrNull`
- Custom tabblad component:
    - Het tonen van klantcontacten

Het communiceert met een OpenKlant (v2) implementatie.

## Documentatie

### Plug-in properties:

* OpenKlant klantinteracties URL (_bv. https://openklant.gemeente.nl/klantinteracties/api/v1/_)

* OpenKlant Token

Een algemene beschrijving van het configureren van plug-ins vind je
hier:[https://docs.valtimo.nl/features/plugins#configuring-plugins](https://docs.valtimo.nl/features/plugins#configuring-plugins)

Voorbeeld `*.pluginconfig.json`:

```json   
{
  "id": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "title": "OpenKlant (Autodeployed)",
  "pluginDefinitionKey": "openklant",
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
  "activityId": "VersturenKlantcontact",
  "activityType": "bpmn:ServiceTask:start",
  "pluginConfigurationId": "b3c54f5e-a6b2-4b22-a87f-eebb113bc432",
  "pluginActionDefinitionKey": "send-klantcontact",
  "actionProperties": {
    "kanaal": "doc:/contactgegevens/kanaal",
    "onderwerp": "doc:/contactgegevens/onderwerp",
    "inhoud": "doc:/contactgegevens/inhoud",
    "vertrouwelijk": "doc:/contactgegevens/vertrouwelijk",
    "taal": "doc:/contactgegevens/taal",
    "plaatsgevondenOp": "doc:/contactgegevens/plaatsgevondenOp",
    "partijUuid": "doc:/persoonsgegevens/partijUuid",
    "voorletters": "doc:/persoonsgegevens/voorletters",
    "voornaam": "doc:/persoonsgegevens/voornaam",
    "voorvoegselAchternaam": "doc:/persoonsgegevens/voorvoegselAchternaam",
    "achternaam": "doc:/persoonsgegevens/achternaam"
  },
  "processLinkType": "plugin"
}
```

### Ophalen klantcontacten (actie):

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

### Ophalen klantcontacten (value resolver):

Benodigde configuratie in `.env.properties`:

```properties
AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_KLANTINTERACTIES_URL=https://openklant.gemeente.nl/klantinteracties/api/v1/  
AUTODEPLOYMENT_PLUGINCONFIG_OPENKLANT_AUTHORIZATION_TOKEN=
```

Tonen klantcontacten:

Benodigde dossier properties:

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

LET OP: het klantcontacten property moet bereikbaar zijn via `doc:/klantcontacten` om het tab te kunnen laten
werken.

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
                'klantcontact-tab': KlantcontactTabComponent, // voeg deze alleen toe als je het klantcontacten tab wilt gebruiken.
            }
        }
    ],
    //...
})
```

Zie [toevoegen van plugins](https://docs.valtimo.nl/features/plugins/plugins/custom-plugin-definition#adding-the-plugin-module-to-the-ngmodule)
en [toevoegen van case tabs](https://docs.valtimo.nl/features/case/for-developers/case-tabs)
in de Valtimo docs.