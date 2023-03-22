import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';

import * as wasm from 'cabr2_wasm';

import { INativeService } from '../native.interface';
import Logger from 'src/app/@core/utils/logger';

wasm.init_cabr2();

@Injectable()
export class BrowserService implements INativeService {
  private logger = new Logger(BrowserService.name);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  openUrl(url: string): Promise<void> {
    this.document.open(url, '_blank', 'noopener,noreferrer');
    return Promise.resolve();
  }

  open(): Observable<File> {
    const inputField = document.createElement('input');
    inputField.type = 'file';
    inputField.style.display = 'none';
    document.body.append(inputField);

    return new Observable((sub) => {
      inputField.addEventListener(
        'change',
        (event: any) => {
          sub.next(event.target.files[0]);
        },
        { once: true },
      );
      inputField.click();
    });
  }

  save(options?: any): Observable<string> {
    // defaultPath should be set in the document service, so we don't need a check
    return of(options.defaultPath);
  }

  /** This function should never be used! */
  promisified<T>(cmd: string): Observable<T> {
    this.logger.error('called inaccessible tauri service: [', cmd, ']');
    throw new Error('Method not available.');
  }
}
