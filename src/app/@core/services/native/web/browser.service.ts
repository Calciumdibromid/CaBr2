import { INativeService } from '../native.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModule } from '../../service.module';


@Injectable({
  providedIn: ServiceModule
})
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

}
