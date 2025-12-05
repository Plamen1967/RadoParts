import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css'],
  imports:[ NgClass]
})
export class RowComponent {

  @Input() label?: string;
  @Input() value?: string | number;
  @Input() price?: boolean = false;
  
}
