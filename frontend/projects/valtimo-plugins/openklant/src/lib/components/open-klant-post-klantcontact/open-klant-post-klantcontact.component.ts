import { Component } from '@angular/core';
import {FormModule, InputModule} from "@valtimo/components";
import {PluginTranslatePipeModule} from "@valtimo/plugin";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'lib-open-klant-post-klantcontact',
  standalone: true,
    imports: [
        FormModule,
        InputModule,
        PluginTranslatePipeModule,
        AsyncPipe
    ],
  templateUrl: './open-klant-post-klantcontact.component.html',
  styleUrl: './open-klant-post-klantcontact.component.css'
})
export class OpenKlantPostKlantcontactComponent {

}
