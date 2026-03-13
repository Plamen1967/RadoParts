import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-datarow',
    templateUrl: './dataRow.component.html',
    styleUrls: ['./dataRow.component.css'],
    imports: []
})
export class DataRowComponent{

  @Input() label?: string;
  @Input() value?: string
  @Input() price?: boolean;
  @Input() normal = false;

}
