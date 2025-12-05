import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction]
})
export class ToastComponent { 
  snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA)
  message: string;
  constructor() {
    this.message = this.data.message;
  }

  close() {
    this.snackBarRef.dismissWithAction()
  }
}
