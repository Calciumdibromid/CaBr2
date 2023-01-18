import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface YesNoDialogData {
  iconName?: string;
  title: string;
  content: string[];
  listItems?: string[];
  footerText?: string[];
  disableCancel?: boolean;
}

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss'],
})
export class YesNoDialogComponent {
  /**
   * To use this component you must inject `MatDialog`.
   *
   * The values `iconName`, `listItems` and `footerText` are optional.
   *
   * Get icon names from [here](https://material.io/resources/icons/?icon=info&style=baseline)
   * ```ts
   * matDialog.open(YesNoDialogComponent, {
   *  data: {
   *    iconName: 'exampleIcon',
   *    title: 'Example title',
   *    content: 'Example content'
   *    listItems: string[],
   *    footerText: 'Footer text',
   *    disableCancel: true
   *  },
   *  autofocus: false  // default is true
   * });
   * ```
   */
  constructor(
    public readonly dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: YesNoDialogData,
  ) {}
}
