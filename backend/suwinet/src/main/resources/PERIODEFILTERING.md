# Periodefiltering – Functionele beschrijving

## Wat doet de periodefiltering?

De periodefiltering maakt het mogelijk om de gegevens die vanuit Suwinet worden opgehaald te
beperken tot een bepaalde tijdsperiode. Zonder filtering geeft Suwinet standaard de volledige
beschikbare historie terug (doorgaans ~24 maanden). Met de periodefiltering worden alleen die
records teruggegeven die **overlappen** met het opgegeven datumbereik.

De filtering wordt toegepast op twee plugin-acties:

| Plugin-actie             | Suwinet-service                          | Gefilterde gegevens                                        |
|--------------------------|------------------------------------------|------------------------------------------------------------|
| `get-uwv-inkomsten-info` | UWV – inkomsten van een persoon          | Inkomstenverhoudingen, inkomstenopgaven, inkomstenperioden |
| `get-svb-persoonsinfo`   | SVB – uitkeringsgegevens van een persoon | Uitkeringsverhoudingen, uitkeringsperioden                 |

---

## Configuratie

Beide acties hebben twee nieuwe optionele velden:

| Veld                   | Omschrijving                                   |
|------------------------|------------------------------------------------|
| **Startdatum periode** | De vroegste datum van het gewenste datumbereik |
| **Einddatum periode**  | De laatste datum van het gewenste datumbereik  |

### Gedrag bij lege velden

| Startdatum | Einddatum | Resultaat                                              |
|------------|-----------|--------------------------------------------------------|
| Leeg       | Leeg      | Geen filtering – alle records worden teruggegeven      |
| Leeg       | Ingevuld  | Geen filtering – einddatum wordt genegeerd             |
| Ingevuld   | Leeg      | Einddatum wordt automatisch de **huidige datum**       |
| Ingevuld   | Ingevuld  | Alleen records die overlappen met het opgegeven bereik |

---

## Datumnotaties

Beide datumvelden ondersteunen drie notaties:

### 1. Valtimo value resolver

Beide velden zijn reguliere procestaakvelden en ondersteunen daarom alle Valtimo value resolvers
(bijvoorbeeld `pv:`, `doc:` en `case:`). De resolver wordt door het platform opgelost vóórdat de
waarde bij de plugin-actie terechtkomt.

| Expressie             | Betekenis                                                 |
|-----------------------|-----------------------------------------------------------|
| `pv:aanvraagdatum`    | De procesvariabele `aanvraagdatum`                        |
| `doc:/aanvraag/datum` | Een waarde uit het documentmodel op pad `/aanvraag/datum` |
| `case:createdOn`      | Een systeemeigenschap van de zaak, zoals de aanmaakdatum  |

### 2. SpEL-expressie `{...}`

Gebruik Spring Expression Language voor dynamische datumberekeningen op basis van de huidige datum.
`localDateTimeNow` staat altijd voor de datum van vandaag.

> **Let op:** dit gebruikt enkele accolades `{...}`, **niet** `${...}`. Valtimo's `PluginService`
> probeert elke `${...}` in een plugin-actiewaarde vóór uitvoering op te lossen als een
> Spring/environment placeholder, en gooit een `IllegalStateException` wanneer dat niet lukt.
> Om die botsing te vermijden gebruikt deze SpEL-notatie daarom `{...}` in plaats van `${...}`.

| Expressie                               | Betekenis                       |
|------------------------------------------|----------------------------------|
| `{localDateTimeNow}`                    | Vandaag                         |
| `{localDateTimeNow.minusDays(14)}`      | 14 dagen geleden                |
| `{localDateTimeNow.minusWeeks(2)}`      | 2 weken geleden                 |
| `{localDateTimeNow.minusMonths(3)}`     | 3 maanden geleden               |
| `{localDateTimeNow.minusYears(1)}`      | 1 jaar geleden                  |
| `{localDateTimeNow.withDayOfMonth(1)}`  | Eerste dag van de huidige maand |

Procesvariabelen zijn ook beschikbaar als SpEL-variabele via `#naam`:

| Expressie                         | Betekenis                                           |
|-------------------------------------|-----------------------------------------------------|
| `{#aanvraagdatum}`                 | De procesvariabele `aanvraagdatum` direct als datum |
| `{#aanvraagdatum.minusMonths(1)}`  | Eén maand vóór de waarde van `aanvraagdatum`        |

### 3. Vaste ISO-datum

Een letterlijke datum in het formaat `yyyy-MM-dd`:

```
2024-01-01
2023-06-30
```

---

## Hoe werkt de filterregel?

Een record wordt **behouden** wanneer zijn datumbereik overlapt met de ingestelde periode:

```
beginDatumRecord ≤ einddatumPeriode
  EN
(eindDatumRecord is leeg/null  OF  eindDatumRecord ≥ startdatumPeriode)
```

Een record wordt **verwijderd** wanneer:
- Er geen begindatum aanwezig is (overlap kan niet worden vastgesteld)
- Het record eindigde vóór de startdatum van de periode
- Het record pas begon ná de einddatum van de periode

