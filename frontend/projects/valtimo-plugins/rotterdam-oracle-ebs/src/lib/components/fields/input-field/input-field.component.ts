import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  @Input() pluginId!: string;
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() wrapperClass: string = "field-wrapper";
  @Input() type: string = 'text';
  @Input() title!: string;
  @Input() tooltip: string = null;
  @Input() required: boolean = false;
}
