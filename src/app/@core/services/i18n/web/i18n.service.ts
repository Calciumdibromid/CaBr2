import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Translation } from '@ngneat/transloco';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { II18nService } from '../i18n.interface';
import Logger from 'src/app/@core/utils/logger';

const logger = new Logger('i18n-service-web');

@Injectable()
export class I18nWebService implements II18nService {
  constructor(private http: HttpClient) {}

  getTranslation(language: string): Observable<Translation> {
    return this.http.get<Translation>(`translations/${language}.json`).pipe(
      map((translation) => translation.strings),
      tap(() => {
        logger.trace('loading translation successful:', language);
      }),
    );
  }
}
