import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IConfigService } from 'src/app/@core/services/config/config.interface';
import { ReportBugComponent } from '../report-bug/report-bug.component';

@Component({
  selector: 'app-bug-report-button',
  templateUrl: './bug-report-button.component.html',
  styleUrls: ['./bug-report-button.component.scss'],
})
export class BugReportButtonComponent {
  PROGRAM_VERSION!: string;

  constructor(private dialog: MatDialog, private config: IConfigService) {
    config.getProgramVersion().subscribe((version) => {
      this.PROGRAM_VERSION = version;
    });
  }

  openMail(): void {
    this.dialog.open(ReportBugComponent);
  }
}
