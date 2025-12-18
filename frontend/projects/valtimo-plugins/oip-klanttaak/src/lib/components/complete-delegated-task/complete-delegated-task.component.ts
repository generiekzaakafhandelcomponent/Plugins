import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {Observable} from "rxjs";
import {CompleteDelegatedTaskConfig} from '../../models';

@Component({
  standalone: false,
  selector: 'valtimo-complete-delegated-task-configuration',
  templateUrl: './complete-delegated-task.component.html',
  styleUrl: './complete-delegated-task.component.css'
})
export class CompleteDelegatedTaskComponent implements FunctionConfigurationComponent {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() prefillConfiguration$: Observable<CompleteDelegatedTaskConfig>;
  @Input() pluginId: string;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<CompleteDelegatedTaskConfig> = new EventEmitter<CompleteDelegatedTaskConfig>();
}
