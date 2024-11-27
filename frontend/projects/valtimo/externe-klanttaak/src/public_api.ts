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

/*
 * Public API Surface of externe-klanttaak
 */

export * from './lib/models';
export * from './lib/externe-klanttaak-plugin.module';
export * from './lib/externe-klanttaak-plugin.specification';
export * from './lib/components/externe-klanttaak-configuration/externe-klanttaak-configuration.component';
export * from './lib/components/create-externe-klanttaak/create-externe-klanttaak.component';
export * from './lib/components/complete-externe-klanttaak/complete-externe-klanttaak.component';

export * from './lib/components/versions/v1x1x0/models';
export * from './lib/components/versions/v1x1x0/components/create-externe-klanttaak-v1x1x0-form/create-externe-klanttaak-v1x1x0-form.component';
export * from './lib/components/versions/v1x1x0/components/complete-externe-klanttaak-v1x1x0-form/complete-externe-klanttaak-v1x1x0-form.component';