import { Component, Input } from '@angular/core';
import { SuspendedComponent } from '../suspended/suspended.component';
import { HelperComponent } from '../helper/helper.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  standalone: true,
  selector: 'app-listtitle',
  templateUrl: './listtitle.component.html',
  styleUrls: ['./listtitle.component.scss'],
  imports: [ SuspendedComponent, MatBadgeModule, MatButtonModule, MatIconModule]
})
export class ListTitleComponent extends HelperComponent{

  @Input() number = 0;;
  @Input() title = "";
}
