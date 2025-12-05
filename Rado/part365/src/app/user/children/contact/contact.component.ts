import { Component, OnInit, Optional } from '@angular/core';
import { DealerWebPageComponent } from '@app/user/dealerWebPage/dealerWebPage.component';
import { UserHeaderComponent } from '@app/user/userHeader/userHeader.component';
import { User } from '@model/user';
import { UserService } from '@services/user.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [UserHeaderComponent]
})
export default class ContactComponent implements OnInit {

  user?: User;
  constructor(private userService: UserService, 
    @Optional() public parent: DealerWebPageComponent
  ) {
    this.user = parent?.user;
    console.log(this.user)
   }

  ngOnInit() {
    return;
  }



}
