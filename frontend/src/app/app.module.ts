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

import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpBackend, HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutModule, TranslationManagementModule} from '@valtimo/layout';
import {TaskModule} from '@valtimo/task';
import {environment} from '../environments/environment';
import {SecurityModule} from '@valtimo/security';
import {BuildingBlockManagementModule} from '@valtimo/building-block-management';
import {
    BpmnJsDiagramModule,
    enableCustomFormioComponents,
    MenuModule,
    registerFormioFileSelectorComponent,
    registerFormioUploadComponent,
    registerFormioValueResolverSelectorComponent,
    WidgetModule,
    ValuePathSelectorComponent
} from '@valtimo/components';
import {
    DefaultTabs,
    CaseDetailTabAuditComponent,
    CaseDetailTabDocumentsComponent,
    CaseDetailTabProgressComponent,
    CaseDetailTabSummaryComponent,
    CaseModule,
    CASE_TAB_TOKEN
} from '@valtimo/case';
import {CaseMigrationModule} from '@valtimo/case-migration';
import {ProcessModule} from '@valtimo/process';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DocumentModule} from '@valtimo/document';
import {AccountModule} from '@valtimo/account';
import {ChoiceFieldModule} from '@valtimo/choice-field';
import {ResourceModule} from '@valtimo/resource';
import {FormModule} from '@valtimo/form';
import {SwaggerModule} from '@valtimo/swagger';
import {AnalyseModule} from '@valtimo/analyse';
import {ProcessManagementModule} from '@valtimo/process-management';
import {DecisionModule} from '@valtimo/decision';
import {MilestoneModule} from '@valtimo/milestone';
import {LoggerModule} from 'ngx-logger';
import {FormManagementModule} from '@valtimo/form-management';
import {MigrationModule} from '@valtimo/migration';
import {CaseManagementModule} from '@valtimo/case-management';
import {BootstrapModule} from '@valtimo/bootstrap';
import {ConfigModule, ConfigService, CustomMultiTranslateHttpLoaderFactory, LocalizationService} from '@valtimo/shared';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {PluginManagementModule} from '@valtimo/plugin-management';
import {AccessControlManagementModule} from '@valtimo/access-control-management';
import {ZgwModule} from '@valtimo/zgw';
import {ProcessLinkModule} from '@valtimo/process-link';
import {ObjectManagementModule} from '@valtimo/object-management'
import {ObjectModule} from '@valtimo/object';
import {LoggingModule} from '@valtimo/logging';
import {DashboardModule} from '@valtimo/dashboard';
import {DashboardManagementModule} from '@valtimo/dashboard-management';
import {SseModule} from '@valtimo/sse';
import {
    PLUGINS_TOKEN,
    CatalogiApiPluginModule,catalogiApiPluginSpecification,
    DocumentenApiPluginModule, documentenApiPluginSpecification,
    OpenZaakPluginModule, openZaakPluginSpecification,
    ZakenApiPluginModule, zakenApiPluginSpecification,
    ObjectenApiPluginModule, objectenApiPluginSpecification,
    ObjectTokenAuthenticationPluginModule, objectTokenAuthenticationPluginSpecification,
    ObjecttypenApiPluginModule, objecttypenApiPluginSpecification,
} from '@valtimo/plugin';

import {ExterneKlanttaakPluginModule, externeKlanttaakPluginSpecification} from '@valtimo-plugins/externe-klanttaak';
import {HaalCentraalBrpAuthPluginModule, haalCentraalBrpAuthPluginSpecification} from '@valtimo-plugins/haal-centraal-auth';
import {
    HaalCentraalBagPluginModule, haalCentraalBagPluginSpecification,
    HaalCentraalBrpPluginModule, haalCentraalBrpPluginSpecification
} from '@valtimo-plugins/haal-centraal';
import {
    DocumentGeneratorPluginModule, documentGeneratorPluginSpecification,
    MailTemplatePluginModule, mailTemplatePluginSpecification,
    TextTemplatePluginModule, textTemplatePluginSpecification
} from '@valtimo-plugins/freemarker';
import {KvkPluginModule, kvkPluginSpecification} from '@valtimo-plugins/kvk-handelsregister';
import {MtlsSslcontextPluginModule, mTlsSslcontextPluginSpecification} from '@valtimo-plugins/mtls-sslcontext';
import {NotifyNlPluginModule, notifyNlPluginSpecification} from '@valtimo-plugins/notify-nl';
import {ObjectManagementPluginModule, objectManagementPluginSpecification} from '@valtimo-plugins/object-management';
import {OipKlanttaakPluginModule, oipKlanttaakPluginSpecification} from '@valtimo-plugins/oip-klanttaak';
import {OpenKlantPluginModule, openKlantPluginSpecification, KlantcontactTabComponent} from '@valtimo-plugins/openklant';
import {OpenProductPluginModule, openProductPluginSpecification} from '@valtimo-plugins/open-product';
import {PublictaskPluginModule, publictaskPluginSpecification} from '@valtimo-plugins/publictask';
import {RotterdamOracleEbsPluginModule, rotterdamOracleEbsPluginSpecification} from '@valtimo-plugins/rotterdam-oracle-ebs';
import {SlackPluginModule, slackPluginSpecification} from '@valtimo-plugins/slack';
import {SmtpMailPluginModule, smtpmailPluginSpecification} from '@valtimo-plugins/smtpmail';
import {SpotlerPluginModule, spotlerPluginSpecification} from '@valtimo-plugins/spotler';
import {SuwinetPluginModule, suwinetPluginSpecification} from '@valtimo-plugins/suwinet';
import {TokenAuthenticationPluginModule, tokenAuthenticationPluginSpecification} from '@valtimo-plugins/token-authentication';
import {ValtimoLlmPluginModule, valtimoLlmPluginSpecification} from '@valtimo-plugins/valtimo-llm'
import {ValtimoOcrPluginModule, valtimoOcrPluginSpecification} from '@valtimo-plugins/valtimo-ocr';
import {ValtimoS2tPluginModule, valtimoS2tPluginSpecification} from '@valtimo-plugins/valtimo-s2t';
import {XentialPluginModule, XentialPluginSpecification} from '@valtimo-plugins/xential';

