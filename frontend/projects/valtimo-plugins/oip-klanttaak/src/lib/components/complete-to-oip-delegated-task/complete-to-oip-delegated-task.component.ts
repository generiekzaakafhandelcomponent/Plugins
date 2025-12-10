import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FunctionConfigurationComponent} from "@valtimo/plugin";
import {Observable} from "rxjs";
import {CompleteToOipDelegatedTaskConfig} from "../../models/config.models";

@Component({
  selector: 'lib-complete-to-oip-delegated-task',
  imports: [],
  templateUrl: './complete-to-oip-delegated-task.component.html',
  styleUrl: './complete-to-oip-delegated-task.component.css'
})
export class CompleteToOipDelegatedTaskComponent implements FunctionConfigurationComponent {

  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() prefillConfiguration$: Observable<CompleteToOipDelegatedTaskConfig>;
  @Input() pluginId: string;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<CompleteToOipDelegatedTaskConfig> = new EventEmitter<CompleteToOipDelegatedTaskConfig>();
}
