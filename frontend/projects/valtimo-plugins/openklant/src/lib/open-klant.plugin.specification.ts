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

const openKlantPluginSpecification: PluginSpecification = {
    pluginId: 'openklant',
    pluginConfigurationComponent: OpenKlantPluginConfigurationComponent,
    pluginLogoBase64: OPEN_KLANT_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'get-contact-moments-by-case': OpenKlantGetContactMomentsByCaseUuidComponent,
        'store-contactinfo': OpenKlantStoreContactinfoComponent
    },
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip: 'OpenKlant plugin',
            title: 'OpenKlant',
            description: 'Met deze plugin kan GZAC OpenKlant gegevens ophalen en versturen.',
            objectTypeId: "Type van het object, bijvoorbeeld: 'zaak'.",
            objectUuid: 'Zaak UUID',
            resultPvName: 'Resultaat procesvariabele naam'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip: 'OpenKlant plugin',
            title: 'OpenKlant',
            description: 'With this plugin GZAC can send and receive OpenKlant data',
            objectTypeId: "Type of the object. Example: 'zaak'",
            objectUuid: 'Case UUID',
            resultPvName: 'Result process variabel name'
        }
    }
};

export {openKlantPluginSpecification};
