import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { INativeService } from '../../@core/services/native/native.interface';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss'],
})
export class ReportBugComponent {
  constructor(
    private readonly nativeService: INativeService,
    public readonly dialogRef: MatDialogRef<ReportBugComponent>,
  ) {}

  openMail(): void {
    this.nativeService.openUrl('mailto:cabr2.help@gmail.com');
  }
}
