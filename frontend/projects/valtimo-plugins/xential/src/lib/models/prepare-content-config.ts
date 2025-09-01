import {PluginConfigurationData} from "@valtimo/plugin";

export interface PrepareContent extends PluginConfigurationData {
    xentialDocumentPropertiesId: string;
    firstTemplateGroupId: string;
    secondTemplateGroupId: string;
    thirdTemplateGroupId: string;
    documentFilename: string;
    fileFormat: FileFormat;
    informationObjectType: string;
    eventMessageName: string;
}

type FileFormat = 'WORD' | 'PDF';
