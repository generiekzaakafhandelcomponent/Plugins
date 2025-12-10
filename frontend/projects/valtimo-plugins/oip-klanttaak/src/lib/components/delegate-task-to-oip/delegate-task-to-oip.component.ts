import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {Observable} from "rxjs";
import {DelegateTaskToOipConfig} from "../../models/config.models";

@Component({
  selector: 'lib-delegate-task-to-oip',
  imports: [],
  templateUrl: './delegate-task-to-oip.component.html',
  styleUrl: './delegate-task-to-oip.component.css'
})
export class DelegateTaskToOipComponent implements FunctionConfigurationComponent {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() prefillConfiguration$: Observable<DelegateTaskToOipConfig>;
  @Input() pluginId: string;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<DelegateTaskToOipConfig> = new EventEmitter<DelegateTaskToOipConfig>();
}
