import { Injectable } from '@angular/core';
import { NgxImgZoomMode } from '@components/custom-controls/zoom/mode.enum';

@Injectable()
export class NgxImgZoomService {
  zoomMode = NgxImgZoomMode.HoverZoom;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zoomBreakPoints: any;

  // setZoomMode(zoomMode) {
  //   this.zoomMode = zoomMode;
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setZoomBreakPoints(breakPoints: any) {
    this.zoomBreakPoints = breakPoints;
  }
}
