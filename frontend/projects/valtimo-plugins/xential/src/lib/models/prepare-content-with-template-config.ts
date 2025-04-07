import {PluginConfigurationData} from "@valtimo/plugin";

export interface PrepareContentWithTextTemplate extends PluginConfigurationData {
    xentialContentId: string;
    firstTemplateGroupId: string;
    secondTemplateGroupId: string;
    thirdTemplateGroupId: string;
    fileFormat: FileFormat;
    documentId: string;
    eventMessageName: string;
    textTemplateId: string;
}

type FileFormat = 'WORD' | 'PDF';
