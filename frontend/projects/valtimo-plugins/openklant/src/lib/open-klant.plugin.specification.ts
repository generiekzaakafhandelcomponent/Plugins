import {PluginSpecification} from '@valtimo/plugin';
import {
    OpenKlantPluginConfigurationComponent
} from './components/open-klant-plugin-configuration/open-klant-plugin-configuration.component';
import {
    OpenKlantStoreContactinfoComponent
} from './components/open-klant-store-contactinfo/open-klant-store-contactinfo.component';
import {OPEN_KLANT_PLUGIN_LOGO_BASE64} from './assets/open-klant-plugin-logo';
import {
    OpenKlantGetContactMomentsByCaseUuidComponent
} from './components/open-klant-get-contact-moments-by-case-uuid/open-klant-get-contact-moments-by-case-uuid.component';
import {
    OpenKlantRegisterKlantcontactComponent
} from "./components/open-klant-register-klantcontact/open-klant-register-klantcontact.component";

const openKlantPluginSpecification: PluginSpecification = {
    pluginId: 'openklant',
    pluginConfigurationComponent: OpenKlantPluginConfigurationComponent,
    pluginLogoBase64: OPEN_KLANT_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'get-contact-moments-by-case': OpenKlantGetContactMomentsByCaseUuidComponent,
        'store-contactinfo': OpenKlantStoreContactinfoComponent,
        'register-klantcontact': OpenKlantRegisterKlantcontactComponent,
    },
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip: 'OpenKlant plugin',
            title: 'OpenKlant',
            description: 'Met deze plugin kan GZAC OpenKlant gegevens ophalen en versturen.',
            objectTypeId: "Type van het object, bijvoorbeeld: 'zaak'.",
            objectUuid: 'Zaak UUID',
            resultPvName: 'Resultaat procesvariabele naam',
            'get-contact-moments-by-case': 'Haal contactmomenten op o.b.v. Zaak',
            'store-contactinfo': 'Sla contactinformatie op',
            'register-klantcontact': 'Verstuur klantcontact',
            bsn: 'Bsn',
            firstName: 'Voornaam',
            inFix: 'Tussenvoegsel',
            lastName: 'Achternaam',
            emailAddress: 'E-mailadres ',
            caseNumber: 'Zaaknummer',
            kanaal: 'Communicatiekanaal',
            onderwerp: 'Onderwerp',
            inhoud: 'Inhoud',
            vertrouwelijk: 'Vertrouwelijk (true/false)',
            taal: 'Taal (ISO 639-2/B formaat)',
            plaatsgevondenOp: 'Plaatsgevonden op (ISO 8601)',
            partijUuid: 'Partij Uuid',
            voorletters: 'Voorletters',
            voornaam: 'Voornaam',
            voorvoegselAchternaam: 'Voorvoegsel Achternaam',
            achternaam: 'Achternaam',
            heeftBetrokkene: 'Bevat het klantcontact een betrokkene of is het anoniem?',
            'heeftBetrokkene.betrokkene': 'Heeft betrokkene',
            'heeftBetrokkene.anoniem': 'Is anoniem',

        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'OpenKlant plugin',
            title: 'OpenKlant',
            description: 'With this plugin GZAC can send and receive OpenKlant data',
            objectTypeId: "Type of the object. Example: 'zaak'",
            objectUuid: 'Case UUID',
            resultPvName: 'Result process variabel name',
            'get-contact-moments-by-case': 'Get contact moments by case',
            'store-contactinfo': 'Store contactinfo',
            'register-klantcontact': 'Register contact',
            bsn: 'Bsn',
            firstName: 'First Name',
            inFix: 'Infix',
            lastName: 'Last Name',
            emailAddress: 'E-mail Address ',
            caseNumber: 'Case Number',
            kanaal: 'Communication channel',
            onderwerp: 'Subject',
            inhoud: 'Content',
            vertrouwelijk: 'Confidential (true/false)',
            taal: 'Language (ISO 639-2/B format)',
            plaatsgevondenOp: 'Start date/time (ISO 8601)',
            partijUuid: 'Partij Uuid',
            voorletters: 'Initials',
            voornaam: 'First Name',
            voorvoegselAchternaam: 'Infix',
            achternaam: 'Last name',
            heeftBetrokkene: 'Does the contact moment involve an individual or is it anonymous?',
            'heeftBetrokkene.betrokkene': 'Has an individual',
            'heeftBetrokkene.anoniem': 'Is anonymous',
        }
    }
};

export {openKlantPluginSpecification};
