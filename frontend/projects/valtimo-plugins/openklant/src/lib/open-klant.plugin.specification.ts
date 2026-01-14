import { PluginSpecification } from "@valtimo/plugin";
import { OpenKlantPluginConfigurationComponent } from "./components/open-klant-plugin-configuration/open-klant-plugin-configuration.component";
import { StoreContactInfoComponent } from "./components/store-contact-info/store-contact-info.component";
import { OPEN_KLANT_PLUGIN_LOGO_BASE64 } from "./assets/open-klant-plugin-logo";
import { GetContactMomentsByCaseUuidComponent } from "./components/get-contact-moments-by-case-uuid/get-contact-moments-by-case-uuid.component";
import { GetContactMomentsByBsnComponent } from "./components/get-contact-moments-by-bsn/get-contact-moments-by-bsn.component";

const openKlantPluginSpecification: PluginSpecification = {
  pluginId: "openklant",
  pluginConfigurationComponent: OpenKlantPluginConfigurationComponent,
  pluginLogoBase64: OPEN_KLANT_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    "get-contact-moments-by-bsn": GetContactMomentsByBsnComponent,
    "get-contact-moments-by-case-uuid": GetContactMomentsByCaseUuidComponent,
    "store-contact-info": StoreContactInfoComponent,
  },
  pluginTranslations: {
    nl: {
      title: "OpenKlant",
      configurationTitle: "Configuratie van de OpenKlant-plugin",
      description:
        "Een plugin voor het ophalen en versturen van OpenKlant-gegevens.",
      configurationTitleTooltip:
        "In dit onderdeel configureer je de OpenKlant-plugin, om zo gemakkelijk gegevens te kunnen verzenden en op te kunnen halen.",

      // Common
      resultPvName: "Naam van resultaatprocesvariabele",
      bsn: "BSN-nummer variabele",
      bsnTooltip:
        "Pad van de variabele waar het burgerservicenummer uit opgehaald kan worden",

      // Store contact info
      "store-contact-info": "Maak digitaal adres (en partij) aan",
      firstName: "Voornaam",
      firstNameTooltip: "Variabele waaruit de voornaam opgehaald kan worden",
      inFix: "Tussenvoegsel",
      inFixTooltip: "Variabele waaruit het tussenvoegsel opgehaald kan worden",
      lastName: "Achternaam",
      lastNameTooltip: "Variabele waaruit de achternaam opgehaald kan worden",
      emailAddress: "E-mailadres",
      emailAddressTooltip:
        "Variabele waaruit het e-mailadres opgehaald kan worden",
      caseUuid: "OpenZaak-nummer",
      caseUuidTooltip:
        "Variabele waaruit het OpenZaak-nummer opgehaald kan worden",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn":
        "Contactgeschiedenis ophalen op basis van BSN-nummer",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Contactgeschiedenis ophalen op basis van OpenZaak-nummer",
    },
    en: {
      title: "OpenKlant",
      configurationTitle: "OpenKlant plugin configuration",
      description: "A plugin for retrieving and sending OpenKlant data.",
      configurationTitleTooltip:
        "In this section you configure the OpenKlant plugin to easily send and retrieve data.",

      // Common
      resultPvName: "Result process variable name",
      bsn: "BSN number variable",
      bsnTooltip:
        "Path of the variable from which the Dutch citizen service number can be retrieved",

      // Store contact info
      "store-contact-info": "Create digital address (and party)",
      firstName: "First name",
      firstNameTooltip: "Variable from which the first name can be retrieved",
      inFix: "Name infix",
      inFixTooltip: "Variable from which the name infix can be retrieved",
      lastName: "Last name",
      lastNameTooltip: "Variable from which the last name can be retrieved",
      emailAddress: "Email address",
      emailAddressTooltip:
        "Variable from which the email address can be retrieved",
      caseUuid: "OpenZaak case number",
      caseUuidTooltip:
        "Variable from which the OpenZaak number can be retrieved",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn":
        "Retrieve contact history based on BSN number",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Retrieve contact history based on OpenZaak number",
    },
    de: {
      title: "OpenKlant",
      configurationTitle: "Konfiguration des OpenKlant-Plugins",
      description: "Ein Plugin zum Abrufen und Versenden von OpenKlant-Daten.",
      configurationTitleTooltip:
        "In diesem Abschnitt konfigurieren Sie das OpenKlant-Plugin, um Daten einfach senden und abrufen zu können.",

      // Common
      resultPvName: "Name der Ergebnis-Prozessvariable",
      bsn: "BSN-Nummernvariable",
      bsnTooltip:
        "Pfad der Variable, aus der die Bürgerservicenummer abgerufen werden kann",

      // Store contact info
      "store-contact-info": "Digitale Adresse (und Partei) erstellen",
      firstName: "Vorname",
      firstNameTooltip: "Variable, aus der der Vorname abgerufen werden kann",
      inFix: "Namenszusatz",
      inFixTooltip: "Variable, aus der der Namenszusatz abgerufen werden kann",
      lastName: "Nachname",
      lastNameTooltip: "Variable, aus der der Nachname abgerufen werden kann",
      emailAddress: "E-Mail-Adresse",
      emailAddressTooltip:
        "Variable, aus der die E-Mail-Adresse abgerufen werden kann",
      caseUuid: "OpenZaak-Vorgangsnummer",
      caseUuidTooltip:
        "Variable, aus der die OpenZaak-Vorgangsnummer abgerufen werden kann",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn":
        "Kontaktverlauf anhand der BSN-Nummer abrufen",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Kontaktverlauf anhand der OpenZaak-Nummer abrufen",
    },
  },
};

export { openKlantPluginSpecification };
