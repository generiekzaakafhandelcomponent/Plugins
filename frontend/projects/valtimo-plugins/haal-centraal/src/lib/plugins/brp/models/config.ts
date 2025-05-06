import {PluginConfigurationData} from '@valtimo/plugin';

interface Config extends PluginConfigurationData {
    brpBaseUrl: string;
}

interface BewoningenConfig {
    adresseerbaarObjectIdentificatie: string;
    peildatum: string;
    resultProcessVariableName: string;
}

export {Config, BewoningenConfig};
