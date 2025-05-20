import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PluginTranslatePipeModule} from "@valtimo/plugin";
import {FormModule, InputModule} from "@valtimo/components";
import {
    HaalCentraalAuthPluginConfigurationComponent
} from "./components/haal-centraal-auth-plugin-configuration.component";

@NgModule({
    declarations: [HaalCentraalAuthPluginConfigurationComponent],
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        FormModule,
        InputModule,
    ],
    exports: [HaalCentraalAuthPluginConfigurationComponent]
})
export class HaalCentraalBrpAuthPluginModule {
}
