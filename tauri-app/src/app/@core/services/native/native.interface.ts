import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class INativeService {
  abstract openUrl(url: string, openWith?: string): Promise<void>;

  abstract open(options?: any): Observable<string | File>;

  abstract save(options?: any): Observable<string>;

  abstract promisified<T>(cmd: string, args?: any): Observable<T>;
}
