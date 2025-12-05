import { Component, HostListener, Input, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-viber',
  templateUrl: './viber.component.html',
  styleUrls: ['./viber.component.css'],
  imports: []
})
export class ViberComponent implements OnInit {

  constructor(private sanitizer:DomSanitizer) { }
  @Input() number?:string ;
   @HostListener('click', ["$event"])
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   click(event: any) {
    event.stopPropagation();
   }
  
  ngOnInit() {
    if (this.number && this.number.length == 10 && this.number[0] === '0') this.number.replace('0', '359')
  }
  get viberNumber() {
    return this.number;
  }

  get viberRef() {
    return `viber://add?number=${this.viberNumber}&message=hello&text=hello`;
  }
  get chatviberRef() {
    return `viber://chat?number=${this.viberNumber}&text=hello`;
  }
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}  
}
