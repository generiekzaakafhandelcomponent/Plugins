import {PluginConfiguration} from '@valtimo/plugin';

export interface GetContactMomentsByPartijUuidConfig extends PluginConfiguration {
    partijUuid: string;
    resultPvName: string;
}
