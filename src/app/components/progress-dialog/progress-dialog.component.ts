import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscriber } from 'rxjs';

import { INativeService } from '../../@core/services/native/native.interface';

interface SaveDocumentResponse {
  downloadUrl: string;
}

export interface ProgressDialogData {
  download: Observable<SaveDocumentResponse>;
  subscriber: Subscriber<string>;
}

@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss'],
})
export class ProgressDialogComponent implements OnInit {
  pdfUrl?: string;

  finished = false;

  closeEnabled = false;

  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProgressDialogData,

    private nativeService: INativeService,
  ) {
    data.download.subscribe(
      (res) => {
        this.setPdfUrl(res.downloadUrl);
        this.closeEnabled = true;
        data.subscriber.next();
      },
      (err) => data.subscriber.error(err),
    );
  }

  ngOnInit(): void {
    this.finished = false;
    this.closeEnabled = false;
    setTimeout(() => (this.closeEnabled = true), 5000);
  }

  downloadPdf() {
    // if this function can be called the url has been set
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.nativeService.openUrl(this.pdfUrl!);
  }

  setPdfUrl(url: string) {
    this.pdfUrl = url;
    this.finished = true;
  }
}
