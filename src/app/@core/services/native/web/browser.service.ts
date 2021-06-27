import { INativeService } from '../native.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO use vars and remove this lines

@Injectable()
export class BrowserService implements INativeService {
  openUrl(url: string, openWith?: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  open(options?: any): Observable<string | string[]> {
    throw new Error('Method not implemented.');
  }
  save(options?: any): Observable<string | string[]> {
    throw new Error('Method not implemented.');
  }

  promisified<T>(cmd: string, args?: any): Observable<T> {
    throw new Error('Method not implemented.');
  }
}
