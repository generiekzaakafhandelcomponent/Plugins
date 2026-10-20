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

/**
 * Keep these in lockstep with `ReceiveMessageProperties` in Kotlin. The backend treats a
 * value it does not recognise as "no filter", so a value that drifts here surfaces as a
 * process that fires too often rather than as an error on save.
 */
const THREAD_SCOPES = {
  ANY: 'ANY',
  THREAD_STARTS_ONLY: 'THREAD_STARTS_ONLY',
  THREAD_REPLIES_ONLY: 'THREAD_REPLIES_ONLY',
} as const;

type ThreadScope = (typeof THREAD_SCOPES)[keyof typeof THREAD_SCOPES];

interface SlackConfig extends PluginConfigurationData {
  url: string;
  token: string;
  messagesPerPage?: number;
  maxPagesPerPoll?: number;
  maxThreadsPerPoll?: number;
  initialLookbackMinutes?: number;
}

interface PostMessageConfig {
  channel: string;
  message: string;
  threadTs?: string;
}

interface PostMessageWithFileConfig {
  channels: string;
  message?: string;
  fileName?: string;
}

/**
 * Action properties of the `receive-message` process link. Only the channel is required —
 * the rest are optional filters, and all of them are AND-ed.
 */
interface ReceiveMessageConfig {
  channel: string;
  messageContains?: string;
  userId?: string;
  includeBotMessages?: boolean;
  threadScope?: ThreadScope;
}

export {
  PostMessageConfig,
  PostMessageWithFileConfig,
  ReceiveMessageConfig,
  SlackConfig,
  THREAD_SCOPES,
  ThreadScope,
};
