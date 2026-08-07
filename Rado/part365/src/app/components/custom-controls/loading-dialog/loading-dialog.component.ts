import { Component, inject } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { LoadinData } from '@model/loadinData'

@Component({
    selector: 'app-loading-dialog',
    templateUrl: './loading-dialog.component.html',
    imports: [MatProgressSpinnerModule, MatDialogModule, MatButtonModule],
    styleUrls: ['./loading-dialog.component.css'],
})
export class LoadingDialogComponent {
    message = 'Зареждане на обявите'
    title = 'Зареждане'
    data: LoadinData

    constructor() {
        this.data = inject(MAT_DIALOG_DATA)
        this.title = this.data.title
        this.message = this.data.message
    }
}
