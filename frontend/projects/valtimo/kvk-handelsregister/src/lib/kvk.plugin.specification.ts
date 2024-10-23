import {PluginSpecification} from '@valtimo/plugin';
import {
    KvkPluginConfigurationComponent
} from './components/kvk-plugin-configuration/kvk-plugin-configuration.component';
import {KVK_HAALCENTRAAL_PLUGIN_LOGO_BASE64} from './assets';
import {ZoekenOpKvkNummerComponent} from './components/zoeken-op-kvk-nummer/zoeken-op-kvk-nummer.component';

const kvkPluginSpecification: PluginSpecification = {
    /*
    The plugin definition key of the plugin.
    This needs to be the same as the id received from the back-endÏÏ
     */
    pluginId: 'kvkhandelsregister',
    /*
    A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
     */
    pluginConfigurationComponent: KvkPluginConfigurationComponent,
    // Points to a Base64 encoded string, which contains the logo of the plugin.
    pluginLogoBase64: KVK_HAALCENTRAAL_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'zoeken-op-kvk-nummer': ZoekenOpKvkNummerComponent
    },
    /*
    For each language key an implementation supports, translation keys with a translation are provided below.
    These can then be used in configuration components using the pluginTranslate pipe or the PluginTranslationService.
    At a minumum, the keys 'title' and 'description' need to be defined.
    Each function key also requires a translation key. In this case, the key 'sample-action' is added.
     */
    pluginTranslations: {
        nl: {
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'KvK Handelsregister plugin',
            title: 'Kvk Handelsregister API',
            description: 'KvK Handelsregister API bevragen.',
            kvkNummer: 'Kvk nummer',
            handelsregisterBaseUrl: 'base url naar handelsregister kvk service',
            tokenServiceUrl: 'Url naar token service',
            keystorePath: 'Keystore certificate pad',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate pad',
            truststoreSecret: 'Truststore certificate key',
            connectionTimeout: 'Request connection timeout in milliseconden',
            responseTimeout: 'Request response timeout in milliseconden',
            apikey: 'apikey',
            'zoeken-op-kvk-nummer': 'Zoeken op Kvk nummer'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'KvK Handelsregister API plugin',
            title: 'KVK Handelsregister API',
            description: 'With this plugin GZAC can retrieve KvK Handelsregister API requests',
            handelsregisterBaseUrl: 'base url to handelsregister kvk service',
            kvkNummer: 'KvK Number',
            keystorePath: 'Keystore certificate path',
            keystoreSecret: 'Keystore certificate key',
            truststorePath: 'Truststore certificate path',
            truststoreSecret: 'Truststore certificate key',
            connectionTimeout: 'Request connection timeout in milliseconds',
            responseTimeout: 'Request response timeout in milliseconds',
            apikey: 'apikey',
            'zoeken-op-kvk-nummer': 'find Kvk nummer'
        }
    }
};

export {kvkPluginSpecification};
