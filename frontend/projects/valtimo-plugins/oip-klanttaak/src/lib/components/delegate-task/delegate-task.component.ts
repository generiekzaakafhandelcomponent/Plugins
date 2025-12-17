import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {Observable} from "rxjs";
import {DelegateTaskToOipConfig} from '../../models';

@Component({
  standalone: false,
  selector: 'valtimo-delegate-task-configuration',
  templateUrl: './delegate-task.component.html',
  styleUrl: './delegate-task.component.css'
})
export class DelegateTaskComponent implements FunctionConfigurationComponent {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() prefillConfiguration$: Observable<DelegateTaskToOipConfig>;
  @Input() pluginId: string;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<DelegateTaskToOipConfig> = new EventEmitter<DelegateTaskToOipConfig>();
}
