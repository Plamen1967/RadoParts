//#region imports
import { Component, inject, Inject, ChangeDetectionStrategy } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NgxImageZoomModule } from 'ngx-image-zoom'
//#endregion
//#region component
@Component({
    selector: 'app-zoom',
    templateUrl: './zoom.component.html',
    styleUrls: ['./zoom.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgxImageZoomModule],
})
//#endregion
export class ZoomComponent {
    //#region variables and services
    myThumbnail = ''
    myFullresImage = ''
    @Inject(MAT_DIALOG_DATA) public data: {
        myThumbnail: string
        myFullresImage: string
    } = inject(MAT_DIALOG_DATA)
    public dialogRef: MatDialogRef<ZoomComponent> = inject(MatDialogRef<ZoomComponent>)
    //#endregion
    constructor() {
        this.myThumbnail = this.data.myThumbnail
        this.myFullresImage = this.data.myFullresImage ?? this.myThumbnail
    }

    closeDialog() {
        this.dialogRef.close()
    }
}
