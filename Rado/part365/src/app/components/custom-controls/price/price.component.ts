import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css'],
  imports: []
})
export class PriceComponent {

  @Input() price?: number;
  currency = "лв";

}
