import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {FormModule, InputModule, SelectModule} from '@valtimo/components';
import {PrintstraatPluginConfigurationComponent} from './components/printstraat-plugin-configuration.component';

@NgModule({
  declarations: [PrintstraatPluginConfigurationComponent],
  imports: [
    CommonModule,
    PluginTranslatePipeModule,
    FormModule,
    InputModule,
    SelectModule
  ],
  exports: [PrintstraatPluginConfigurationComponent]
})
export class PrintstraatPluginModule {}
