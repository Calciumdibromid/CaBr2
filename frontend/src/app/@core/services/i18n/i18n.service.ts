import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translation } from '@ngneat/transloco';

import { II18nService } from './i18n.interface';
import { INativeService } from '../native/native.interface';
import Logger from '../../utils/logger';
import { tap } from 'rxjs/operators';

const logger = new Logger('i18n-service');

@Injectable()
export class I18nService implements II18nService {
  constructor(private nativeService: INativeService) {}

  getTranslation(language: string): Observable<Translation> {
    return this.nativeService.promisified<Translation>('plugin:cabr2_config|get_localized_strings', { language }).pipe(
      tap(() => {
        logger.trace('loading translation successful:', language);
      }),
    );
  }
}
