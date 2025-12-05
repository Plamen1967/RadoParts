import { Component, ElementRef, Input, Self } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { CONSTANT } from '@app/constant/globalLabels';
import { ErrorService } from '@services/error.service';
import { BaseControl } from '../baseControl';
import { NgClass } from '@angular/common';
import { AutofocusDirective } from '@app/directive/autofocus.directive';

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [AutofocusDirective, NgClass, FormsModule]
})
export class UserComponent  extends BaseControl<string>  {

  @Input() label?: string
  @Input() placeHolder?: string
  @Input() hint?: string
  @Input() pattern?: string
  @Input() submitted = false
  @Input({required: true}) prefix = '';
  @Input({required: true}) controlName?: string;

  constructor(@Self() control: NgControl, errorService: ErrorService, element: ElementRef) {
      super(control, errorService, element)
  }

  get labels() {
      return CONSTANT
  }

  override get contolName(): string {
      return this.control.name?.toString() ??  this.label ?? this.placeHolder ?? '';
  }

  change() {
    if (this.onChange) this.onChange(this.value!);
  }
}
