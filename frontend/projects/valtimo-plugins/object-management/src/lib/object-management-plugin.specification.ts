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
import {GetObjectDataConfigurationComponent} from "./components/get-object-data/get-object-data-configuration.component";

const objectManagementPluginSpecification: PluginSpecification = {
    pluginId: 'object-management',
    pluginConfigurationComponent: ObjectManagementConfigurationComponent,
    pluginLogoBase64: OBJECT_MANAGEMENT_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'create-object': CreateObjectConfigurationComponent,
        'get-object-data-by-url': GetObjectDataConfigurationComponent,
        'get-objects-unpaged': GetObjectsConfigurationComponent,
        'delete-object': DeleteObjectConfigurationComponent,
        'update-object': UpdateObjectConfigurationComponent,
    },
    pluginTranslations: {
        nl: {
            title: 'Object Management',
            url: 'Object Management',
            description: 'Plugin voor het uitvoeren van CRUD acties in de Object registratie',
            configurationTitle: 'Configuratienaam',
            objectManagementConfigurationTitle: 'Object management configuratie titel',
            objectManagementConfigurationTitleTooltip: 'De titel van de geconfigureerde object management instantie',
            'get-objects-unpaged': "Objecten ophalen",
            'delete-object': "Object verwijderen",
            'create-object': "Object aanmaken",
            'update-object': "Object bijwerken",
            'get-object-data-by-url': "Object data ophalen",
            objectManagementConfigurationId: 'De ID van de object management configuratie',
            objectUrl: 'De URL van het object',
            objectUrlTooltip: 'Definieert de variabelenaam van object URL',
            objectUrlProcessVariableName: 'De naam van de procesvariabele waar de URL opgeslagen gaat worden',
            objectData: 'De gegevens voor het object',
            listOfObjectProcessVariableName: 'Procesvariabelenaam voor de objectlijst',
            listOfObjectProcessVariableNameTooltip: 'Definieert de procesvariabelenaam die wordt gebruikt voor het opslaan van de objectlijst',
            objectDataProcessVariableName: 'Procesvariabelenaam voor de object data',
            objectDataProcessVariableNameTooltip: 'Definieert de procesvariabelenaam die wordt gebruikt voor het opslaan van de object data',
            objectManagementConfigurationIdTooltip: 'Definieert de ID (UUID) van de object management configuratie'
        },
        en: {
            title: 'Object Management',
            url: 'Object Management',
            description: 'Plugin for performing CRUD actions in the Object registration',
            configurationTitle: 'Configuration Name',
            objectManagementConfigurationTitle: 'Object management configuration title',
            objectManagementConfigurationTitleTooltip: 'The title of the configured object management instance',
            'get-objects-unpaged': "Retrieve Objects",
            'delete-object': "Delete Object",
            'create-object': "Create Object",
            'update-object': "Update Object",
            'get-object-data-by-url': "Retrieve Object data",
            objectManagementConfigurationId: 'The ID of the object management configuration',
            objectUrl: 'The URL of the object',
            objectUrlTooltip: 'Defines the variable name of object URL',
            objectUrlProcessVariableName: 'The name of the process variable where the URL will be stored',
            objectData: 'The data for the object',
            listOfObjectProcessVariableName: 'Process variable name for the Object List',
            listOfObjectProcessVariableNameTooltip: 'Defines the process variable name used for storing the object list',
            objectDataProcessVariableName: 'Process variable for the object data',
            objectDataProcessVariableNameTooltip: 'Defines the process variable name used for storing the object data',
            objectManagementConfigurationIdTooltip: 'Defines the ID (UUID) of the object management configuration'
        },
        de: {
            title: 'Object Management',
            url: 'Object Management',
            description: 'Plugin zum ausführen von CRUD-Aktionen in der objektregistrierung',
            configurationTitle: 'Konfigurationsname',
            objectManagementConfigurationTitle: 'Titel der objektverwaltungskonfiguration',
            objectManagementConfigurationTitleTooltip: 'Der titel der konfigurierten objektverwaltungsinstanz',
            'get-objects-unpaged': "Objekte abrufen",
            'delete-object': "Objekt löschen",
            'create-object': "Objekt erstellen",
            'update-object': "Objekt aktualisieren",
            'get-object-data-by-url': "Objektdaten abrufen",
            objectManagementConfigurationId: 'Die ID der objektverwaltungskonfiguration',
            objectUrl: 'Die URL des objekts',
            objectUrlTooltip: 'Definiert den variablennamen der objekt URL',
            objectUrlProcessVariableName: 'Der name der prozessvariablen, in der die URL gespeichert wird',
            objectData: 'Die daten für das Objekt',
            listOfObjectProcessVariableName: 'Prozessvariablenname für die objektliste',
            listOfObjectProcessVariableNameTooltip: 'Definiert den prozessvariablennamen, der zum speichern der objektliste verwendet wird',
            objectDataProcessVariableName: 'Prozessvariablenname für die Objektdaten',
            objectDataProcessVariableNameTooltip: 'Definiert den prozessvariablennamen, die zum Speichern der Objektdaten verwendet wird',
            objectManagementConfigurationIdTooltip: 'Definiert die ID (UUID) der objektverwaltungskonfiguration'
        }
    }
}

export {objectManagementPluginSpecification};
