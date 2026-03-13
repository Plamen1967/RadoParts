import { Component } from '@angular/core';
import { AuthenticationService } from '@services/authentication/authentication.service';

@Component({
    selector: 'app-suspended',
    templateUrl: './suspended.component.html',
    styleUrls: ['./suspended.component.css'],
    imports: []
})
export class SuspendedComponent  {
  suspended = true;
  constructor(private authenticationService: AuthenticationService) {
    this.suspended = authenticationService.suspended?true:false;
  }
}
