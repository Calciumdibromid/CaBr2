import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Translation } from '@ngneat/transloco';

import { II18nService } from '../i18n.interface';
import { Injectable } from '@angular/core';
import Logger from 'src/app/@core/utils/logger';
import { Observable } from 'rxjs';

const logger = new Logger('i18n-service-web');

@Injectable()
export class I18nWebService implements II18nService {
  constructor(private http: HttpClient) {}

  getTranslation(language: string): Observable<Translation> {
    return this.http.get<Translation>(`../translations/${language}.json`).pipe(
      tap(() => {
        logger.trace('loading translation successful:', language);
      }),
    );
  }
}
