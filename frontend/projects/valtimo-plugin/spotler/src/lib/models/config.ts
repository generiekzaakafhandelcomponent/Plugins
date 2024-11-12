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

interface SpotlerPluginConfig extends PluginConfigurationData {
    clientId: string;
    accountId: string;
    clientSecret: string;
}

interface SendMailActionConfig {
    subject: string;
    senderEmail: string;
    senderName: string;
    recipients: Array<Recipient>
    mailTemplateIdentifier: string;
    placeholders: Array<Placeholder>;
}

interface Recipient {
    email: string;
    name: string;
    type: RecipientType;
}

enum RecipientType {
    TO, CC, BCC
}

interface Placeholder {
    key: String,
    value: String
}

export {SpotlerPluginConfig, SendMailActionConfig, Recipient};
