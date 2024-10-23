import {PluginConfigurationData} from '@valtimo/plugin';

interface Config extends PluginConfigurationData {
    handelsregisterBaseUrl: string;
    apikey: string;
    connectionTimeout: number;
    responseTimeout: number;
}

interface ZoekenConfig {
    kvkNummer: string;
    resultProcessVariableName: string;
}

export {Config, ZoekenConfig};
