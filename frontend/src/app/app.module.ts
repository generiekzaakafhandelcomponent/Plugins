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
import {
  BpmnJsDiagramModule,
  CardModule,
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
  DossierDetailTabAuditComponent,
  DossierDetailTabDocumentsComponent,
  DossierDetailTabProgressComponent,
  DossierDetailTabSummaryComponent,
  DossierModule,
} from '@valtimo/dossier';
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
import {DossierManagementModule} from '@valtimo/dossier-management';
import {BootstrapModule} from '@valtimo/bootstrap';
import {ConfigModule, ConfigService, CustomMultiTranslateHttpLoaderFactory, LocalizationService} from '@valtimo/config';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {PluginManagementModule} from '@valtimo/plugin-management';
import {AccessControlManagementModule} from '@valtimo/access-control-management';
import {
  ObjectenApiPluginModule,
  objectenApiPluginSpecification,
  ObjectTokenAuthenticationPluginModule,
  objectTokenAuthenticationPluginSpecification,
  ObjecttypenApiPluginModule,
  objecttypenApiPluginSpecification,
  PLUGINS_TOKEN
} from '@valtimo/plugin';
import {TaskManagementModule} from '@valtimo/task-management';
import {ProcessLinkModule} from '@valtimo/process-link';

import {AlfrescoAuthPluginModule, alfrescoAuthPluginSpecification} from '@valtimo-plugins/alfresco-auth';
import {AmsterdamEmailapiPluginModule, amsterdamEmailapiPluginSpecification} from '@valtimo-plugins/amsterdam-emailapi';
import {BerkelybridgeTextgeneratorPluginModule, berkelybridgeTextgeneratorPluginSpecification} from '@valtimo-plugins/berkelybridge';
import {
    MailTemplatePluginModule,
    mailTemplatePluginSpecification,
    TextTemplatePluginModule,
    textTemplatePluginSpecification
} from '@valtimo-plugins/freemarker';
import {NotifyNlPluginModule, notifyNlPluginSpecification} from '@valtimo-plugins/notify-nl';
import {PublictaskPluginModule, publictaskPluginSpecification} from '@valtimo-plugins/publictask';
import {SlackPluginModule, slackPluginSpecification} from '@valtimo-plugins/slack';
import {SmtpMailPluginModule, smtpmailPluginSpecification} from '@valtimo-plugins/smtpmail';
import {SpotlerPluginModule, spotlerPluginSpecification} from '@valtimo-plugins/spotler';
import {SuwinetPluginModule, suwinetPluginSpecification} from '@valtimo-plugins/suwinet';
import {XentialPluginModule, XentialPluginSpecification} from '@valtimo-plugins/xential';
import {
  ObjectManagementPluginModule
} from "../../projects/valtimo-plugins/object-management/src/lib/object-management-plugin-module";
import {
  objectManagementPluginSpecification
} from "../../projects/valtimo-plugins/object-management/src/lib/object-management-plugin.specification";
import {ObjectManagementModule} from "@valtimo/object-management";

export function tabsFactory() {
  return new Map<string, object>([
    [DefaultTabs.summary, DossierDetailTabSummaryComponent],
    [DefaultTabs.progress, DossierDetailTabProgressComponent],
    [DefaultTabs.audit, DossierDetailTabAuditComponent],
    [DefaultTabs.documents, DossierDetailTabDocumentsComponent],
  ]);
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        ValuePathSelectorComponent,
        AlfrescoAuthPluginModule,
        AmsterdamEmailapiPluginModule,
        BerkelybridgeTextgeneratorPluginModule,
        MailTemplatePluginModule,
        TextTemplatePluginModule,
        PublictaskPluginModule,
        NotifyNlPluginModule,
        ObjectManagementPluginModule,
        SlackPluginModule,
        SmtpMailPluginModule,
        SpotlerPluginModule,
        SuwinetPluginModule,
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
        DossierManagementModule,
        PluginManagementModule,
        AccessControlManagementModule,
        ObjectenApiPluginModule,
        ObjecttypenApiPluginModule,
        ObjectTokenAuthenticationPluginModule,
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
    ],
    providers: [{
        provide: PLUGINS_TOKEN,
        useValue: [
            alfrescoAuthPluginSpecification,
            amsterdamEmailapiPluginSpecification,
            berkelybridgeTextgeneratorPluginSpecification,
            mailTemplatePluginSpecification,
            textTemplatePluginSpecification,
            publictaskPluginSpecification,
            notifyNlPluginSpecification,
            objectManagementPluginSpecification,
            slackPluginSpecification,
            smtpmailPluginSpecification,
            spotlerPluginSpecification,
            suwinetPluginSpecification,
            XentialPluginSpecification,
            objectenApiPluginSpecification,
            objecttypenApiPluginSpecification,
            objectTokenAuthenticationPluginSpecification
        ]
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
