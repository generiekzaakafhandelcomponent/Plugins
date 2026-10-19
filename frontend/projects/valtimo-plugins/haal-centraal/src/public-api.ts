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
 *
 */

/*
 * Public API Surface of haal-centraal-brp
 */

export * from './lib/plugins/brp/models';
export * from './lib/plugins/brp/haal-centraal-brp.plugin.module';
export * from './lib/plugins/brp/haal-centraal-brp.plugin.specification';
export * from './lib/plugins/brp/components/haal-centraal-brp-bewoningen/haal-centraal-brp-bewoningen.component';
export *
    from './lib/plugins/brp/components/haal-centraal-brp-plugin-configuration/haalcentraal-brp-plugin-configuration.component';

/*
    * Public API Surface of haal-centraal-bag
 */

export * from './lib/plugins/bag/models';
export * from './lib/plugins/bag/haal-centraal-bag-plugin.module';
export * from './lib/plugins/bag/haal-centraal-bag-plugin.specification';
export * from './lib/plugins/bag/components/hc-bag-ophalen-adresseerbaar-object-identificatie/hc-bag-ophalen-adresseerbaar-object-identificatie.component';
export * from './lib/plugins/bag/components/hc-bag-plugin-configuration/haal-centraal-bag-plugin-configuration.component';
export * from './lib/plugins/bag/components/hc-bag-ophalen-adresseerbaar-object-identificatie/hc-bag-ophalen-adresseerbaar-object-identificatie.component';

/*
 * Public API Surface of haal-centraal-brp-personen
 */

export * from './lib/plugins/brp-personen/models';
export * from './lib/plugins/brp-personen/haal-centraal-brp-personen-plugin.module';
export * from './lib/plugins/brp-personen/haal-centraal-brp-personen-plugin.specification';
export * from './lib/plugins/brp-personen/components/brp-personen-base-action.component';
export * from './lib/plugins/brp-personen/components/brp-personen-plugin-configuration/brp-personen-plugin-configuration.component';
export * from './lib/plugins/brp-personen/components/brp-personen-raadpleeg-bsn/brp-personen-raadpleeg-bsn.component';
export * from './lib/plugins/brp-personen/components/brp-personen-zoek-geslachtsnaam-geboortedatum/brp-personen-zoek-geslachtsnaam-geboortedatum.component';
export * from './lib/plugins/brp-personen/components/brp-personen-zoek-naam-gemeente/brp-personen-zoek-naam-gemeente.component';
export * from './lib/plugins/brp-personen/components/brp-personen-zoek-postcode-huisnummer/brp-personen-zoek-postcode-huisnummer.component';
export * from './lib/plugins/brp-personen/components/brp-personen-zoek-straat-huisnummer-gemeente/brp-personen-zoek-straat-huisnummer-gemeente.component';
export * from './lib/plugins/brp-personen/components/brp-personen-zoek-nummeraanduiding/brp-personen-zoek-nummeraanduiding.component';
export * from './lib/plugins/brp-personen/components/brp-personen-zoek-adresseerbaar-object/brp-personen-zoek-adresseerbaar-object.component';
