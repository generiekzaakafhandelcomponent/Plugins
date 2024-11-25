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


enum TaakVersion {
  V1 = 'V1',
  V2 = 'V2',
}

enum TaakSoort {
  URL = 'url',
  PORTAALFORMULIER = 'portaalformulier',
  OGONEBETALING = 'ogonebetaling',
}

enum FormulierSoort {
  URL = 'url',
  ID = 'id',
}

enum TaakKoppelingRegistratie {
  ZAAK = 'zaak',
  PRODUCT = 'product',
}

enum ReceiverSource {
  ZAAKINITIATOR = 'zaakInitiator',
  OTHER = 'other',
}

enum OtherReceiverSoort {
  BSN = 'bsn',
  KVK = 'kvk',
}

interface CreatePortalTaskConfig {
  taakVersion: TaakVersion;
  config: CreateTaskActionConfig;
}

type FormType = 'id' | 'url';

type Receiver = 'zaakInitiator' | 'other';

type OtherReceiver = 'kvk' | 'bsn';

interface CreateTaskActionConfig {}

interface CreateTaskV1Config extends CreateTaskActionConfig {
  formType: FormType;
  formTypeId?: string;
  formTypeUrl?: string;
  sendData: Array<{key: string; value: string}>;
  receiveData: Array<{key: string; value: string}>;
  receiver: Receiver;
  identificationKey?: string;
  identificationValue?: string;
  verloopDurationInDays?: number;
}

interface CreateTaskV2Config extends CreateTaskActionConfig {
  taakSoort: TaakSoort;
  taakUrl?: string;
  portaalformulierSoort?: FormulierSoort;
  portaalformulierValue?: string;
  portaalformulierData?: Array<{key: string; value: string}>;
  portaalformulierVerzondenData?: Array<{key: string; value: string}>;
  ogoneBedrag?: number;
  ogoneBetaalkenmerk?: string;
  ogonePspid?: string;
  receiver: ReceiverSource;
  identificationKey?: OtherReceiverSoort;
  identificationValue?: string;
  verloopdatum?: string;
  koppelingRegistratie?: TaakKoppelingRegistratie;
  koppelingUuid?: string;
}

export {
  FormType,
  Receiver,
  ReceiverSource,
  OtherReceiverSoort,
  OtherReceiver,
  TaakVersion,
  TaakSoort,
  FormulierSoort,
  TaakKoppelingRegistratie,
  CreatePortalTaskConfig,
  CreateTaskActionConfig,
  CreateTaskV1Config,
  CreateTaskV2Config,
};