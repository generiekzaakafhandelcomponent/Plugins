import {PluginConfigurationData} from "@valtimo/plugin";

export interface PrepareContentWithTextTemplate extends PluginConfigurationData {
    xentialContentId: string;
    firstTemplateGroupId: string;
    secondTemplateGroupId: string;
    thirdTemplateGroupId: string;
    fileFormat: FileFormat;
    eventMessageName: string;
}

type FileFormat = 'WORD' | 'PDF';
