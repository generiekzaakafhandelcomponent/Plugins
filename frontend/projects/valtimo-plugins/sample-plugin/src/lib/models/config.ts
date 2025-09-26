import {PluginConfigurationData} from '@valtimo/plugin';

interface SamplePluginConfig extends PluginConfigurationData {
  api_url: string;
}

interface SampleActionConfig {
  message: string;
}

export {SamplePluginConfig, SampleActionConfig};
