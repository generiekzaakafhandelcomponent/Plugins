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

import { BrowserModule } from "@angular/platform-browser";
import { Injector, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LayoutModule, TranslationManagementModule } from "@valtimo/layout";
import { TaskModule } from "@valtimo/task";
import { environment } from "../environments/environment";
import { SecurityModule } from "@valtimo/security";
import {
  BpmnJsDiagramModule,
  CardModule,
  enableCustomFormioComponents,
  MenuModule,
  registerFormioFileSelectorComponent,
  registerFormioUploadComponent,
  registerFormioValueResolverSelectorComponent,
  WidgetModule,
  ValuePathSelectorComponent,
} from "@valtimo/components";
import {
  CASE_TAB_TOKEN,
  DefaultTabs,
  DossierDetailTabAuditComponent,
  DossierDetailTabDocumentsComponent,
  DossierDetailTabProgressComponent,
  DossierDetailTabSummaryComponent,
  DossierModule,
} from "@valtimo/dossier";
import { ProcessModule } from "@valtimo/process";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DocumentModule } from "@valtimo/document";
import { AccountModule } from "@valtimo/account";
import { ChoiceFieldModule } from "@valtimo/choice-field";
import { ResourceModule } from "@valtimo/resource";
import { FormModule } from "@valtimo/form";
import { SwaggerModule } from "@valtimo/swagger";
import { AnalyseModule } from "@valtimo/analyse";
import { ProcessManagementModule } from "@valtimo/process-management";
import { DecisionModule } from "@valtimo/decision";
import { MilestoneModule } from "@valtimo/milestone";
import { LoggerModule } from "ngx-logger";
import { FormManagementModule } from "@valtimo/form-management";
import { MigrationModule } from "@valtimo/migration";
import { DossierManagementModule } from "@valtimo/dossier-management";
import { BootstrapModule } from "@valtimo/bootstrap";
import {
  ConfigModule,
  ConfigService,
  CustomMultiTranslateHttpLoaderFactory,
  LocalizationService,
} from "@valtimo/config";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { PluginManagementModule } from "@valtimo/plugin-management";
import { AccessControlManagementModule } from "@valtimo/access-control-management";
import {
  CatalogiApiPluginModule,
  catalogiApiPluginSpecification,
  DocumentenApiPluginModule,
  documentenApiPluginSpecification,
  OpenZaakPluginModule,
  openZaakPluginSpecification,
  ZakenApiPluginModule,
  zakenApiPluginSpecification,
  ObjectenApiPluginModule,
  objectenApiPluginSpecification,
  ObjectTokenAuthenticationPluginModule,
  objectTokenAuthenticationPluginSpecification,
  ObjecttypenApiPluginModule,
  objecttypenApiPluginSpecification,
  PLUGINS_TOKEN,
} from "@valtimo/plugin";
import { ZgwModule } from "@valtimo/zgw";
import { TaskManagementModule } from "@valtimo/task-management";
import { ProcessLinkModule } from "@valtimo/process-link";
import { ObjectManagementModule } from "@valtimo/object-management";
import { ObjectModule } from "@valtimo/object";

import {
  ExterneKlanttaakPluginModule,
  externeKlanttaakPluginSpecification,
} from "@valtimo-plugins/externe-klanttaak";
import {
  MailTemplatePluginModule,
  mailTemplatePluginSpecification,
  TextTemplatePluginModule,
  textTemplatePluginSpecification,
} from "@valtimo-plugins/freemarker";
import {
  NotifyNlPluginModule,
  notifyNlPluginSpecification,
} from "@valtimo-plugins/notify-nl";
import {
  ObjectManagementPluginModule,
  objectManagementPluginSpecification,
} from "@valtimo-plugins/object-management";
import {
  OpenKlantPluginModule,
  openKlantPluginSpecification,
  KlantcontactTabComponent,
} from "@valtimo-plugins/openklant";
import {
  PublictaskPluginModule,
  publictaskPluginSpecification,
} from "@valtimo-plugins/publictask";
import {
  RotterdamOracleEbsPluginModule,
  rotterdamOracleEbsPluginSpecification,
} from "@valtimo-plugins/rotterdam-oracle-ebs";
import {
  SlackPluginModule,
  slackPluginSpecification,
} from "@valtimo-plugins/slack";
import {
  SmtpMailPluginModule,
  smtpmailPluginSpecification,
} from "@valtimo-plugins/smtpmail";
import {
  SpotlerPluginModule,
  spotlerPluginSpecification,
} from "@valtimo-plugins/spotler";
import {
  SuwinetPluginModule,
  suwinetPluginSpecification,
} from "@valtimo-plugins/suwinet";
import {
  XentialPluginModule,
  XentialPluginSpecification,
} from "@valtimo-plugins/xential";
import {
  MtlsSslcontextPluginModule,
  mTlsSslcontextPluginSpecification,
} from "@valtimo-plugins/mtls-sslcontext";
import {
  ValtimoLlmPluginModule,
  valtimoLlmPluginSpecification,
} from "@valtimo-plugins/valtimo-llm";
import {
  HaalCentraalBrpAuthPluginModule,
  haalCentraalBrpAuthPluginSpecification,
} from "@valtimo-plugins/haal-centraal-auth";
import {
  HaalCentraalBrpPluginModule,
  haalCentraalBrpPluginSpecification,
} from "@valtimo-plugins/haal-centraal";
import { haalCentraalBagPluginSpecification } from "../../projects/valtimo-plugins/haal-centraal/src/lib/plugins/bag/haal-centraal-bag-plugin.specification";
import { HaalCentraalBagPluginModule } from "../../projects/valtimo-plugins/haal-centraal/src/lib/plugins/bag/haal-centraal-bag-plugin.module";

