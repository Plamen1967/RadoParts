import { Directive, ElementRef, HostListener, Input, OnDestroy } from "@angular/core";

@Directive({
  standalone: true,
  selector: '[appToolTip]',
})
export class TooltipDirective implements OnDestroy{

  constructor(private el: ElementRef) {

  }
  @Input() appToolTip = ''; // The text for the tooltip to display

  private myPopup?: HTMLElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timer: any;
  popup?: HTMLDivElement ;
  tooltip?: Node;
  delay = 500;
  id =  'tooltip'
  ngOnDestroy(): void {
    if (this.myPopup) { this.myPopup.remove() }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.timer = setTimeout(() => {
      this.createTooltipPopup();
    }, this.delay)
  }

  @HostListener('mouseleave') onMouseLeave() {
    const elem = document.getElementById(this.id)
    if (elem) { this.el.nativeElement?.removeChild(elem) }
    if (this.timer) clearTimeout(this.timer)
  }

  private createTooltipPopup() {
    this.popup = document.createElement('div');
    this.myPopup = this.popup;
    this.myPopup.id = 'tooltip'
    this.popup.innerHTML = this.appToolTip;
    this.popup.classList.add("tooltip-container");
    this.el.nativeElement.style.position= 'relative';
    this.tooltip = this.el.nativeElement.appendChild(this.popup);
    this.timer = setTimeout(() => {
      this.el.nativeElement?.removeChild(this.tooltip)
      this.tooltip = undefined;
    }, 5000)
  }

}


// <div class="user-icon" [appToolTip]="'Sign In'"></div>


// <style>
// /* Tooltip container */
// .tooltip {
//   position: relative;
//   display: inline-block;
//   border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
// }

// /* Tooltip text */
// .tooltip .tooltiptext {
//   visibility: hidden;
//   width: 120px;
//   background-color: black;
//   color: #fff;
//   text-align: center;
//   padding: 5px 0;
//   border-radius: 6px;
 
//   /* Position the tooltip text - see examples below! */
//   position: absolute;
//   z-index: 1;
// }

// /* Show the tooltip text when you mouse over the tooltip container */
// .tooltip:hover .tooltiptext {
//   visibility: visible;
// }
// </style>

// <div class="tooltip">Hover over me
//   <span class="tooltiptext">Tooltip text</span>
// </div>
