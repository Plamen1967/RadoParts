import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-webpage',
    templateUrl: './webPage.component.html',
    styleUrls: ['./webPage.component.css'],
    imports: []
})
export class WebPageComponent{

  webPage_?: string;
  @Input() set webPage(value: string) {
    this.webPage_ = `https:\\\\${value}.radoparts.com`;

  };
}