export function tabsFactory() {
    return new Map<string, object>([
        [DefaultTabs.summary, CaseDetailTabSummaryComponent],
        [DefaultTabs.progress, CaseDetailTabProgressComponent],
        [DefaultTabs.audit, CaseDetailTabAuditComponent],
        [DefaultTabs.documents, CaseDetailTabDocumentsComponent],
    ]);
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        environment.authentication.module,
        AccessControlManagementModule,
        AccountModule,
        AnalyseModule,
        AppRoutingModule,
        BootstrapModule,
        BpmnJsDiagramModule,
        BrowserModule,
        BuildingBlockManagementModule,
        CaseManagementModule,
        CaseMigrationModule,
        CaseModule.forRoot(tabsFactory),
        CatalogiApiPluginModule,
        ChoiceFieldModule,
        CommonModule,
        ConfigModule.forRoot(environment),
        DashboardManagementModule,
        DashboardModule,
        DecisionModule,
        DocumentenApiPluginModule,
        DocumentGeneratorPluginModule,
        DocumentModule,
        ExterneKlanttaakPluginModule,
        FormManagementModule,
        FormModule,
        FormsModule,
        HaalCentraalBagPluginModule,
        HaalCentraalBrpAuthPluginModule,
        HaalCentraalBrpPluginModule,
        HttpClientModule,
        KvkPluginModule,
        LayoutModule,
        LoggerModule.forRoot(environment.logger),
        LoggingModule,
        MailTemplatePluginModule,
        MenuModule,
        MigrationModule,
        MilestoneModule,
        MtlsSslcontextPluginModule,
        NotifyNlPluginModule,
        ObjectenApiPluginModule,
        ObjectManagementModule,
        ObjectManagementPluginModule,
        ObjectModule,
        ObjectTokenAuthenticationPluginModule,
        ObjecttypenApiPluginModule,
        OipKlanttaakPluginModule,
        OpenProductPluginModule,
        OpenKlantPluginModule,
        OpenZaakPluginModule,
        PluginManagementModule,
        ProcessLinkModule,
        ProcessManagementModule,
        ProcessModule,
        PublictaskPluginModule,
        ReactiveFormsModule,
        ResourceModule,
        RotterdamOracleEbsPluginModule,
        SecurityModule,
        SlackPluginModule,
        SmtpMailPluginModule,
        SpotlerPluginModule,
        SseModule,
        SuwinetPluginModule,
        SwaggerModule,
        TokenAuthenticationPluginModule,
        TaskModule,
        TextTemplatePluginModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: CustomMultiTranslateHttpLoaderFactory,
                deps: [HttpBackend, HttpClient, ConfigService, LocalizationService],
            },
        }),
        TranslationManagementModule,
        ValtimoOcrPluginModule,
        ValtimoS2tPluginModule,
        ValtimoLlmPluginModule,
        ValuePathSelectorComponent,
        WidgetModule,
        XentialPluginModule,
        ZakenApiPluginModule,
        ZgwModule
    ],
    providers: [{
        provide: PLUGINS_TOKEN,
        useValue: [
            XentialPluginSpecification,
            catalogiApiPluginSpecification,
            documentGeneratorPluginSpecification,
            documentenApiPluginSpecification,
            externeKlanttaakPluginSpecification,
            haalCentraalBagPluginSpecification,
            haalCentraalBrpAuthPluginSpecification,
            haalCentraalBrpPluginSpecification,
            kvkPluginSpecification,
            mTlsSslcontextPluginSpecification,
            mailTemplatePluginSpecification,
            notifyNlPluginSpecification,
            objectManagementPluginSpecification,
            objectTokenAuthenticationPluginSpecification,
            objectenApiPluginSpecification,
            objecttypenApiPluginSpecification,
            oipKlanttaakPluginSpecification,
            openProductPluginSpecification,
            openKlantPluginSpecification,
            openZaakPluginSpecification,
            publictaskPluginSpecification,
            rotterdamOracleEbsPluginSpecification,
            slackPluginSpecification,
            smtpmailPluginSpecification,
            spotlerPluginSpecification,
            suwinetPluginSpecification,
            textTemplatePluginSpecification,
            tokenAuthenticationPluginSpecification,
            valtimoOcrPluginSpecification,
            valtimoS2tPluginSpecification,
            valtimoLlmPluginSpecification,
            zakenApiPluginSpecification
        ],
    }, {
        provide: CASE_TAB_TOKEN,
        useValue: {
            'klantcontact-tab': KlantcontactTabComponent,
            'generieke-contactgeschiedenis': ContactHistoryTabComponent,
        }
    }],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(injector: Injector) {
        enableCustomFormioComponents(injector);
        registerFormioUploadComponent(injector);
        registerFormioFileSelectorComponent(injector);
        registerFormioValueResolverSelectorComponent(injector);
    }
}
