import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [NgStyle, MatDialogActions, MatDialogContent, MatButton, MatDialogClose],
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit{
  data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmationComponent>);

  showButtonOk = true;
  showButtonCancel = true;
  header = "Message";
  content = "Content"
  ngOnInit(): void {
    this.showButtonOk = this.data.showButtonOk??true;
    this.showButtonCancel = this.data.showButtonCancel??false;
    this.header = this.data.header;
    this.content = this.data.content;
  }

  }
