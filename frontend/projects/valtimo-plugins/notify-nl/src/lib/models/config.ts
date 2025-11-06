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

interface NotifyNlConfig extends PluginConfigurationData {
  valtimoUrl: string;
  notifyUrl: string;
  apiKey: string;
}

interface SendSmsConfig {
  phoneNumber: string;
  templateId: string;
}

interface SendEmailConfig {
  email: string;
  templateId: string;
}

interface SendLetterConfig {
    address: string;
    templateId: string;
}

interface GetMessageConfig {
    notificationId: string;
}

interface GetTemplateConfig {
    templateId: string;
}

interface GetAllTemplatesConfig {
    templateType: string;
}

export {NotifyNlConfig, SendSmsConfig, SendEmailConfig, GetMessageConfig, GetTemplateConfig, GetAllTemplatesConfig, SendLetterConfig};
