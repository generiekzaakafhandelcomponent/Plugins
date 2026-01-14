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
    OpenKlantSendKlantcontactComponent
} from "./components/open-klant-post-klantcontact/open-klant-send-klantcontact.component";

const openKlantPluginSpecification: PluginSpecification = {
    pluginId: 'openklant',
    pluginConfigurationComponent: OpenKlantPluginConfigurationComponent,
    pluginLogoBase64: OPEN_KLANT_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'get-contact-moments-by-case': OpenKlantGetContactMomentsByCaseUuidComponent,
        'store-contactinfo': OpenKlantStoreContactinfoComponent,
        'send-klantcontact': OpenKlantSendKlantcontactComponent,
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
            'send-klantcontact': 'Verstuur klantcontact',
            bsn: 'Bsn',
            firstName: 'Voornaam',
            inFix: 'Tussenvoegsel',
            lastName: 'Achternaam',
            emailAddress: 'E-mailadres ',
            caseNumber: 'Zaaknummer',
            communicationChannel: 'Communicatiekanaal',
            subject: 'Onderwerp',
            content: 'Inhoud',
            confidential: 'Vertrouwelijk',
            startDateTime: 'Start datum/tijd (ISO 8601)',
            partijUuid: 'Partij Uuid',
            initials: 'Initialen',

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
            'send-klantcontact': 'Send contact',
            bsn: 'Bsn',
            firstName: 'First Name',
            inFix: 'Infix',
            lastName: 'Last Name',
            emailAddress: 'E-mail Address ',
            caseNumber: 'Case Number',
            communicationChannel: 'Communication channel',
            subject: 'Subject',
            content: 'Content',
            confidential: 'Confidential',
            startDateTime: 'Start date/time (ISO 8601)',
            partijUuid: 'Partij Uuid',
            initials: 'Initials',
        }
    }
};

export {openKlantPluginSpecification};
