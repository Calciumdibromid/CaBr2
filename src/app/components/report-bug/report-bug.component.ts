import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { GlobalModel } from '../../@core/models/global.model';
import { INativeService } from '../../@core/services/native/native.interface';
import { LocalizedStrings } from '../../@core/services/i18n/i18n.interface';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss'],
})
export class ReportBugComponent implements OnInit {
  strings!: LocalizedStrings;

  constructor(
    private nativeService: INativeService,
    private globals: GlobalModel,
    public dialogRef: MatDialogRef<ReportBugComponent>,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {}

  openMail(): void {
    this.nativeService.openUrl('mailto:cabr2.help@gmail.com');
  }
}
