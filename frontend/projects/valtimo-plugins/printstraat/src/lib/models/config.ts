import {PluginConfigurationData} from '@valtimo/plugin';

interface Config extends PluginConfigurationData {
  url: string;
  token: string;
}

export {Config};
