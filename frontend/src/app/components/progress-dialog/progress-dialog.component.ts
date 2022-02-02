import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscriber, Subscription } from 'rxjs';

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
export class ProgressDialogComponent implements OnInit, OnDestroy {
  pdfUrl?: string;

  finished = false;

  error = false;

  closeEnabled = false;

  subscription!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProgressDialogData,

    private nativeService: INativeService,
  ) {}

  ngOnInit(): void {
    this.finished = false;
    this.closeEnabled = false;
    this.error = false;

    // enable close button and show error message after 10 seconds
    setTimeout(() => {
      this.closeEnabled = true;
      // set only if pdfUrl wasn't set
      this.error = !this.pdfUrl;
    }, 10000);

    this.subscription = this.data.download.subscribe({
      next: (res) => {
        this.setPdfUrl(res.downloadUrl);
        this.closeEnabled = true;
        this.data.subscriber.next();
      },
      error: (err) => {
        this.data.subscriber.error(err);
        this.dialogRef.close();
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  downloadPdf(): void {
    // if this function can be called the url has been set
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.nativeService.openUrl(this.pdfUrl!);
  }

  setPdfUrl(url: string): void {
    this.pdfUrl = url;
    this.finished = true;
    this.error = false;
  }
}
