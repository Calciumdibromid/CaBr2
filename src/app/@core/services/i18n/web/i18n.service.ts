import { II18nService, LocalizedStrings, LocalizedStringsHeader } from '../i18n.interface';
import { Injectable } from '@angular/core';
import Logger from 'src/app/@core/utils/logger';
import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO use vars and remove this lines

const logger = new Logger('i18n-service-web');

@Injectable()
export class I18nWebService implements II18nService {
  getAvailableLanguages(): Observable<LocalizedStringsHeader[]> {
    throw new Error('Method not implemented.');
  }
  getLocalizedStrings(language: string): Observable<LocalizedStrings> {
    throw new Error('Method not implemented.');
  }
}
