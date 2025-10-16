import {PluginSpecification} from '@valtimo/plugin';
import {SamplePluginConfigurationComponent} from './components/sample-plugin-configuration/sample-plugin-configuration.component';
import {SAMPLE_PLUGIN_LOGO_BASE64} from './assets';
import {SampleActionConfigurationComponent} from './components/sample-action-configuration/sample-action-configuration.component';

const samplePluginSpecification: PluginSpecification = {
  /*
  The plugin definition key of the plugin.
  This needs to be the same as the id received from the backend
  See the key property of the @Plugin annotation in the backend
   */
  pluginId: 'sample-plugin',
  /*
  A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
   */
  pluginConfigurationComponent: SamplePluginConfigurationComponent,
  // Points to a Base64 encoded string, which contains the logo of the plugin.
  pluginLogoBase64: SAMPLE_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    /*
     For each plugin action id received from the backend, a component is provided of the interface FunctionConfigurationComponent.
     These are used to configure each plugin action.
     */
    'api-sample-action': SamplePluginConfigurationComponent,
    'time-api-sample-action': SamplePluginConfigurationComponent
  },
  /*
  For each language key an implementation supports, translation keys with a translation are provided below.
  These can then be used in configuration components using the pluginTranslate pipe or the PluginTranslationService.
  At a minumum, the keys 'title' and 'description' need to be defined.
  Each function key also requires a translation key. In this case, the key 'sample-action' is added.
   */
  pluginTranslations: {
    nl: {
      title: 'Voorbeeld Plugin',
      description: 'Dit is een voorbeeld plugin die beschikt over een API call action.',
      api_url: 'API URL',
      username: 'gebruikersnaam',
      password: 'wachtwoord'
    },
    en: {
      title: 'Sample Plugin',
      description: 'This is a sample plugin demonstrating an API call action."',
      api_url: 'API URL',
      username: 'username',
      password: 'password'
    }
  }
};

export {samplePluginSpecification};
