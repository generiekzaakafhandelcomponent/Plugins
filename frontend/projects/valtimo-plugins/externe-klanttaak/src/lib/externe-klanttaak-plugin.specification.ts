/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

import {
    ExterneKlanttaakConfigurationComponent
} from './components/externe-klanttaak-configuration/externe-klanttaak-configuration.component';
import {EXTERNE_KLANTTAAK_PLUGIN_LOGO_BASE64} from './assets/externe-klanttaak-plugin-logo';
import {PluginSpecification} from "@valtimo/plugin";
import {
    CreateExterneKlanttaakComponent
} from "./components/create-externe-klanttaak/create-externe-klanttaak.component";
import {
    CompleteExterneKlanttaakComponent
} from "./components/complete-externe-klanttaak/complete-externe-klanttaak.component";

const externeKlanttaakPluginSpecification: PluginSpecification = {
    pluginId: 'externe-klanttaak',
    pluginConfigurationComponent: ExterneKlanttaakConfigurationComponent,
    pluginLogoBase64: EXTERNE_KLANTTAAK_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {
        'create-externe-klanttaak': CreateExterneKlanttaakComponent,
        'complete-externe-klanttaak': CompleteExterneKlanttaakComponent,
    },
    pluginTranslations: {
        nl: {
            title: 'Externe Klanttaak',
            description: 'Een plugin om Externe Klanttaken te creëren en afhandelen.',
            configurationTitle: 'Configuratienaam',
            configurationTitleTooltip:
                'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
            notificatiesApiPluginConfiguration: 'Notificaties API plugin',
            notificatiesApiPluginConfigurationTooltip:
                'Selecteer de Notificaties API plugin. Wanneer de selectiebox leeg us, zal de notificatie API plugin eerst aangemaakt moeten worden.',
            objectManagementConfiguration: 'Object management configuratie',
            objectManagementConfigurationTooltip:
                'Selecteer de gewenste object management configuratie. Wanneer de selectiebox leeg is, zal de object management configuratie eerst aangemaakt moeten worden.',
            'create-externe-klanttaak': 'Externe Klanttaak aanmaken',
            'complete-externe-klanttaak': 'Externe Klanttaak afronden',
            formType: 'Formuliertype',
            formTypeTooltip:
                'Kies hier of het te tonen formulier afomstig moet zijn van een ingestelde definitie, of van een externe URL.',
            id: 'Formulierdefinitie',
            url: 'URL',
            formTypeId: 'Formulier ID',
            formTypeIdTooltip: 'Het ID van het formulier dat getoond moet worden',
            formTypeUrl: 'Formulier URL',
            formTypeUrlTooltip: 'Een URL die wijst naar het formulier dat getoond moet worden',
            sendData: 'Taakgegevens voor de ontvanger',
            sendDataTooltip:
                "Voor hier sleutels en waarden in voor data die verstuurd moet worden naar de Objecten API. De sleutel is hier de sleutel van het Form.IO-veld dat gevuld moet worden (bijvoorbeeld 'firstName'). De waarde wijst naar de data waarmee dit veld gevuld moet worden (bijvoorbeeld 'doc:/customer/firstName').",
            receiveData: 'Ingevulde gegevens door de ontvanger',
            receiveDataTooltip:
                "Voor hier sleutels en waarden in voor data die ontvangen moet worden van de Objecten API. De sleutel is hier de locatie waar de data opgeslagen moet worden (bijvoorbeeld 'doc:/customer/signedAgreement'). De waarde wijst naar de sleutel van het Form.IO-veld waar de data vandaan moet komen (bijvoorbeeld '/signedAgreement').",
            taakReceiver: 'Ontvanger',
            taakReceiverTooltip: 'Bepaal hier bij wie de data van de afgeronde taak terecht moet komen.',
            zaakInitiator: 'Zaak-initiator',
            other: 'Anders',
            otherReceiver: 'Andere ontvanger',
            otherReceiverTooltip:
                'U heeft de optie geselecteerd voor een andere ontvanger. Selecteer hier welk type dit moet zijn.',
            kvk: 'KVK-nummer',
            bsn: 'Burgerservicenummer (BSN)',
            kvkTooltip: 'Het KVK-nummer van de gewenste ontvanger.',
            bsnTooltip: 'Het Burgerservicenummer (BSN) van de gewenste ontvanger.',
            finalizerProcess: 'Verwerkingsproces',
            finalizerProcessTooltip:
                'Het proces dat een afgeronde klanttaak verwerkt.',
            identificationKey: 'Identificatiesleutel',
            identificationKeyTooltip:
                "De ingevoerde sleutel bepaalt hoe de ontvanger wordt geïdentificeerd. Geldige voorbeelden zijn 'bsn' of 'kvk'.",
            identificationValue: 'Identificatiewaarde',
            identificationValueTooltip:
                "De waarde waarmee de ontvanger wordt geïdentificeerd. Wanneer er bijvoorbeeld in het veld 'Identificatiesleutel' de waarde 'bsn' is ingevoerd, kan er in dit veld een burgerservicenummer worden ingevoerd (bijvoorbeeld 558099476).",
            verloopDurationInDays: 'Verlooptijd taak in dagen',
            verloopDurationInDaysTooltip:
                'Het aantal dagen na aanmaken van een taak dat deze verloopt. Deze wordt alleen ingesteld voor de externe klanttaak, niet in het BPMN proces.',
            pluginVersion: 'Externe Klanttaak versie',
            pluginVersionTooltip:
                'De patroon versie dat word gebruikt bij het aanmaken en verwerken van externe klanttaken.',
            unsupportedVersionMessage:
                'Deze actie is niet gebruikbaar met de gekozen Externe Klanttaak plugin instantie.',
            zaak: 'Zaak',
            product: 'Product',
            'toggle.ja': 'Ja',
            'toggle.nee': 'Nee',
            taakSoort: 'Klanttaak type',
            taakSoortTooltip:
                'Het te tonen type van de klanttaak voor de gebruiker. Dit wijst aan wat voor een interactie de gebruiker zal krijgen.',
            ogonebetaling: 'Ogone betaling',
            ogoneBedrag: 'Bedrag',
            ogoneBedragTooltip: 'Het te betalen bedrag.',
            ogoneBetaalkenmerk: 'Betalingskenmerk',
            ogoneBetaalkenmerkTooltip: 'Een verwijzing voor de betalings voorkeur',
            ogonePspid: 'Betalings aanbieder ID',
            ogonePspidTooltip:
                'De ID van aanbieder van de betaling. Zie Ogone documentatie voor meer informatie.',
            taakUrl: 'Klanttaak URL',
            taakUrlTooltip: 'Een URL die naar iets verwijst.',
            portaalformulier: 'Portaalformulier',
            portaalformulierSoort: 'Portaalformulier referentietype',
            portaalformulierSoortTooltip:
                'Kies het referentietype. Dit kan een formulier-ID zijn van een formulierdefinitie die aanwezig is in de verbonden portal, of een externe URL naar een object dat de formulierdefinitie bevat.',
            portaalformulierValue: 'Portaalformulier referentie',
            portaalformulierValueTooltip: 'De referentie van de weer te geven formulierdefinitie.',
            portaalformulierDataTooltip:
                'De invoergegevenstoewijzing die definieert welke informatie beschikbaar moet worden gemaakt in het portaalformulier en op welke pad.',
            portaalformulierDataKey: 'Bron van invoer',
            portaalformulierDataValue: 'Formulier invoer data pad',
            verzondenDataMappingTooltip:
                'De gedefinieerde gegevens bepalen waar en wat er van een ingediend taakformulier moet worden opgeslagen.',
            verzondenDataKey: 'Uitvoer bestemming',
            verzondenDataValue: 'Pad van de vaarde binnen de verzonden portaalformilier data.',
            koppelingVanToepassing: 'Heeft relatie',
            koppelingRegistratie: 'Relatie type',
            koppelingRegistratieTooltip: 'Deze bepaalt met welk type entiteit de taak een relatie heeft.',
            koppelingUuid: 'Relatie identificatie',
            koppelingUuidTooltip: 'De unieke identificatie (UUID) van de zaak of het product',
            verloopdatumVanToepassing: 'Heeft verloopdatum',
            verloopdatum: 'Verloopdatum',
            verloopdatumTooltip: 'Vervaldatum voor de klanttaak.',
            objectManagementConfigurationWarning:
                'Zorg ervoor dat de Object Management configuratie compatibel is met de geselecteerde Externe Klanttaak versie!',
            bewaarIngediendeGegevens: 'Bewaar ingediende gegevens (alleen bij portaalformulier)?',
            koppelDocumenten: 'Koppel geüploade documenten aan Zaak (alleen bij portaalformulier)?',
            documentPadenPad: 'Documenten paden pad',
            documentPadenPadTooltip: 'Het pad bidden de verzonden portaalformulier data die upload component paden bevat.',
            storeResultingUrlVariableName: 'Bewaar resulterende Klanttaak URL?',
            resultingKlanttaakObjectUrlVariable: 'Naam van de processvariabele'
        },
        en: {
            title: 'External user task',
            description: 'A plugin to create and handle External User Tasks.',
            configurationTitle: 'Configuration name',
            configurationTitleTooltip:
                'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
            notificatiesApiPluginConfiguration: 'Notificaties API plugin',
            notificatiesApiPluginConfigurationTooltip:
                'Select the Notificaties API plugin. If the selection box remains empty, the Notificaties API plugin will first have to be created.',
            objectManagementConfiguration: 'Object management configuration',
            objectManagementConfigurationTooltip:
                'Select the object management configuration. If the selection box remains empty, the object management configuration will first have to be created.',
            'create-externe-klanttaak': 'Create portal task',
            'complete-externe-klanttaak': 'Complete portal task',
            formType: 'Form type',
            formTypeTooltip:
                'Choose here whether the form to be displayed should come from a set definition or from an external URL.',
            id: 'Form definition',
            url: 'URL',
            formTypeId: 'Formulier ID',
            formTypeIdTooltip: 'Het ID van het formulier dat getoond moet worden',
            formTypeUrl: 'Formulier URL',
            formTypeUrlTooltip: 'Een URL die wijst naar het formulier dat getoond moet worden',
            sendData: 'Task data for the recipient',
            sendDataTooltip:
                "Enter keys and values here for data to be sent to the Objecten API. The key here is the key of the Form.IO field to be populated (e.g. 'firstName'). The value points to the data with which this field must be filled (e.g. 'doc:/customer/firstName').",
            receiveData: 'Information entered by the recipient',
            receiveDataTooltip:
                "Enter keys and values here for data to be received from the Objecten API. The key here is the location where the data should be stored (e.g. 'doc:/customer/signedAgreement'). The value points to the key of the Form.IO field where the data should come from (e.g. '/signedAgreement').",
            taakReceiver: 'Receiver',
            taakReceiverTooltip: 'Determine here who should receive the data of the completed task.',
            zaakInitiator: 'Case initiator',
            other: 'Other',
            otherReceiver: 'Other receiver',
            otherReceiverTooltip:
                'You have selected the option for another receiver. Select here which type this should be.',
            kvk: 'KVK number',
            bsn: 'Citizen service number (BSN)',
            kvkTooltip: 'The KVK number of the desired receiver.',
            bsnTooltip: 'The Citizen service number (BSN) of the desired receiver',
            completeTaakProcess: 'Process to complete Externe Klanttaak',
            completeTaakProcessTooltip:
                'The process that should handle the uploaded documents in the portal.',
            identificationKey: 'Identification key',
            identificationKeyTooltip:
                "The key entered determines how the recipient is identified. Valid examples are 'bsn' or 'kvk'.",
            identificationValue: 'Identification value',
            identificationValueTooltip:
                "The value that identifies the recipient. For example, if the value 'bsn' is entered in the 'Identification key' field, a citizen service number can be entered in this field (for example 558099476).",
            verloopDurationInDays: 'Number of days for the task to expire',
            verloopDurationInDaysTooltip:
                'The number of days from the creation time until the task expires. This will only be used in the portal task. The BPMN due date needs to be configured separately.',
            taakVersion: 'Portal task version',
            taakVersionTooltip:
                'The version of the portal task to use when creating and modifying portal task objects.',
            unsupportedVersionMessage:
                'This action can not be used with the version of the chosen portal task plugin.',
            zaak: 'Case',
            product: 'Product',
            'toggle.ja': 'Yes',
            'toggle.nee': 'No',
            taakSoort: 'Task type',
            taakSoortToolTip:
                'The type of the task to show user. This dictates what sort of interaction the receiver will get.',
            ogonebetaling: 'Ogone payment',
            ogoneBedrag: 'Payment amount',
            ogoneBedragTooltip: 'The amount that the user has to pay in this payment task.',
            ogoneBetaalkenmerk: 'Payment reference',
            ogoneBetaalkenmerkTooltip: 'A reference to identify the payment.',
            ogonePspid: 'Payment service provider ID',
            ogonePspidTooltip: 'The payment service provider ID to be used with this payment.',
            taakUrl: 'Task URL',
            taakUrlTooltip: 'A URL that contains the task that the user must do',
            portaalformulier: 'Portal form',
            portaalformulierSoort: 'Portal form reference type',
            portaalformulierSoortTooltip:
                'Choose the reference type. Can be either a form id of a form definition that is present in the connected Portal or an External URL towards an Object containing the form definition.',
            portaalformulierValue: 'Portal form reference',
            portaalformulierValueTooltip: 'The reference of the to be displayed form definition.',
            portaalformulierDataTooltip:
                'The input data mapping that defines where and what information should be made available in the task form.',
            portaalformulierDataKey: 'Source value or value resolver pointer',
            portaalformulierDataValue: 'Target form data prefill path',
            verzondenDataMappingTooltip:
                'The output data mapping that defines where and what from a submitted portal form task should be stored.',
            verzondenDataKey: 'Output target',
            verzondenDataValue: 'Path of the value in the submission',
            koppelingVanToepassing: 'Has relation',
            koppelingRegistratie: 'Relation type',
            koppelingRegistratieTooltip:
                'This determines which type of entity this task has a relation to.',
            koppelingUuid: 'Relation identifier',
            koppelingUuidTooltip: 'The unique identifier of the zaak or product',
            verloopdatumVanToepassing: 'Has due date',
            verloopdatum: 'Due date',
            verloopdatumTooltip: 'The date that the task is due for.',
            objectManagementConfigurationWarning:
                'Please make sure to select an Object Management configuration that is compatible with the chosen Task Version!',
            bewaarIngediendeGegevens: 'Store submitted data (in case of portal form user task)?',
            koppelDocumenten: 'Link uploaded document to Case (in case of portal form user task)?',
            documentPadenPad: 'Path to document paths',
            documentPadenPadTooltip: 'The path to an array containing document upload component paths.',
            storeResultingUrlVariableName: 'Store resulting url reference?',
            resultingKlanttaakObjectUrlVariable: 'Target process variable name'
        },
        de: {
            title: 'Externe Kundenaufgabe',
            description:
                'Ein Plugin zum Erstellen und Bearbeiten externer Kundenaufgaben.',
        },
    },
};

export {externeKlanttaakPluginSpecification};