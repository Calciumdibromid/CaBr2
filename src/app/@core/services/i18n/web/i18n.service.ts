import { II18nService, LocalizedStrings, LocalizedStringsHeader } from '../i18n.service.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModule } from '../../service.module';

const logger = new Logger('i18n-service-web');

@Injectable({
  providedIn: ServiceModule,
})
export class I18nWebService implements II18nService {
  getAvailableLanguages(): Observable<LocalizedStringsHeader[]> {
    throw new Error('Method not implemented.');
  }
  getLocalizedStrings(language: string): Observable<LocalizedStrings> {
    throw new Error('Method not implemented.');
  }
}
