import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss'],
})
export class YesNoDialogComponent implements OnInit {
  /**
   * To use this component you must inject `MatDialog`.
   * The value `iconName` is optional.
   * Get icon names from [here](https://material.io/resources/icons/?icon=info&style=baseline)
   * ```ts
   * matDialog.open(ManualComponent, {
   *  data: {
   *    iconName: 'exampleIcon',
   *    title: 'Example title',
   *    content: 'Example content'
   *  }
   * });
   * ```
   *
   * @param dialogRef
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { iconName: string; title: string; content: string },
  ) {}

  ngOnInit(): void {}
}
