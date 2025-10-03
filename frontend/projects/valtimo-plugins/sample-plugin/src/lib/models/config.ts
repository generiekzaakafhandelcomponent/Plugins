import {PluginConfigurationData} from '@valtimo/plugin';

interface SamplePluginConfig extends PluginConfigurationData {
  apiUrl: string;
}

interface SampleActionConfig {
  message: string;
}

export {SamplePluginConfig, SampleActionConfig};
