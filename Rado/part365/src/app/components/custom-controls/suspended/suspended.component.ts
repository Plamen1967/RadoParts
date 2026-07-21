import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@services/authentication/authentication.service';

@Component({
    selector: 'app-suspended',
    templateUrl: './suspended.component.html',
    styleUrls: ['./suspended.component.css'],
    imports: []
})
export class SuspendedComponent  {
  suspended = true;
  private authenticationService: AuthenticationService = inject(AuthenticationService);
  constructor() {
    this.suspended = this.authenticationService.suspended?true:false;
  }
}
