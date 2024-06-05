/*
 * Copyright 2015-2020 Ritense BV, the Netherlands.
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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {NgxLoggerLevel} from 'ngx-logger';
import {ROLE_ADMIN, ROLE_DEVELOPER, ROLE_USER, ValtimoConfig, UploadProvider, IncludeFunction} from '@valtimo/config';
import {authenticationKeycloak} from './auth/keycloak-config.dev';
import {LOGO_BASE_64} from './logo';

const defaultDefinitionColumns = [
  {
    propertyName: 'createdOn',
    translationKey: 'createdOn',
    sortable: true,
    viewType: 'date',
    default: true
  },
  {
    propertyName: 'modifiedOn',
    translationKey: 'lastModified',
    sortable: true,
    viewType: 'date'
  }
];

export const environment: ValtimoConfig = {
  logoSvgBase64: LOGO_BASE_64,
  production: false,
  initializers: [
  ],
  authentication: authenticationKeycloak,
  menu: {
    menuItems: [
      {roles: [ROLE_USER], link: ['/'], title: 'Dashboard', iconClass: 'icon mdi mdi-view-dashboard', sequence: 0},
      {roles: [ROLE_USER], title: 'Dossiers', iconClass: 'icon mdi mdi-layers', sequence: 1, children: []},
      {roles: [ROLE_USER], link: ['/tasks'], title: 'Tasks', iconClass: 'icon mdi mdi-check-all', sequence: 2},
      {roles: [ROLE_USER], link: ['/analysis'], title: 'Analysis', iconClass: 'icon mdi mdi-chart-bar', sequence: 3},
      {
        roles: [ROLE_ADMIN], title: 'Admin', iconClass: 'icon mdi mdi-tune', sequence: 4, children: [
          {title: 'Basics', textClass: 'text-dark font-weight-bold c-default', sequence: 1},
          {link: ['/processes'], title: 'Processes', sequence: 2},
          {link: ['/form-management'], title: 'Forms', sequence: 3},
          {link: ['/decision-tables'], title: 'Decision tables', sequence: 4},
          {link: ['/dossier-management'], title: 'Dossiers', sequence: 5},
          {link: ['/object-management'], title: 'Objects', sequence: 6},
          {link: ['/connectors'], title: 'Connectors', sequence: 7},
          {link: ['/plugins'], title: 'Plugins', sequence: 8},
          {link: ['/form-links'], title: 'Form links', sequence: 9},
          {link: ['/process-links'], title: 'Form links Plugin', sequence: 10},
          {title: 'A&E', textClass: 'text-dark font-weight-bold c-default', sequence: 11},
          {link: ['/contexts'], title: 'Contexts', sequence: 12},
          {link: ['/users'], title: 'Users', sequence: 13},
          {link: ['/entitlements'], title: 'Entitlements', sequence: 14},
          {title: 'Other', textClass: 'text-dark font-weight-bold c-default', sequence: 15},
          {link: ['/process-migration'], title: 'Process migration', sequence: 16},
          {link: ['/choice-fields'], title: 'Choice fields', sequence: 17},
        ]
      },
      {
        roles: [ROLE_DEVELOPER], title: 'Development', iconClass: 'icon mdi mdi-code', sequence: 5, children: [
          {link: ['/swagger'], title: 'Swagger', iconClass: 'icon mdi mdi-dot-circle', sequence: 1}
        ]
      }
    ]
  },
  whitelistedDomains: ['localhost:4200'],
  mockApi: {
    endpointUri: '/mock-api/',
  },
  valtimoApi: {
    endpointUri: '/api/',
  },
  swagger: {
    endpointUri: '/v2/api-docs',
  },
  logger: {
    level: NgxLoggerLevel.TRACE
  },
  definitions: {
    dossiers: []
  },
  openZaak: {
    catalogus: '00000000-0000-0000-0000-000000000000',
  },
  uploadProvider: UploadProvider.S3,
  caseFileSizeUploadLimitMB: 100,
  defaultDefinitionTable: defaultDefinitionColumns,
  customDefinitionTables: {  },
  featureToggles: {
    disableCaseCount: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
