import {Directive, ElementRef, HostListener, inject, input} from '@angular/core';
@Directive({
  standalone: true,  
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef);
  highlightColor = input<string>('yellow');
  constructor() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor();
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor() || 'yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