> **Open records (geen einddatum):** Een record zonder einddatum is nog actief. Zolang de
> begindatum vóór de einddatum van de periode ligt, overlapt het altijd en wordt het altijd
> behouden — ook als het record al twintig jaar oud is.

---

## Filtering per plugin-actie

### UWV – inkomsten info (`get-uwv-inkomsten-info`)

De filtering vindt plaats op **drie geneste niveaus**:

#### Niveau 1 — Inkomstenverhouding (IKV)

Een IKV stelt een dienstverband voor. Een IKV wordt verwijderd wanneer het gehele dienstverband
buiten de periode valt.

Datumvelden: `datBIkv` (begin) en `datEIkv` (einde)

| Situatie                                   | Voorbeeld                        | Resultaat met periode [2023-01-01, vandaag] |
|--------------------------------------------|----------------------------------|---------------------------------------------|
| Actief dienstverband, gestart vóór periode | begon 2011, geen einddatum       | **Behouden** – nog steeds actief            |
| Afgesloten dienstverband, vóór periode     | begon 2009, eindigde 2022-12-31  | **Verwijderd** – eindigde vóór startdatum   |
| Dienstverband gestart binnen periode       | begon 2023-06-01, geen einddatum | **Behouden** – valt binnen periode          |

#### Niveau 2 — Inkomstenopgave (maandelijkse loonopgaven)

Binnen elk behouden IKV wordt elke maandelijkse loonopgave apart gecontroleerd.

Datumvelden: `datBIko` (begin) en `datEIko` (einde)

Een loonopgave over december 2022 wordt verwijderd wanneer de startdatum van de periode
op 2023-01-01 of later ligt.

#### Niveau 3 — Inkomstenperiode (arbeidsvoorwaarden per dienstverband)

Binnen elk behouden IKV worden ook de afzonderlijke inkomstenperioden gefilterd.

Datumvelden: `datBIkp` (begin) en `datEIkp` (einde)

---

### SVB – persoonsinfo (`get-svb-persoonsinfo`)

De filtering vindt plaats op **twee geneste niveaus**:

#### Niveau 1 — Uitkeringsverhouding (UV)

Een UV stelt een uitkeringsrelatie voor (bijv. AOW, ANW of AIO). Een UV wordt verwijderd wanneer
de uitkeringsrelatie volledig buiten de periode valt.

Datumvelden: `datBUitkeringsverhouding` (begin) en `datEUitkeringsverhouding` (einde)

| Situatie                                 | Resultaat met periode [2023-01-01, vandaag] |
|------------------------------------------|---------------------------------------------|
| Lopende uitkering gestart vóór periode   | **Behouden** – nog steeds actief            |
| Afgesloten uitkering, eindigde vóór 2023 | **Verwijderd** – buiten de periode          |
| Uitkering gestart binnen periode         | **Behouden** – valt binnen periode          |

#### Niveau 2 — Uitkeringsperiode

Binnen elke behouden UV wordt elke afzonderlijke uitkeringsperiode apart gecontroleerd.

Datumvelden: `datBUitkeringsperiode` (begin) en `datEUitkeringsperiode` (einde)

---

## Voorbeelden

### Voorbeeld 1 – Inkomsten van de afgelopen 3 maanden (UWV)

```
Startdatum periode: {localDateTimeNow.minusMonths(3)}
Einddatum periode:  (leeg)
```

Resultaat: alleen loonopgaven die overlappen met de periode van 3 maanden geleden tot vandaag.

---

### Voorbeeld 2 – Vaste datumrange (UWV of SVB)

```
Startdatum periode: 2023-01-01
Einddatum periode:  2023-12-31
```

Resultaat: alleen records die binnen het kalenderjaar 2023 vallen.

---

### Voorbeeld 3 – Datum uit een procesvariabele (UWV of SVB)

Via een Valtimo value resolver:

```
Startdatum periode: pv:aanvraagdatum
Einddatum periode:  {localDateTimeNow}
```

Of via een SpEL-expressie:

```
Startdatum periode: {#aanvraagdatum}
Einddatum periode:  {localDateTimeNow}
```

Beide notaties leveren hetzelfde resultaat op: records die overlappen tussen de aanvraagdatum
(opgeslagen als procesvariabele) en vandaag.

---

### Voorbeeld 4 – Geen filtering

```
Startdatum periode: (leeg)
Einddatum periode:  (leeg)
```

Resultaat: alle records worden teruggegeven, identiek aan het gedrag vóór de introductie van de
periodefiltering. Bestaande BPMN-configuraties zonder deze velden blijven onveranderd werken.

---

## Achterwaartse compatibiliteit

Beide velden zijn optioneel. Bestaande plugin-configuraties zonder `startdatumPeriode` en
`einddatumPeriode` blijven volledig functioneren: er wordt geen filtering toegepast en het
resultaat is identiek aan het gedrag van vóór deze wijziging.
