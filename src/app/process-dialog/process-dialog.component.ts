import {Component, Inject, InjectionToken, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-process-dialog',
  templateUrl: './process-dialog.component.html',
  styleUrls: ['./process-dialog.component.css']
})
export class ProcessDialogComponent {

  message: string = ""
  cancelButtonText = "Close"
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProcessDialogComponent>) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
    this.dialogRef.updateSize('400vw','400vw')
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
