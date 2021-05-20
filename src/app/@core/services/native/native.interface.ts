import { Observable } from 'rxjs';

export const NATIVE_SERVICE = 'INativeService';

export interface INativeService {
  openUrl(url: string, openWith?: string): Promise<void>;

  open(options?: any): Observable<string | string[]>;

  save(options?: any): Observable<string | string[]>;
}
