import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent {
  @Input() pluginId!: string;
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() wrapperClass: string = 'field-wrapper';
  @Input() title!: string;
  @Input() tooltip: string = null;
  @Input() placeholder!: string;
  @Input() required: boolean = false;
  @Input() items: string[] = [];
}
