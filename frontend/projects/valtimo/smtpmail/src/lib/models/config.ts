/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

interface SmtpMailConfig extends PluginConfigurationData {
    host: string;
    port: string;
    username: string;
    password: string;
    protocol: string;
    debug: string;
    auth: string;
    startTlsEnable: string;
}

interface SendMailConfig {
    sender: string;
    recipients: string;
    cc: string;
    bcc: string;
    subject: string;
    contentId: string;
    attachmentIds: string;
}

export {
    SmtpMailConfig,
    SendMailConfig
};
