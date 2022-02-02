import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManualComponent {
  constructor(
    public dialogRef: MatDialogRef<ManualComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: string },
  ) {}
}
