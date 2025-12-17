import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {Observable} from "rxjs";
import {CompleteToOipDelegatedTaskConfig} from '../../models';

@Component({
  standalone: false,
  selector: 'valtimo-complete-delegated-task-configuration',
  templateUrl: './complete-delegated-task.component.html',
  styleUrl: './complete-delegated-task.component.css'
})
export class CompleteDelegatedTaskComponent implements FunctionConfigurationComponent {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() prefillConfiguration$: Observable<CompleteToOipDelegatedTaskConfig>;
  @Input() pluginId: string;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<CompleteToOipDelegatedTaskConfig> = new EventEmitter<CompleteToOipDelegatedTaskConfig>();
}
