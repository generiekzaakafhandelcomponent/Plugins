import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {CarbonMultiInputModule, FormModule, InputModule, ParagraphModule, SelectModule} from '@valtimo/components';
import {
    HaalcentraalBrpPluginConfigurationComponent
} from './components/haal-centraal-brp-plugin-configuration/haalcentraal-brp-plugin-configuration.component';
import {HaalCentraalBrpBewoningenComponent} from './components/haal-centraal-brp-bewoningen/haal-centraal-brp-bewoningen.component';

@NgModule({
    declarations: [
        HaalcentraalBrpPluginConfigurationComponent,
        HaalCentraalBrpBewoningenComponent
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
        HaalcentraalBrpPluginConfigurationComponent,
        HaalCentraalBrpBewoningenComponent
    ]
})
export class HaalCentraalBrpPluginModule {
}
