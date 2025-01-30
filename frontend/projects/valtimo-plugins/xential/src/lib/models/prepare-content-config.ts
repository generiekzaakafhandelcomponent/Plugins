import {PluginConfigurationData} from "@valtimo/plugin";

export interface PrepareContentTemplate extends PluginConfigurationData {
    xentialContentId: string;
    templateId: string;
    gebruikersId: string;
    fileFormat: FileFormat;
    documentId: string;
    eventMessageName: string;
    verzendAdresData: Array<{key: string; value: string}>;
    colofonData: Array<{key: string; value: string}>;
    documentDetailsData: Array<{key: string; value: string}>;
}

type FileFormat = 'WORD' | 'PDF';
