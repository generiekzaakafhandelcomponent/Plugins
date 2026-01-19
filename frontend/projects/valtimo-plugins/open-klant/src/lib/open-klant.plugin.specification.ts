import { PluginSpecification } from "@valtimo/plugin";
import { OpenKlantPluginConfigurationComponent } from "./components/open-klant-plugin-configuration/open-klant-plugin-configuration.component";
import { StoreContactInfoComponent } from "./components/store-contact-info/store-contact-info.component";
import { OPEN_KLANT_PLUGIN_LOGO_BASE64 } from "./assets/open-klant-plugin-logo";
import { GetContactMomentsByCaseUuidComponent } from "./components/get-contact-moments-by-case-uuid/get-contact-moments-by-case-uuid.component";
import { GetContactMomentsByBsnComponent } from "./components/get-contact-moments-by-bsn/get-contact-moments-by-bsn.component";

const openKlantPluginSpecification: PluginSpecification = {
  pluginId: "open-klant",
  pluginConfigurationComponent: OpenKlantPluginConfigurationComponent,
  pluginLogoBase64: OPEN_KLANT_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    "get-contact-moments-by-bsn": GetContactMomentsByBsnComponent,
    "get-contact-moments-by-case-uuid": GetContactMomentsByCaseUuidComponent,
    "store-contact-info": StoreContactInfoComponent,
  },
  pluginTranslations: {
    nl: {
      title: "Open Klant",
      configurationTitle: "Configuratie van de Open Klant-plugin",
      description:
        "Een plugin voor het ophalen en versturen van Open Klant-gegevens.",
      configurationTitleTooltip:
        "In dit onderdeel configureer je de Open Klant-plugin om eenvoudig gegevens te kunnen verzenden en ophalen.",

      // Common
      resultPvName: "Naam van resultaat-procesvariabele",
      bsn: "BSN-variabele",
      bsnTooltip:
        "Pad van de variabele waaruit het BSN (burgerservicenummer) opgehaald kan worden",

      // Store contact info
      "store-contact-info": "Maak digitaal adres (en Partij) aan",
      firstName: "Voornaam",
      firstNameTooltip: "Variabele waaruit de voornaam opgehaald kan worden",
      inFix: "Tussenvoegsel",
      inFixTooltip: "Variabele waaruit het tussenvoegsel opgehaald kan worden",
      lastName: "Achternaam",
      lastNameTooltip: "Variabele waaruit de achternaam opgehaald kan worden",
      emailAddress: "E-mailadres",
      emailAddressTooltip:
        "Variabele waaruit het e-mailadres opgehaald kan worden",
      caseUuid: "Open Zaak-nummer",
      caseUuidTooltip:
        "Variabele waaruit het Open Zaak-nummer opgehaald kan worden",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn":
        "Contactgeschiedenis ophalen op basis van BSN",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Contactgeschiedenis ophalen op basis van Open Zaak-nummer",

      // Register contact moment
      "register-klantcontact": "Verstuur klantcontact",
      objectTypeId: "Type van het object, bijvoorbeeld: 'zaak'",
      objectUuid: "Zaak-UUID",
      caseNumber: "Zaaknummer",
      kanaal: "Communicatiekanaal",
      onderwerp: "Onderwerp",
      inhoud: "Inhoud",
      vertrouwelijk: "Vertrouwelijk (true/false)",
      taal: "Taal (ISO 639-2/B-formaat)",
      plaatsgevondenOp: "Plaatsgevonden op (ISO 8601)",
      partijUuid: "Partij-UUID",
      voorletters: "Voorletters",
      voornaam: "Voornaam",
      voorvoegselAchternaam: "Voorvoegsel achternaam",
      achternaam: "Achternaam",
      heeftBetrokkene:
        "Bevat het klantcontact een betrokkene of is het anoniem?",
      "heeftBetrokkene.betrokkene": "Heeft betrokkene",
      "heeftBetrokkene.anoniem": "Is anoniem",
    },

    en: {
      title: "Open Klant",
      configurationTitle: "Open Klant plugin configuration",
      description: "A plugin for retrieving and sending Open Klant data.",
      configurationTitleTooltip:
        "In this section, you configure the Open Klant plugin to easily send and retrieve data.",

      // Common
      resultPvName: "Result process variable name",
      bsn: "BSN variable",
      bsnTooltip:
        "Path of the variable from which the Dutch BSN (citizen service number) can be retrieved",

      // Store contact info
      "store-contact-info": "Create digital address (and Partij)",
      firstName: "First name",
      firstNameTooltip: "Variable from which the first name can be retrieved",
      inFix: "Name infix",
      inFixTooltip: "Variable from which the name infix can be retrieved",
      lastName: "Last name",
      lastNameTooltip: "Variable from which the last name can be retrieved",
      emailAddress: "Email address",
      emailAddressTooltip:
        "Variable from which the email address can be retrieved",
      caseUuid: "Open Zaak case number",
      caseUuidTooltip:
        "Variable from which the Open Zaak number can be retrieved",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn": "Retrieve contact history based on BSN",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Retrieve contact history based on Open Zaak case number",

      // Register contact moment
      "register-klantcontact": "Send customer contact",
      kanaal: "Communication channel",
      onderwerp: "Subject",
      inhoud: "Message content",
      vertrouwelijk: "Confidential (true/false)",
      taal: "Language (ISO 639-2/B format)",
      plaatsgevondenOp: "Occurred on (ISO 8601)",
      partijUuid: "Partij UUID",
      voorletters: "Initials",
      voornaam: "First name",
      voorvoegselAchternaam: "Name infix",
      achternaam: "Last name",
      heeftBetrokkene:
        "Does the contact moment involve an individual or is it anonymous?",
      "heeftBetrokkene.betrokkene": "Has an individual",
      "heeftBetrokkene.anoniem": "Is anonymous",
    },

    de: {
      title: "Open Klant",
      configurationTitle: "Konfiguration des Open-Klant-Plugins",
      description: "Ein Plugin zum Abrufen und Versenden von Open-Klant-Daten.",
      configurationTitleTooltip:
        "In diesem Abschnitt konfigurieren Sie das Open-Klant-Plugin, um Daten einfach zu senden und abzurufen.",

      // Common
      resultPvName: "Name der Ergebnis-Prozessvariablen",
      bsn: "BSN-Variable",
      bsnTooltip:
        "Pfad der Variable, aus der die niederländische BSN (Bürgerservicenummer) abgerufen wird",

      // Store contact info
      "store-contact-info": "Digitale Adresse (und Partij) erstellen",
      firstName: "Vorname",
      firstNameTooltip: "Variable, aus der der Vorname abgerufen wird",
      inFix: "Namenszusatz",
      inFixTooltip: "Variable, aus der der Namenszusatz abgerufen wird",
      lastName: "Nachname",
      lastNameTooltip: "Variable, aus der der Nachname abgerufen wird",
      emailAddress: "E-Mail-Adresse",
      emailAddressTooltip:
        "Variable, aus der die E-Mail-Adresse abgerufen wird",
      caseUuid: "Open-Zaak-Nummer",
      caseUuidTooltip: "Variable, aus der das Open-Zaak-Nummer abgerufen wird",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn": "Kontaktverlauf basierend auf BSN abrufen",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Kontaktverlauf basierend auf Open-Zaak-Nummer abrufen",

      // Register contact moment
      "register-klantcontact": "Kundenkontakt senden",
      kanaal: "Kommunikationskanal",
      onderwerp: "Betreff",
      inhoud: "Inhalt",
      vertrouwelijk: "Vertraulich (true/false)",
      taal: "Sprache (ISO 639-2/B-Format)",
      plaatsgevondenOp: "Stattgefunden am (ISO 8601)",
      partijUuid: "Partij-UUID",
      voorletters: "Initialen",
      voornaam: "Vorname",
      voorvoegselAchternaam: "Namenszusatz",
      achternaam: "Nachname",
      heeftBetrokkene:
        "Enthält der Kundenkontakt eine betroffene Person oder ist er anonym?",
      "heeftBetrokkene.betrokkene": "Hat eine betroffene Person",
      "heeftBetrokkene.anoniem": "Ist anonym",
    },
  },
};

export { openKlantPluginSpecification };
