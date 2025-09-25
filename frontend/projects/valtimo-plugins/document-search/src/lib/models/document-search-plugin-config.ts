import {PluginConfigurationData} from '@valtimo/plugin';

interface DocumentSearchPluginConfig extends PluginConfigurationData {
  url: string;
}

interface DocumentSearchPluginActionConfig {
  documentPath: string,
  searchedValue: string,
  resultProcessVariableName: string;
}
export {DocumentSearchPluginConfig, DocumentSearchPluginActionConfig};