import { LoggingModule } from "@valtimo/logging";
import { DashboardModule } from "@valtimo/dashboard";
import { DashboardManagementModule } from "@valtimo/dashboard-management";
import {
  KvkPluginModule,
  kvkPluginSpecification,
} from "@valtimo-plugins/kvk-handelsregister";
import { ValtimoOcrPluginModule } from "../../projects/valtimo-plugins/valtimo-ocr/src/lib/valtimo-ocr-plugin-module";
import { valtimoOcrPluginSpecification } from "../../projects/valtimo-plugins/valtimo-ocr/src/lib/valtimo-ocr-plugin.specification";
import { ValtimoS2tPluginModule } from "../../projects/valtimo-plugins/valtimo-s2t/src/lib/valtimo-s2t-plugin-module";
import { valtimoS2tPluginSpecification } from "../../projects/valtimo-plugins/valtimo-s2t/src/lib/valtimo-s2t-plugin.specification";
import {
  DocumentSearchPluginModule,
  documentSearchPluginSpecification,
} from "@valtimo-plugins/document-search";
import { SamplePluginModule } from "../../projects/valtimo-plugins/sample-plugin/src/lib/sample-plugin.module";
import { samplePluginSpecification } from "../../projects/valtimo-plugins/sample-plugin/src/lib/sample-plugin.specification";
import { ValueMapperPluginModule } from "../../projects/valtimo-plugins/value-mapper/src/lib/value-mapper-plugin-module";
import { valueMapperPluginSpecification } from "../../projects/valtimo-plugins/value-mapper/src/lib/value-mapper-plugin.specification";
import { DocsysPluginModule } from "../../projects/valtimo-plugins/docsys/src/lib/docsys-plugin.module";
import { docsysPluginSpecification } from "../../projects/valtimo-plugins/docsys/src/lib/docsys-plugin.specification";
import { TokenAuthenticationPluginModule } from "../../projects/valtimo-plugins/token-authentication/src/lib/token-authentication-plugin.module";
import { tokenAuthenticationPluginSpecification } from "../../projects/valtimo-plugins/token-authentication/src/lib/token-authentication-plugin.specification";
import { SuwinetAuthPluginModule } from "../../projects/valtimo-plugins/suwinet-auth/src/lib/suwinet-auth-plugin.module";
import { suwinetAuthPluginSpecification } from "../../projects/valtimo-plugins/suwinet-auth/src/lib/suwinet-auth-plugin.specification";
import { SocratesPluginModule } from "../../projects/valtimo-plugins/socrates/src/lib/socrates-plugin.module";
import { socratesPluginSpecification } from "../../projects/valtimo-plugins/socrates/src/lib/socrates-plugin.specification";
import { ContactHistoryTabComponent } from "../../projects/valtimo-plugins/openklant/src/lib/tab/contact-history/components/contact-history-tab/contact-history-tab.component";

