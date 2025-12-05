import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, Input, HostListener, OnDestroy } from '@angular/core';
import { NgxImgZoomService } from './ngx-img-zoom.service';
import { NgxImgZoomMode } from './mode.enum';
import { NgStyle } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-ngx-img-zoom',
  templateUrl: './ngx-img-zoom.component.html',
  styleUrls: ['./ngx-img-zoom.component.css'],
  imports: [NgStyle],
})
export class NgxImgZoomComponent implements AfterViewInit, OnDestroy {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  img: any; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lens: any; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result? : any; 
  cx!: number; 
  cy!: number; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container!: any;
  hideResultDiv = true;
  _triggerAnimationIn = false;
  notFirstTime = false;
  showResult = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastEventBeforeTheWheel: any;
  zoomBreakPoints;
  zoomIndex = 0;
  _lensStyle?: string;
   
  lensMouseMoveListener?: () => void;
  imgMouseMoveListener?: () => void;;
  imgTouchMoveListener?: () => void;;
  lensTouchMoveListener?: () => void;;
  _imgStyle?: string;
  zoomMode: NgxImgZoomMode;
  _resultStyle?: string;
  zoomImage?: string;
  previewImage?: string;


  constructor(
    private renderer: Renderer2,
    private ngxZoomService: NgxImgZoomService
    ) {
      this.zoomBreakPoints = this.ngxZoomService.zoomBreakPoints;
      this.zoomMode = this.ngxZoomService.zoomMode;
    }

    @ViewChild('img', { static: false }) imgElmRef?: ElementRef;
    @ViewChild('result', { static: false }) resultElmRef?: ElementRef;
    @ViewChild('container', { static: false }) containerElmRef?: ElementRef;


    @Input() enableZoom = false;
    @Input() set imgStyle(val) {
      this._imgStyle = val;
    }
    get imgStyle() {
      return this._imgStyle;
    }

    @Input() set resultStyle(val) {
      this._resultStyle = val;
    }
    get resultStyle() {
      return this._resultStyle;
    }

