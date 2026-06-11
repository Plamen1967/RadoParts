import { DestroyRef, inject, Injectable } from '@angular/core';
import { LoadingDialogComponent } from './loading-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class LoadingDialogService {
  private opened = false;
  private dialogRef!: MatDialogRef<LoadingDialogComponent>;

  private dialog: MatDialog;
  private destroyRef: DestroyRef;

  constructor() {
      this.dialog = inject(MatDialog);
      this.destroyRef = inject(DestroyRef);
  }

  openDialog(): void {
    if (!this.opened) {
      this.opened = true;
      this.dialogRef = this.dialog.open(LoadingDialogComponent, {
        data: undefined,
        maxHeight: '100%',
        width: '300px',
        maxWidth: '100%',
        disableClose: true,
        hasBackdrop: true,
      });

      this.dialogRef.afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.opened = false;
      });
    }
  }

  hideDialog() {
    this.dialogRef.close();
  }
}
