/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

import {PluginConfigurationData} from '@valtimo/plugin';

interface PluginConfig extends PluginConfigurationData {
  notificatiesApiPluginConfiguration: string;
  objectManagementConfigurationId: string;
  finalizerProcess: string;
}

interface DelegateTaskConfig {
  betrokkeneIdentifier: string;
  levelOfAssurance: string;
  formulierUri: string;
  formulierDataMapping?: DataBinding[] | null;
  toelichting?: string | null;
  koppelingRegistratie?: Registratie | null;
  koppelingIdentifier?: string | null;
  verloopdatum?: Date | null;
}

interface CompleteDelegatedTaskConfig {
  bewaarIngediendeGegevens: boolean;
  ontvangenDataMapping?: DataBinding[] | null;
  koppelDocumenten: boolean;
  padNaarDocumenten?: string | null;
}

interface DataBinding {
  key: string;
  value: string;
}

enum LevelOfAssurance {
  PASSWORD_PROTECTED_TRANSPORT = 'Password protected transport',
  MOBILE_TWO_FACTOR_CONTRACT = 'Mobile two factor contract',
  SMARTCARD = 'Smartcard',
  SMARTCARD_PKI = 'Smartcard PKI'
}

enum Registratie {
  ZAAK = 'Zaak',
  PRODUCT = 'Product'
}

export {
  PluginConfig,
  DelegateTaskConfig,
  DataBinding,
  CompleteDelegatedTaskConfig,
  LevelOfAssurance,
  Registratie
};
