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

import {ExterneKlanttaakVersion} from "../../../../models";

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

interface CreateExterneKlanttaakConfig {
  externeKlanttaakVersion: ExterneKlanttaakVersion;
  [key: string]: any;
}

interface CreateExterneKlanttaakV1x1x0Config extends CreateExterneKlanttaakConfig {
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
  ReceiverSource,
  OtherReceiverSoort,
  TaakSoort,
  FormulierSoort,
  TaakKoppelingRegistratie,
  CreateExterneKlanttaakConfig,
  CreateExterneKlanttaakV1x1x0Config,
};