import {PluginSpecification} from '@valtimo/plugin';
import {PrintstraatPluginConfigurationComponent} from './components/printstraat-plugin-configuration.component';
import {PRINTSTRAAT_PLUGIN_LOGO_BASE64} from './assets';

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
      token: 'token'
    },
    en: {
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
          'Name of the Document Search Plugin configuration',
      title: 'Printstraat',
      description: 'Connects to Printstraat via OpenTunnel"',
      url: 'URL',
      token: 'token'
    }
  }
};

export {printstraatPluginSpecification};
