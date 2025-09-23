import {PluginSpecification} from '@valtimo/plugin';

import {
    DocumentSearchPluginActionComponent
} from "./components/document-search-action-configuration/document-search-plugin-action-configuration.component";
import {
    DocumentSearchPluginConfigurationComponent
} from "./components/document-search-plugin-configuration/document-search-plugin-configuration.component";
import {DOCUMENT_SEARCH_PLUGIN_LOGO_BASE64} from "./assets";

const documentSearchPluginSpecification: PluginSpecification = {
    /*
    The plugin definition key of the plugin.
    This needs to be the same as the id received from the back-end
     */
    pluginId: 'document-search',
    /*
    A component of the interface PluginConfigurationComponent, used to configure the plugin itself.
     */
    pluginConfigurationComponent: DocumentSearchPluginConfigurationComponent,
    // Points to a Base64 encoded string, which contains the logo of the plugin.
    pluginLogoBase64: DOCUMENT_SEARCH_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'search-document': DocumentSearchPluginActionComponent
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
                'Naam van de Document Zoek Plugin configuratie',
            title: 'Document Zoek Plugin',
            description: 'Zoeken in documenten',
            'search-document': 'Document zoeken',
            documentPath: 'Document pad',
            documentPathTooltip: 'Het JSON-pad in het document waar gezocht moet worden',
            searchedValue: 'Zoekwaarde',
            searchedValueTooltip: 'De waarde waarnaar gezocht moet worden in het document',
            resultProcessVariableName: 'Resultaat procesvariabele naam',
            resultProcessVariableNameTooltip: 'De naam van de procesvariabele waarin het zoekresultaat wordt opgeslagen'
        },
        en: {
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'Name of the Document Search Plugin configuration',
            title: 'Document Search Plugin',
            description: 'Search within documents',
            'search-document': 'Document search',
            documentPath: 'Document path',
            documentPathTooltip: 'The JSON path in the document where the search will be performed',
            searchedValue: 'Searched value',
            searchedValueTooltip: 'The value to search for in the document',
            resultProcessVariableName: 'Result process variable name',
            resultProcessVariableNameTooltip: 'The name of the process variable where the search result will be stored'
        }
    }
};

export {documentSearchPluginSpecification};
