import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@Component({
  standalone: true,
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.css'],
  imports: [NgxImageZoomModule]
})
export class ZoomComponent {

  myThumbnail = "";
  myFullresImage= "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    myThumbnail: string,
    myFullresImage: string,
  }, public dialogRef: MatDialogRef<ZoomComponent>) { 
    this.myThumbnail = data.myThumbnail;
    this.myFullresImage = data.myFullresImage ?? this.myThumbnail
  }
  
  closeDialog() {
    this.dialogRef.close();
  }
}
