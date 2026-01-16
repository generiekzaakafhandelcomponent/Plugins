import {PluginSpecification} from '@valtimo/plugin';
import {PrintstraatPluginConfigurationComponent} from './components/printstraat-plugin-configuration.component';
import {PRINTSTRAAT_PLUGIN_LOGO_BASE64} from './assets';
import {
  PrintstraatPluginActionConfigurationComponent
} from "./components/printstraat-plugin-action-configuration.component";

const printstraatPluginSpecification: PluginSpecification = {
  /*
  The plugin definition key of the plugin.
  This needs to be the same as the id received from the back-end
   */
  pluginId: 'printstraat',
  /*
  A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
   */
  pluginConfigurationComponent: PrintstraatPluginConfigurationComponent,
  // Points to a Base64 encoded string, which contains the logo of the plugin.
  pluginLogoBase64: PRINTSTRAAT_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'send-file-to-printstraat': PrintstraatPluginActionConfigurationComponent
  },
  /*
  For each language key an implementation supports, translation keys with a translation are provided below.
  These can then be used in configuration components using the pluginTranslate pipe or the PluginTranslationService.
  At a minimum, the keys 'title' and 'description' need to be defined.
  Each function key also requires a translation key. In this case, the key 'sample-action' is added.
   */
  pluginTranslations: {
    nl: {
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
          'Printstraat Plugin configuratie naam',
      title: 'Printstraat',
      description: 'Maakt connectie met Printstraat via OpenTunnel',
      url: 'URL',
      token: 'Token',
      'send-file-to-printstraat': 'Stuur bestand naar Printstraat',
      documentenApiPluginConfigurationId: 'Documenten API Plugin configuratie ID',
      zaaknummer: 'Zaaknummer',
      documentMetadataVariableName: 'Document metadata procesvariabele naam',
      documentMetadataVariableNameTooltip: 'Naam van de procesvariabele die de metadata van het document bevat.',
    },
    en: {
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Printstraat Plugin configuration name',
      title: 'Printstraat',
      description: 'Connects to Printstraat via OpenTunnel"',
      url: 'URL',
      token: 'Token',
      'send-file-to-printstraat': 'Send file to Printstraat',
      documentenApiPluginConfigurationId: 'Documenten API Plugin configuration ID',
      zaaknummer: 'Case number',
      documentMetadataVariableName: 'Document metadata variable name',
      documentMetadataVariableNameTooltip: 'Name of the process variable that contains the metadata of the document',
    }
  }
};

export {printstraatPluginSpecification};
