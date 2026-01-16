import {PluginConfiguration} from '@valtimo/plugin';

export interface GetContactMomentsByBsnConfig extends PluginConfiguration {
    bsn: string;
    resultPvName: string;
}
