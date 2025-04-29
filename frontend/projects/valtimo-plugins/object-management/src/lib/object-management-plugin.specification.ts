/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {PluginSpecification} from '@valtimo/plugin';
import {
    ObjectManagementConfigurationComponent
} from "./components/object-management-configuration/object-management-configuration.component";
import {OBJECT_MANAGEMENT_PLUGIN_LOGO_BASE64} from "./assets";
import {CreateObjectConfigurationComponent} from "./components/create-object/create-object-configuration.component";
import {GetObjectsConfigurationComponent} from "./components/get-objects/get-objects-configuration.component";
import {DeleteObjectConfigurationComponent} from "./components/delete-object/delete-object-configuration.component";
import {UpdateObjectConfigurationComponent} from "./components/update-object/update-object-configuration.component";

const objectManagementPluginSpecification: PluginSpecification = {
    pluginId: 'object-management',
    pluginConfigurationComponent: ObjectManagementConfigurationComponent,
    pluginLogoBase64: OBJECT_MANAGEMENT_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'create-object': CreateObjectConfigurationComponent,
        'get-objects-unpaged': GetObjectsConfigurationComponent,
        'delete-object': DeleteObjectConfigurationComponent,
        'update-object': UpdateObjectConfigurationComponent,
    },
    pluginTranslations: {
        nl: {
            title: 'Object management',
            url: 'Object management',
            description: 'Plugin voor het uitvoeren van CRUD acties in de Object registratie',
            configurationTitle: 'Configuratienaam',
            objectManagementConfigurationTitle: 'Object Management configuratie titel',
            objectManagementConfigurationTitleTooltip: 'De titel van de geconfigureerde object management instantie',
            'get-objects-unpaged': "Objecten ophalen",
            'delete-object': "Object verwijderen",
            'create-object': "Object aanmaken",
            'update-object': "Object bijwerken",
            objectUUID: 'De UUID van het object',
            objectData: 'De gegevens voor het object',
            searchString: 'De query die als filter wordt gebruikt',
            searchStringTooltip: 'Een geldige parameterwaarde heeft de vorm key__operator__value. key is de attribuutnaam, operator is de te gebruiken vergelijkingsoperator en value is de attribuutwaarde. Opmerking: Waarden kunnen tekenreeksen, numerieke waarden of datums zijn. Datafilterexpressies worden door komma\'s gescheiden.',
            pageNumber: 'Paginanummer',
            pagesize: 'Paginagrootte',
            ordering: 'Sortering',
            orderingTooltip: 'Door komma\'s gescheiden velden die worden gebruikt om resultaten te sorteren. Voor aflopende volgorde gebruik je \'-\' als voorvoegsel. Geneste velden worden ook ondersteund. Bijvoorbeeld: \'-record__data__length,record__index\'.',
            listOfObjectProcessVariableName: 'Procesvariabelenaam voor de objectlijst',
            listOfObjectProcessVariableNameTooltip: 'Definieert de procesvariabelenaam die wordt gebruikt voor het opslaan van de objectlijst',
            objectUrlProcessNameTooltip: 'Definieert de variabelenaam die wordt gebruikt om de URL op te halen',
        },
        en: {
            title: 'Object Management',
            url: 'Object Management',
            description: 'Plugin for performing CRUD actions in the Object Registration',
            configurationTitle: 'Configuration Name',
            objectManagementConfigurationTitle: 'Object Management Configuration Title',
            objectManagementConfigurationTitleTooltip: 'The title of the configured object management instance',
            'get-objects-unpaged': "Retrieve Objects",
            'delete-object': "Delete Object",
            'create-object': "Create Object",
            'update-object': "Update Object",
            objectUUID: 'The UUID of the object',
            objectData: 'The data for the object',
            searchString: 'The query used as a filter',
            searchStringTooltip: 'A valid parameter value has the form key__operator__value. key is the attribute name, operator is the comparison operator to be used, and value is the attribute value. Note: Values can be strings, numbers, or dates. Data filtering expressions are comma-separated.',
            pageNumber: 'Page Number',
            pagesize: 'Page Size',
            ordering: 'Ordering',
            orderingTooltip: 'Comma-separated fields used to sort results. For descending order, use \'-\' as a prefix. Nested fields are also supported. For example: \'-record__data__length,record__index\'.',
            listOfObjectProcessVariableName: 'Process Variable Name for the Object List',
            listOfObjectProcessVariableNameTooltip: 'Defines the process variable name used for storing the object list',
            objectUrlProcessNameTooltip: 'Defines the variable name used to retrieve the URL',
        },
    }
}

export {objectManagementPluginSpecification};
