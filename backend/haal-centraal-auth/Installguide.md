# Gids voor het Toevoegen van de bpr Plugin aan de Plugin Repository

## 1. Update Valtimo

Begin met het updaten van Valtimo naar de nieuwste versie.

## 2. Backend

### a. Modules aanmaken

- Maak twee nieuwe modules aan in de backend:
    - Eén module voor de plugin zelf
    - Eén module voor de dummy authenticatie

### b. Pluginbestanden toevoegen

- Voeg alle pluginbestanden toe van de `gzac-sd-zgw` backend en de dummy authenticatie.

### c. Buildconfiguratie bijwerken

- Koppel de nieuwe modules in de `build.gradle` en `settings.gradle` bestanden.
- Werk indien nodig de imports bij.

### d. Gradle herladen

- Herlaad de Gradle-configuratie (`resync`) en start de backend opnieuw op.

De backend is nu klaar voor gebruik.

## 3. Docker

- Voeg de `bewoning-mock` service toe aan het `docker-compose.yml` bestand.

## 4. Frontend

### a. Nieuwe library aanmaken

- Maak een nieuwe library aan in de frontend voor de plugin.

### b. Pluginbestanden toevoegen

- Voeg alle pluginbestanden toe van de `gzac-sd-zgw` frontend en de dummy authenticatie.

### c. Koppelen in Angular

- Koppel de bestanden in het `app.module.ts` bestand.

### d. NPM herstarten

- Volg de stappen in de README om het NPM-proces opnieuw uit te voeren.

De frontend is nu ook klaar voor gebruik.

## 5. Pluginconfiguratie

- Je kunt nu de plugins configureren:
    - **Dummy plugin**: heeft alleen een titel nodig, zodat de BRP-plugin deze kan gebruiken.
    - **BRP plugin**: gebruikt als base URL  
      `http://localhost:5010/haalcentraal/api/bewoning`.


Klaar! De plugins zijn nu succesvol geïntegreerd in de omgeving.
