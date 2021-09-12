import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GlobalModel } from '../../@core/models/global.model';
import { LocalizedStrings } from '../../@core/services/i18n/i18n.interface';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent implements OnInit {
  strings!: LocalizedStrings;
  timer = this.data.duration;

  constructor(
    public dialogRef: MatDialogRef<ConsentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { duration: number },
    private globals: GlobalModel,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.timer > 0) {
        this.timer -= 1;
      }
    }, 1000);
  }
}
