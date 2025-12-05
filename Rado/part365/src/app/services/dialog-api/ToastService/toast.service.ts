import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ToastComponent } from './Toast/toast.component'

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private _snackBar = inject(MatSnackBar)

    showToast(message: string, duration = 50) {
        const snackBarRef = this._snackBar.openFromComponent(ToastComponent, {
            duration: duration * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',

            data: {
                message: message,
                panelClass: 'toast-style',
            },
        })

        return snackBarRef
    }

    show(message: string, duration = 5) {
        const snackBarRef = this._snackBar.open(message, 'Ok', {
            duration: duration * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'toast-style',
            data: {
                message: message,
            },
        })
        return snackBarRef
    }
}
