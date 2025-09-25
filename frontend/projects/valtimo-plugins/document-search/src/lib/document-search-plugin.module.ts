import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PluginTranslatePipeModule} from "@valtimo/plugin";
import {FormModule, InputModule, RadioModule, SelectModule} from "@valtimo/components";
import {
    DocumentSearchPluginConfigurationComponent
} from "./components/document-search-plugin-configuration/document-search-plugin-configuration.component";
import {
    DocumentSearchPluginActionComponent
} from "./components/document-search-action-configuration/document-search-plugin-action-configuration.component";

@NgModule({
    declarations: [
        DocumentSearchPluginConfigurationComponent,
        DocumentSearchPluginActionComponent
    ],
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        FormModule,
        InputModule,
        SelectModule,
        RadioModule,
    ],
    exports: [
        DocumentSearchPluginConfigurationComponent,
        DocumentSearchPluginActionComponent
    ]
})
export class DocumentSearchPluginModule {
}
