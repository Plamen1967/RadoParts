import {
  Directive,
  ElementRef,
  inject,
  Renderer2,
  signal,
} from "@angular/core";

@Directive({
  selector: "[appTrackHover]",
  host: {
    "(pointerenter)": "this.showHoverMessage()",
    "(pointerleave)": "this.removeHoverMessage()",
  },
})
export class TrackHoverDirective {
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private tooltip?: HTMLElement;

  private showHoverMessage() {
    this.tooltip = this.renderer.createElement("span");
    this.renderer.addClass(this.tooltip, "hovering");
    this.tooltip!.textContent = "👋 Hovering!";
    this.renderer.appendChild(this.elementRef.nativeElement, this.tooltip);
  }

  private removeHoverMessage() {
    if (this.tooltip) {
      this.renderer.removeChild(this.elementRef.nativeElement, this.tooltip);
      this.tooltip = undefined;
    }
  }
}