/* eslint-disable @typescript-eslint/no-unused-vars */
import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuOption } from '@model/menuOption';

@Component({
  standalone: true,
  selector: 'app-buttonmenu',
  templateUrl: './buttonMenu.component.html',
  styleUrls: ['./buttonMenu.component.css'],
  imports: [NgFor, NgIf]
})
export class ButtonMenuComponent{

  @Input() menuOptions?: MenuOption[];

  menuSelected(menuId?: number) {
    return;
  }
}