    @Input() set lensStyle(val) {
      this._lensStyle = val;
      if (this.notFirstTime) {
        this.imageZoom();
      }
    }
    get lensStyle() {
      return this._lensStyle;
    }
    @Input() containerStyle?: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @HostListener('window:scroll', ['$event']) onscroll(event: Event) {
    this.hideResultDiv = true;
    this.renderer.setStyle(this.lens, 'visibility', 'hidden');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @HostListener('window:click', ['$event.target']) onclick(event: Event) {
    this.hideResultDiv = true;
    this.renderer.setStyle(this.lens, 'visibility', 'hidden');
  }

  @Input() set zoomImageSrc(val: string) {
    this.zoomImage = val;
    if (this.notFirstTime === true) {
      this.renderer.setStyle(this.result, 'backgroundImage', "url('" + val + "')");
    }
    this.notFirstTime = true;
    // this.renderer.setStyle(this.result, 'backgroundImage', val);
  }

  @Input() set previewImageSrc(val: string) {
    this.previewImage = val;
    this.showResult = false;
    const image = new Image();
    image.src = this.zoomImage!;
    image.onload = () => {
      this.showResult = true;
    };
  }

  handleZoomOutOnMouseWheelUp() {
    if (this.enableZoom && this.zoomBreakPoints) {
      if (this.zoomBreakPoints.length - 1 > this.zoomIndex) {
        this.zoomIndex++;
      }
      this.lensStyle = `height: ${this.zoomBreakPoints[this.zoomIndex].h}px; width: ${this.zoomBreakPoints[this.zoomIndex].w}px;`;
      this.imageZoom();
      this.moveLens(this.lastEventBeforeTheWheel); // Called to keep the position of the lens unchanged.
    }
  }

  handleZoomInOnMouseWheelUp() {
    if (this.enableZoom && this.zoomBreakPoints) {
      if (this.zoomIndex > 0) {
        this.zoomIndex--;
      }
      this.lensStyle = `height: ${this.zoomBreakPoints[this.zoomIndex].h}px;
                        width: ${this.zoomBreakPoints[this.zoomIndex].w}px;`;
      this.imageZoom();
      this.moveLens(this.lastEventBeforeTheWheel); // Called to keep the position of the lens unchanged.
    }
  }

  ngAfterViewInit() {
    this.img = this.imgElmRef?.nativeElement;
    this.result = this.resultElmRef?.nativeElement;
    this.container = this.containerElmRef?.nativeElement;

    this.renderer.setAttribute(this.img, 'style', (this.imgStyle as string));
    this.renderer.setAttribute(this.result, 'style', (this.resultStyle as string));
    this.renderer.setAttribute(this.container, 'style', (this.containerStyle as string));
    this.imageZoom();
    
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    this.lensMouseMoveListener = this.renderer.listen(this.lens, 'mousemove', this.moveLens.bind(this));
    this.imgMouseMoveListener = this.renderer.listen(this.img, 'mousemove', this.moveLens.bind(this));

    /*and also for touch screens:*/
    this.imgTouchMoveListener = this.renderer.listen(this.img, 'touchmove', this.moveLens.bind(this));
    this.lensTouchMoveListener = this.renderer.listen(this.lens, 'touchmove', this.moveLens.bind(this));

    this.renderer.setStyle(this.lens, 'visibility', 'hidden');	

    if (this.enableZoom && !this.zoomBreakPoints) {
      console.warn(
        "The enableZoom options only works if zoomBreakPoints are passed using NgxImgZoomService. Kindly refer the Docs."
      );
    }
  }

  ngOnDestroy(){
    if (this.lensMouseMoveListener) this.lensMouseMoveListener();
    if (this.imgMouseMoveListener) this.imgMouseMoveListener();
    if (this.imgTouchMoveListener) this.imgTouchMoveListener();
    if (this.lensTouchMoveListener) this.lensTouchMoveListener();
  }

  imageZoom() {
    /*create lens:*/
    if (!this.lens) {
      this.lens = this.renderer.createElement('DIV');
      this.renderer.addClass(this.lens, 'img-zoom-lens');
      // this.renderer.addClass(this.lens, 'cursor-crosshair');
      this.renderer.insertBefore(this.img.parentElement, this.lens, this.img);
    }

    /*insert lens:*/
    this.renderer.setAttribute(this.lens, 'style', (this.lensStyle as string));

    /*calculate the ratio between result DIV and lens:*/
      this.cx = this.result.offsetWidth / this.lens.offsetWidth;
      this.cy = this.result.offsetHeight / this.lens.offsetHeight;

    /*set background properties for the result DIV:*/
    this.renderer.setStyle(this.result, 'backgroundImage', "url('" + this.zoomImage + "')");
    this.renderer.setStyle(this.result, 'backgroundSize', (this.img.width * this.cx) + 'px ' + (this.img.height * this.cy) + 'px');
    // this.renderer.setStyle(this.img.parentElement, 'position', 'relative')

    
  }

  moveLens(e: Event) {
    this.lastEventBeforeTheWheel = e;
      let x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      const pos = this.getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (this.lens.offsetWidth / 2);
      y = pos.y - (this.lens.offsetHeight / 2);


      /*prevent the lens from being positioned outside the image:*/
      if (x > this.img.width - this.lens.offsetWidth) {
        x = this.img.width - this.lens.offsetWidth;
      } else if (x < 0) {
        x = 0;
      } 
       if (y > this.img.height - this.lens.offsetHeight) {
        y = this.img.height - this.lens.offsetHeight;
      } else if (y < 0 ) {
        y = 0;
      } 
      this.hideResultDiv = false;
      if (this.showResult) {
        this.renderer.setStyle(this.lens, 'left', x + 'px');
        this.renderer.setStyle(this.lens, 'top', y + 'px');
        /*display what the lens 'sees':*/
        this.renderer.setStyle(this.result, 'backgroundPosition', '-' + (x * this.cx) + 'px -' + (y * this.cy) + 'px');
        this.renderer.setStyle(this.lens, 'visibility', 'visible');
      }
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCursorPos(e: any) {
      const a = this.img.getBoundingClientRect();
      let x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
  }

  handleMouseLeave() {
    this.hideResultDiv = true;
    this.renderer.setStyle(this.lens, 'visibility', 'hidden');
  }

}
