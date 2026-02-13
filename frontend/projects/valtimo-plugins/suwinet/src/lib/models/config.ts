/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {PluginConfigurationData} from '@valtimo/plugin';

export interface SuwinetPluginConfig extends PluginConfigurationData {
    authenticationPluginConfiguration: string;
    baseUrl: string;
    connectionTimeout: number;
    receiveTimeout: number;
}

export interface BaseActionConfig {
    suffix: string;
}

export interface BrpPersoonInfoConfig extends BaseActionConfig {
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface BrpPartnerInfoConfig extends BaseActionConfig {
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface BijstandsRegelingenInfoConfig extends BaseActionConfig {
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface BrpKinderenInfoConfig extends BaseActionConfig {
    kinderenBsns: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}
export interface DUOPersoonsInfoComponent extends BaseActionConfig{
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface DUOStudiefinancieringInfoComponent extends BaseActionConfig{
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface KadasterobjectenConfig extends BaseActionConfig {
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface RdwVoertuigenConfig extends BaseActionConfig {
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface SVBPersoonsInfoComponent extends BaseActionConfig {
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

export interface UwvInkomstenPersoonInfoConfig extends BaseActionConfig {
    bsn: string;
    dynamicProperties: Array<string>;
    resultProcessVariableName: string;
}

