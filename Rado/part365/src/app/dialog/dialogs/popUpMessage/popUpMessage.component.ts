import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { PopUpDialogData } from '../../model/popUpDialogData'

@Component({
    selector: 'app-popupmessage',
    templateUrl: './popUpMessage.component.html',
    styleUrls: ['./popUpMessage.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class PopUpMessageComponent implements OnInit {
    data: PopUpDialogData = inject(MAT_DIALOG_DATA)
    dialogRef = inject(MatDialog)
    title?: string
    content?: string

    ngOnInit() {
        this.title = this.data.title
        this.content = this.data.content
    }
}
