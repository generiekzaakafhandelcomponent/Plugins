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
            objectManagementConfigurationId: 'De ID van de object management configuratie',
            objectUrl: 'De URL van het object',
            objectUrlTooltip: 'Definieert de variabelenaam die wordt gebruikt om de URL op te halen',
            objectUrlProcessVariableName: 'De naam van de procesvariabele waar de URL opgeslagen gaat worden',
            objectData: 'De gegevens voor het object',
            listOfObjectProcessVariableName: 'Procesvariabelenaam voor de objectlijst',
            listOfObjectProcessVariableNameTooltip: 'Definieert de procesvariabelenaam die wordt gebruikt voor het opslaan van de objectlijst',
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
            objectManagementConfigurationId: 'The ID of the object management configuration',
            objectUrl: 'The URL of the object',
            objectUrlTooltip: 'Defines the variable name used to retrieve the URL',
            objectUrlProcessVariableName: 'The name of the process variable where the URL will be stored',
            objectData: 'The data for the object',
            listOfObjectProcessVariableName: 'Process variable name for the Object List',
            listOfObjectProcessVariableNameTooltip: 'Defines the process variable name used for storing the object list',
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
            objectManagementConfigurationId: 'Die ID der objektverwaltungskonfiguration',
            objectUrl: 'Die URL des objekts',
            objectUrlTooltip: 'Definiert den variablennamen, der zum abrufen der URL verwendet wird',
            objectUrlProcessVariableName: 'Der name der prozessvariablen, in der die URL gespeichert wird',
            objectData: 'Die daten für das Objekt',
            listOfObjectProcessVariableName: 'Prozessvariablenname für die objektliste',
            listOfObjectProcessVariableNameTooltip: 'Definiert den prozessvariablennamen, der zum speichern der objektliste verwendet wird',
        }
    }
}

export {objectManagementPluginSpecification};
