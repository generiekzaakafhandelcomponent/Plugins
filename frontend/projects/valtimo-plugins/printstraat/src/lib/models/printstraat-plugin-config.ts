import {PluginConfigurationData} from '@valtimo/plugin';

interface PrintstraatPluginConfig extends PluginConfigurationData {
  url: string;
  token: string;
}

interface PrintstraatPluginActionConfig {
  documentenApiPluginConfigurationId: string,
  zaaknummer: string,
  documentMetadataVariableName: string;
}

export {PrintstraatPluginConfig, PrintstraatPluginActionConfig};
