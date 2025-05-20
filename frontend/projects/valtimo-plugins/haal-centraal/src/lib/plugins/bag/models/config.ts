import {PluginConfigurationData} from '@valtimo/plugin';

interface Config extends PluginConfigurationData {
    bagBaseUrl: string;
}

interface OphalenAdresseerbaarObjectIdentificatie {
    postcode: string,
    huisnummer: string,
    huisnummertoevoeging: string,
    huisletter: string,
    exacteMatch: boolean,
    resultProcessVariableName: string;
}
export {Config, OphalenAdresseerbaarObjectIdentificatie};
