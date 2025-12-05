import { NgClass } from '@angular/common';
import { Component, HostListener} from '@angular/core';
import { goTop } from '@app/functions/functions';

@Component({
  standalone: true,
  selector: 'app-gotop',
  templateUrl: './goTop.component.html',
  styleUrls: ['./goTop.component.css'],
  imports: [NgClass]
})
export class GoTopComponent {
  scrollToTopFlag = false

  @HostListener('window:scroll', ['$event'])
  strollY(event: { currentTarget: { scrollY: number; }; }) {
    this.scrollToTopFlag = (event.currentTarget.scrollY > 0) ? true : false;
  }

  @HostListener('click', ['$event'])
  goTop() {
    goTop();
  }

  moveToTop() {
    this.goTop()
  }
}
