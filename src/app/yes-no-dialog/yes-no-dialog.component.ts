import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { strings } from '../../assets/strings.json';

export interface YesNoDialogData {
  iconName?: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss'],
})
export class YesNoDialogComponent implements OnInit {
  strings = strings;

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
   *  },
   *  autofocus: false  // default is true
   * });
   * ```
   *
   * @param dialogRef
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: YesNoDialogData,
  ) {}

  ngOnInit(): void {}
}
