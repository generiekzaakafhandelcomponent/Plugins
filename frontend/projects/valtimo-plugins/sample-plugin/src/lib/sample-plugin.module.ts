import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {FormModule, InputModule} from '@valtimo/components';
import {SamplePluginConfigurationComponent} from './components/sample-plugin-configuration/sample-plugin-configuration.component';
import {SampleActionConfigurationComponent} from './components/sample-action-configuration/sample-action-configuration.component';

@NgModule({
  declarations: [SamplePluginConfigurationComponent, SampleActionConfigurationComponent],
  imports: [CommonModule, PluginTranslatePipeModule, FormModule, InputModule],
  exports: [SamplePluginConfigurationComponent, SampleActionConfigurationComponent],
})
export class SamplePluginModule {}
