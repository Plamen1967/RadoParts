import { Component, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-whats',
  templateUrl: './whats.component.html',
  styleUrls: ['./whats.component.css'],
  imports: []
})
export class WhatsComponent {

  constructor(private sanitizer:DomSanitizer) { }
  @Input() number?: string;

  get whatsNumber() {
    return this.number;
  }
  get whatsRef() {
    return `whatsapp://send?phone=${this.whatsNumber}&text=hello`;
  }
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}  

}
