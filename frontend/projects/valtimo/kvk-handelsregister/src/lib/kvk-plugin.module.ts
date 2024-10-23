import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {CarbonMultiInputModule, FormModule, InputModule, ParagraphModule, SelectModule} from '@valtimo/components';
import {
    KvkPluginConfigurationComponent
} from './components/kvk-plugin-configuration/kvk-plugin-configuration.component';
import {ZoekenOpKvkNummerComponent} from './components/zoeken-op-kvk-nummer/zoeken-op-kvk-nummer.component';

@NgModule({
    declarations: [
        KvkPluginConfigurationComponent,
        ZoekenOpKvkNummerComponent
    ],
    imports: [
        CommonModule,
        PluginTranslatePipeModule,
        FormModule,
        InputModule,
        SelectModule,
        ParagraphModule,
        CarbonMultiInputModule
    ],
    exports: [
        KvkPluginConfigurationComponent,
        ZoekenOpKvkNummerComponent
    ]
})
export class KvkPluginModule {
}
