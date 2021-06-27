import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { Observable } from 'rxjs';

import { getDefaultStrings, II18nService, LocalizedStrings, LocalizedStringsHeader } from './i18n.interface';
import { INativeService } from '../native/native.interface';
import Logger from '../../utils/logger';

const logger = new Logger('i18n-service');

@Injectable()
export class I18nService implements II18nService {
  constructor(private nativeService: INativeService) {}

  getAvailableLanguages(): Observable<LocalizedStringsHeader[]> {
    return this.nativeService.promisified('plugin:cabr2_config|get_available_languages');
  }

  getLocalizedStrings(language: string): Observable<LocalizedStrings> {
    return new Observable((sub) => {
      this.nativeService
        .promisified<LocalizedStrings>('plugin:cabr2_config|get_localized_strings', { language })
        .subscribe(
          (strings) => {
            logger.trace('loading localized strings successful:', strings);
            const mergedStrings = { ...getDefaultStrings() };
            merge(mergedStrings, strings);
            sub.next(mergedStrings);
          },
          (err) => {
            logger.error('loading localized strings failed:', err);
          },
        );
    });
  }
}
