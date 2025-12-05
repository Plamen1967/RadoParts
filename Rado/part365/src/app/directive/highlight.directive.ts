import {Directive, ElementRef, HostListener, inject, Input} from '@angular/core';
@Directive({
  standalone: true,  
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef);
  @Input() highlightColor = 'yellow';
  constructor() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || 'yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
