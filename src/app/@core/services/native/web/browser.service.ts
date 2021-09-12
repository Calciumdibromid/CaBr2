import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import Logger from 'src/app/@core/utils/logger';
import * as wasm from 'cabr2_wasm';

import { INativeService } from '../native.interface';

const logger = new Logger('service.browser');

wasm.init();

const logCall = (name: string) => logger.error('called inaccessible tauri service: [', name, ']');

@Injectable()
export class BrowserService implements INativeService {
  openUrl(url: string, _?: string): Promise<void> {
    window.open(url, '_blank');
    return Promise.resolve();
  }

  open(_?: any): Observable<File> {
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
    return of(options.filter ?? 'cb2');
  }

  // this function should never be used
  promisified<T>(cmd: string, args?: any): Observable<T> {
    throw new Error('Method not implemented.');
  }
}
