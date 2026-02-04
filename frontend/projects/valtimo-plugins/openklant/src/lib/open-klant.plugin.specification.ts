import { PluginSpecification } from "@valtimo/plugin";
import { OpenKlantPluginConfigurationComponent } from "./components/open-klant-plugin-configuration/open-klant-plugin-configuration.component";
import { StoreContactInfoComponent } from "./components/open-klant-store-contact-info/open-klant-store-contact-info.component";
import { OPEN_KLANT_PLUGIN_LOGO_BASE64 } from "./assets/open-klant-plugin-logo";
import { GetContactMomentsByCaseUuidComponent } from "./components/open-klant-get-contact-moments-by-case-uuid/open-klant-get-contact-moments-by-case-uuid.component";
import { GetContactMomentsByBsnComponent } from "./components/get-contact-moments-by-bsn/get-contact-moments-by-bsn.component";
import { RegisterKlantcontactComponent } from "./components/open-klant-register-klantcontact/open-klant-register-klantcontact.component";
import { GetOrCreatePartijComponent } from "./components/get-or-create-partij/get-or-create-partij.component";

const openKlantPluginSpecification: PluginSpecification = {
  pluginId: "open-klant",
  pluginConfigurationComponent: OpenKlantPluginConfigurationComponent,
  pluginLogoBase64: OPEN_KLANT_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    "get-contact-moments-by-bsn": GetContactMomentsByBsnComponent,
    "get-contact-moments-by-case-uuid": GetContactMomentsByCaseUuidComponent,
    "store-contact-info": StoreContactInfoComponent,
    "get-or-create-partij": GetOrCreatePartijComponent,
    "register-klantcontact": RegisterKlantcontactComponent,
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
      bsn: "BSN",
      partijUuid: "Partij UUID",
      caseUuid: "Open Zaak zaak UUID",
      variableFieldTooltip:
        "Dit veld kan zowel de letterlijke waarde, of het pad naar een (proces)variabele bevatten welke de waarde bevat (b.v. 'pv:/resultaat')",

      // Store contact info
      "store-contact-info": "Maak Digitaal Adres (en Partij) aan",
      firstName: "Voornaam",
      inFix: "Tussenvoegsel",
      lastName: "Achternaam",
      emailAddress: "E-mailadres",

      // Get or create Partij
      "get-or-create-partij": "Haal Partij op of maak een Partij aan",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn":
        "Contactgeschiedenis ophalen op basis van BSN",

      // Get contact moments by Partij UUID
      "get-contact-moments-by-partij-uuid":
        "Contactgeschiedenis ophalen op basis van Partij UUID",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Contactgeschiedenis ophalen op basis van Open-Zaak-UUID",

      // Register contact moment
      "register-klantcontact": "Registreer nieuw klantcontact",
      objectTypeId: "Type van het object, bijvoorbeeld: 'zaak'",
      kanaal: "Communicatiekanaal",
      onderwerp: "Onderwerp",
      inhoud: "Inhoud",
      vertrouwelijk: "Vertrouwelijk (true/false)",
      taal: "Taal (ISO 639-2/B-formaat)",
      plaatsgevondenOp: "Plaatsgevonden op (ISO 8601)",
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
      bsn: "BSN (citizen service number)",
      partijUuid: "Partij UUID",
      caseUuid: "Open Zaak case UUID",
      variableFieldTooltip:
        "This field accepts either a literal value or a path to a (process) variable containing the value (e.g. 'pv:/result')",

      // Store contact info
      "store-contact-info": "Create 'Digitaal Adres' (digital address) (and Partij)",
      firstName: "First name",
      inFix: "Name infix",
      lastName: "Last name",
      emailAddress: "Email address",

      // Get or create Partij
      "get-or-create-partij": "Get Partij or create a Partij",

      // Get contact moments by BSN
      "get-contact-moments-by-bsn": "Retrieve contact history based on BSN",

      // Get contact moments by Partij UUID
      "get-contact-moments-by-partij-uuid":
        "Retrieve contact history based on Partij UUID",

      // Get contact moments by case UUID
      "get-contact-moments-by-case-uuid":
        "Retrieve contact history based on Open Zaak case UUID",

      // Register contact moment
      "register-klantcontact": "Register new klantcontact (customer contact)",
      objectTypeId: "Type van het object, bijvoorbeeld: 'zaak'",
      kanaal: "Communication channel",
      onderwerp: "Subject",
      inhoud: "Message content",
      vertrouwelijk: "Confidential (true/false)",
      taal: "Language (ISO 639-2/B format)",
      plaatsgevondenOp: "Occurred on (ISO 8601)",
      voorletters: "Initials",
      voornaam: "First name",
      voorvoegselAchternaam: "Name infix",
      achternaam: "Last name",
      heeftBetrokkene:
        "Does the contact moment involve an individual or is it anonymous?",
      "heeftBetrokkene.betrokkene": "Has an individual",
      "heeftBetrokkene.anoniem": "Is anonymous",
    }
  },
};

export {openKlantPluginSpecification};
