import {NgModule} from "@angular/core";
import {
    HaalCentraalBagPluginConfigurationComponent
} from "./components/hc-bag-plugin-configuration/haal-centraal-bag-plugin-configuration.component";
import {CommonModule} from "@angular/common";
import {PluginTranslatePipeModule} from "@valtimo/plugin";
import {FormModule, InputModule, RadioModule, SelectModule} from "@valtimo/components";
import {
    HcBagOphalenAdresseerbaarObjectIdentificatieComponent
} from "./components/hc-bag-ophalen-adresseerbaar-object-identificatie/hc-bag-ophalen-adresseerbaar-object-identificatie.component";

@NgModule({
    declarations: [
        HaalCentraalBagPluginConfigurationComponent,
        HcBagOphalenAdresseerbaarObjectIdentificatieComponent
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
        HaalCentraalBagPluginConfigurationComponent,
        HcBagOphalenAdresseerbaarObjectIdentificatieComponent
    ]
})
export class HaalCentraalBagPluginModule {
}