export function tabsFactory() {
  return new Map<string, object>([
    [DefaultTabs.summary, DossierDetailTabSummaryComponent],
    [DefaultTabs.progress, DossierDetailTabProgressComponent],
    [DefaultTabs.audit, DossierDetailTabAuditComponent],
    [DefaultTabs.documents, DossierDetailTabDocumentsComponent],
  ]);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    ValuePathSelectorComponent,
    MailTemplatePluginModule,
    TextTemplatePluginModule,
    PublictaskPluginModule,
    NotifyNlPluginModule,
    ObjectManagementPluginModule,
    ValtimoOcrPluginModule,
    ValtimoS2tPluginModule,
    MtlsSslcontextPluginModule,
    SlackPluginModule,
    ValtimoLlmPluginModule,
    HaalCentraalBrpPluginModule,
    HaalCentraalBagPluginModule,
    HaalCentraalBrpAuthPluginModule,
    SamplePluginModule,
    SmtpMailPluginModule,
    SpotlerPluginModule,
    SuwinetPluginModule,
    SuwinetAuthPluginModule,
    XentialPluginModule,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    CardModule,
    WidgetModule,
    BootstrapModule,
    ConfigModule.forRoot(environment),
    LoggerModule.forRoot(environment.logger),
    environment.authentication.module,
    SecurityModule,
    MenuModule,
    TaskModule,
    DossierModule.forRoot(tabsFactory),
    ProcessModule,
    BpmnJsDiagramModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentModule,
    AccountModule,
    ChoiceFieldModule,
    ResourceModule,
    FormModule,
    AnalyseModule,
    SwaggerModule,
    ProcessManagementModule,
    DecisionModule,
    MilestoneModule,
    FormManagementModule,
    ProcessLinkModule,
    MigrationModule,
    LoggingModule,
    DossierManagementModule,
    PluginManagementModule,
    AccessControlManagementModule,
    CatalogiApiPluginModule,
    DocumentenApiPluginModule,
    OpenZaakPluginModule,
    ZakenApiPluginModule,
    ObjectenApiPluginModule,
    ObjecttypenApiPluginModule,
    ObjectTokenAuthenticationPluginModule,
    ObjectModule,
    ObjectManagementModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: CustomMultiTranslateHttpLoaderFactory,
        deps: [HttpBackend, HttpClient, ConfigService, LocalizationService],
      },
    }),
    TranslationManagementModule,
    TaskManagementModule,
    ExterneKlanttaakPluginModule,
    RotterdamOracleEbsPluginModule,
    DashboardModule,
    DashboardManagementModule,
    KvkPluginModule,
    DocumentSearchPluginModule,
    ZgwModule,
    ValueMapperPluginModule,
    DocsysPluginModule,
    TokenAuthenticationPluginModule,
    OpenKlantPluginModule,
    SocratesPluginModule,
  ],
  providers: [
    {
      provide: PLUGINS_TOKEN,
      useValue: [
        valtimoOcrPluginSpecification,
        valtimoS2tPluginSpecification,
        externeKlanttaakPluginSpecification,
        mailTemplatePluginSpecification,
        notifyNlPluginSpecification,
        haalCentraalBrpPluginSpecification,
        haalCentraalBagPluginSpecification,
        haalCentraalBrpAuthPluginSpecification,
        objectManagementPluginSpecification,
        objectTokenAuthenticationPluginSpecification,
        objectenApiPluginSpecification,
        objecttypenApiPluginSpecification,
        publictaskPluginSpecification,
        rotterdamOracleEbsPluginSpecification,
        samplePluginSpecification,
        slackPluginSpecification,
        valtimoLlmPluginSpecification,
        smtpmailPluginSpecification,
        spotlerPluginSpecification,
        suwinetPluginSpecification,
        suwinetAuthPluginSpecification,
        textTemplatePluginSpecification,
        mTlsSslcontextPluginSpecification,
        XentialPluginSpecification,
        kvkPluginSpecification,
        documentSearchPluginSpecification,
        valueMapperPluginSpecification,
        docsysPluginSpecification,
        catalogiApiPluginSpecification,
        documentenApiPluginSpecification,
        openZaakPluginSpecification,
        zakenApiPluginSpecification,
        tokenAuthenticationPluginSpecification,
        zakenApiPluginSpecification,
        openKlantPluginSpecification,
        socratesPluginSpecification,
      ],
    },
    {
      provide: CASE_TAB_TOKEN,
      useValue: {
        "klantcontact-tab": KlantcontactTabComponent, // Deprecated - use 'generieke-contactgeschiedenis'
        "generieke-contactgeschiedenis": ContactHistoryTabComponent,
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    enableCustomFormioComponents(injector);
    registerFormioUploadComponent(injector);
    registerFormioFileSelectorComponent(injector);
    registerFormioValueResolverSelectorComponent(injector);
  }
}
