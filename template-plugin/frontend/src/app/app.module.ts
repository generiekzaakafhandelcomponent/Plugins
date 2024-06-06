import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpBackend, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutModule} from '@valtimo/layout';
import {
  BpmnJsDiagramModule,
  CarbonListModule,
  CardModule,
  DataListModule,
  ListModule,
  MenuModule,
  registerDocumentenApiFormioUploadComponent,
  registerFormioFileSelectorComponent,
  registerFormioUploadComponent,
  SpinnerModule,
  TableModule,
  WidgetModule,
} from '@valtimo/components';
import {TaskModule} from '@valtimo/task';
import {environment} from '../environments/environment';
import {AuthGuardService, SecurityModule} from '@valtimo/security';
import {ChoicefieldModule} from '@valtimo/choicefield';
import {
  DefaultTabs,
  DossierDetailTabAuditComponent,
  DossierDetailTabDocumentsComponent,
  DossierDetailTabProgressComponent,
  DossierDetailTabSummaryComponent,
  DossierModule,
} from '@valtimo/dossier';
import {ProcessModule} from '@valtimo/process';
import {ViewConfiguratorModule} from '@valtimo/view-configurator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardModule} from '@valtimo/dashboard';
import {DocumentModule} from '@valtimo/document';
import {AccountModule} from '@valtimo/account';
import {ChoiceFieldModule} from '@valtimo/choice-field';
import {FormModule} from '@valtimo/form';
import {SwaggerModule} from '@valtimo/swagger';
import {AnalyseModule} from '@valtimo/analyse';
import {ProcessManagementModule} from '@valtimo/process-management';
import {DecisionModule} from '@valtimo/decision';
import {MilestoneModule} from '@valtimo/milestone';
import {LoggerModule} from 'ngx-logger';
import {FormManagementModule} from '@valtimo/form-management';
import {FormLinkModule} from '@valtimo/form-link';
import {MigrationModule} from '@valtimo/migration';
import {DossierManagementModule} from '@valtimo/dossier-management';
import {BootstrapModule} from '@valtimo/bootstrap';
import {ConfigModule, ConfigService, MultiTranslateHttpLoaderFactory} from '@valtimo/config';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {PluginManagementModule} from '@valtimo/plugin-management';
import {ConnectorManagementModule} from '@valtimo/connector-management';
import {
  ObjectenApiPluginModule,
  objectenApiPluginSpecification, ObjectTokenAuthenticationPluginModule,
  objectTokenAuthenticationPluginSpecification, ObjecttypenApiPluginModule, objecttypenApiPluginSpecification,
  PLUGINS_TOKEN, SmartDocumentsPluginModule, smartDocumentsPluginSpecification,
} from '@valtimo/plugin';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {GridModule, IconModule, TilesModule} from "carbon-components-angular";
import {
  MY_PLUGIN_NAMEPluginModule
} from "../../projects/valtimo/MY_PLUGIN_NAME/src/lib/MY_PLUGIN_NAME-plugin-module";
import {
  MY_PLUGIN_NAMEPluginSpecification
} from "../../projects/valtimo/MY_PLUGIN_NAME/src/lib/MY_PLUGIN_NAME-plugin.specification";
import {ObjectManagementModule} from "@valtimo/object-management";
import {ObjectModule} from "@valtimo/object";

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
    ChoicefieldModule,
    DossierModule.forRoot(tabsFactory),
    ProcessModule,
    ViewConfiguratorModule,
    BpmnJsDiagramModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardModule,
    DocumentModule,
    AccountModule,
    ChoiceFieldModule,
    FormModule,
    CarbonListModule,
    AnalyseModule,
    SwaggerModule,
    ProcessManagementModule,
    DecisionModule,
    MilestoneModule,
    FormManagementModule,
    FormLinkModule,
    MigrationModule,
    DossierManagementModule,
    ConnectorManagementModule,
    PluginManagementModule,
    ListModule,
    TranslateModule,
    SpinnerModule,
    DataListModule,
    TableModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: MultiTranslateHttpLoaderFactory,
        deps: [HttpBackend, ConfigService],
      },
    }),
    KeycloakAngularModule,
    TilesModule,
    GridModule,
    IconModule,
    ObjectenApiPluginModule,
    ObjecttypenApiPluginModule,
    ObjectTokenAuthenticationPluginModule,
    ObjectModule,
    ObjectManagementModule,
    MY_PLUGIN_NAMEPluginModule,
  ],
  providers: [
    {
      provide: PLUGINS_TOKEN,
      useValue: [
        MY_PLUGIN_NAMEPluginSpecification,
        objectenApiPluginSpecification,
        objecttypenApiPluginSpecification,
        objectTokenAuthenticationPluginSpecification
      ],
    },
    AuthGuardService,
    {
      provide: KeycloakService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    registerFormioUploadComponent(injector);
    registerFormioFileSelectorComponent(injector);
    registerDocumentenApiFormioUploadComponent(injector);
  }
}
