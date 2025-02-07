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

const OLLAMA_PLUGIN_LOGO_BASE64 =
  'data:image/png;base64,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';

export {OLLAMA_PLUGIN_LOGO_BASE64};
