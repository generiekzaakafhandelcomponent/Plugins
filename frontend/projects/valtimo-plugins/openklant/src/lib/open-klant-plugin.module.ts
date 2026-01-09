import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OpenKlantPluginConfigurationComponent } from "./components/open-klant-plugin-configuration/open-klant-plugin-configuration.component";
import { StoreContactInfoComponent } from "./components/store-contact-info/store-contact-info.component";
import { FormModule, InputModule } from "@valtimo/components";
import { PluginTranslatePipeModule } from "@valtimo/plugin";

@NgModule({
  declarations: [
    OpenKlantPluginConfigurationComponent,
    StoreContactInfoComponent,
  ],
  imports: [CommonModule, InputModule, PluginTranslatePipeModule, FormModule],
  exports: [OpenKlantPluginConfigurationComponent, StoreContactInfoComponent],
})
export class OpenKlantPluginModule {}
