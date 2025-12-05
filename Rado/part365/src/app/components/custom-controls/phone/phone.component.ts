import { Component, HostListener, Input, OnInit } from '@angular/core';
import { isMobile } from '@app/functions/functions';

@Component({
  standalone: true,
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css'],
  imports: []
})
export class PhoneComponent implements OnInit {
   @HostListener('click', ["$event"])
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   click(event: any) {
    event.stopPropagation();
   }

  @Input() phone?: string;
  isMobile?: boolean;
  refPhone?: string;

  ngOnInit() {
    this.isMobile = isMobile();
    this.refPhone = `tel:${this.phone}`;
  }

}
