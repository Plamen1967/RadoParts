import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseControl } from '../baseControl';
import { NgClass, NgStyle } from '@angular/common';

@Component({
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


  constructor() {
    super();
  }

  override get contolName(): string {
    return this.label ?? this.placeHolder;
}
  onTextChange() {
    if (this.onChange)
        this.onChange(this.inputValue!);
  }
  
}
