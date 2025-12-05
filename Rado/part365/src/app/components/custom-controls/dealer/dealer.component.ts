import { Component, HostListener, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css'],
  imports: []

})
export class DealerComponent{

   @HostListener('click', ["$event"])
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   click(event: any) {
    event.stopPropagation();
   }
  @Input() companyName?: string
  @Input() sellerLogo?: string
  @Input() dealer?: boolean;
  @Input() sellerWebPage = "";
}

