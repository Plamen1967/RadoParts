import { Component, ElementRef, Input, Self } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { BaseControl } from '../baseControl';
import { ErrorService } from '@services/error.service';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-textarea',
  templateUrl: './textArea.component.html',
  styleUrls: ['./textArea.component.css'],
  imports: [NgClass, NgStyle, FormsModule]

})
export class TextAreaComponent extends BaseControl<string> {
  @Input() label?: string;
  @Input() rows = 2;
  @Input() border = true;
  @Input() submitted  = false
  @Input() length  = 500
  @Input() placeHolder  = ''
  @Input() required?: boolean;


  constructor(@Self() control: NgControl, errorService: ErrorService, element: ElementRef) {
    super(control, errorService, element);
  }

  override get contolName(): string {
    return this.label ?? this.placeHolder;
}
  onTextChange() {
    if (this.onChange)
        this.onChange(this.inputValue!);
  }
  
}
