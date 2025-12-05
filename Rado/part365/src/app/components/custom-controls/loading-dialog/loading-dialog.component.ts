import { Component, Inject} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { LoadinData } from '@model/loadinData';

@Component({
  standalone: true,
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  imports: [MatProgressSpinnerModule, MatDialogModule, MatButtonModule],
  styleUrls: ['./loading-dialog.component.css']
})
export class LoadingDialogComponent {
  message = "Зареждане на данните";
  title = "Зареждане"

  constructor( @Inject(MAT_DIALOG_DATA) public data: LoadinData) {
    this.title = data.title;
    this.message = data.message
  }
}
