import {PluginConfigurationData} from '@valtimo/plugin';

interface HaalCentraalAuthPluginConfig extends PluginConfigurationData {
    authenticationSecret: string;
}

export {HaalCentraalAuthPluginConfig};
