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
        "In dit onderdeel configureer je de Open Klant-plugin, om zo gemakkelijk gegevens te kunnen verzenden en op te kunnen halen.",

      // Common
      resultPvName: "Naam van resultaatprocesvariabele",
      bsn: "BSN variabele",
      bsnTooltip:
        "Pad van de variabele waar het BSN (burgerservicenummer) uit opgehaald kan worden",

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
    },
    en: {
      title: "Open Klant",
      configurationTitle: "Open Klant plugin configuration",
      description: "A plugin for retrieving and sending Open Klant data.",
      configurationTitleTooltip:
        "In this section you configure the Open Klant plugin to easily send and retrieve data.",

      // Common
      resultPvName: "Result process variable name",
      bsn: "BSN number variable",
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
      "get-contact-moments-by-bsn":
        "Retrieve contact history based on BSN number",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Retrieve contact history based on Open Zaak number",
    },
    de: {
      title: "Open Klant",
      configurationTitle: "Konfiguration des Open Klant-Plugins",
      description: "Ein Plugin zum Abrufen und Versenden von Open Klant-Daten.",
      configurationTitleTooltip:
        "In diesem Abschnitt konfigurieren Sie das Open Klant-Plugin, um Daten einfach senden und abrufen zu können.",

      // Common
      resultPvName: "Name der Ergebnis-Prozessvariable",
      bsn: "BSN-Nummernvariable",
      bsnTooltip:
        "Pfad der Variable, aus der die niederländische BSN (Bürgerservicenummer) abgerufen werden kann",

      // Store contact info
      "store-contact-info": "Digitale Adresse (und Partij) erstellen",
      firstName: "Vorname",
      firstNameTooltip: "Variable, aus der der Vorname abgerufen werden kann",
      inFix: "Namenszusatz",
      inFixTooltip: "Variable, aus der der Namenszusatz abgerufen werden kann",
      lastName: "Nachname",
      lastNameTooltip: "Variable, aus der der Nachname abgerufen werden kann",
      emailAddress: "E-Mail-Adresse",
      emailAddressTooltip:
        "Variable, aus der die E-Mail-Adresse abgerufen werden kann",
      caseUuid: "Open Zaak-Vorgangsnummer",
      caseUuidTooltip:
        "Variable, aus der die Open Zaak-Vorgangsnummer abgerufen werden kann",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn":
        "Kontaktverlauf anhand der BSN (Bürgerservicenummer) abrufen",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Kontaktverlauf anhand der Open Zaak-Nummer abrufen",
    },
  },
};

export { openKlantPluginSpecification };
