import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { INativeService } from '../../@core/services/native/native.interface';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss'],
})
export class ReportBugComponent implements OnInit {
  constructor(private nativeService: INativeService, public dialogRef: MatDialogRef<ReportBugComponent>) {}

  ngOnInit(): void {}

  openMail(): void {
    this.nativeService.openUrl('mailto:cabr2.help@gmail.com');
  }
}
