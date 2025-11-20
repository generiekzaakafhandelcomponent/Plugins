import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    OpenKlantPluginConfigurationComponent
} from './components/open-klant-plugin-configuration/open-klant-plugin-configuration.component';
import {
    OpenKlantStoreContactinfoComponent
} from './components/open-klant-store-contactinfo/open-klant-store-contactinfo.component';
import {FormModule, InputModule} from '@valtimo/components';
import {PluginTranslatePipeModule} from '@valtimo/plugin';

@NgModule({
  declarations: [
    OpenKlantPluginConfigurationComponent,
    OpenKlantStoreContactinfoComponent,
  ],
  imports: [
    CommonModule,
    InputModule,
    PluginTranslatePipeModule,
    FormModule
  ],
  exports: [OpenKlantPluginConfigurationComponent, OpenKlantStoreContactinfoComponent]
})
export class OpenKlantPluginModule {}
