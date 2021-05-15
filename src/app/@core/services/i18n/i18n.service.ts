import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { Observable } from 'rxjs';

import { strings as DEFAULT_STRINGS } from '../../../../assets/defaultStrings.json';
import Logger from '../../utils/logger';
import { TauriService } from '../tauri/tauri.service';

const logger = new Logger('i18n-service');

export type LocalizedStrings = typeof DEFAULT_STRINGS;

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  constructor(private tauriService: TauriService) {}

  static getDefaultStrings(): LocalizedStrings {
    return DEFAULT_STRINGS;
  }

  getAvailableLanguages(): Observable<LocalizedStringsHeader[]> {
    return this.tauriService.promisified('plugin:cabr2_config|get_available_languages');
  }

  getLocalizedStrings(language: string): Observable<LocalizedStrings> {
    return new Observable((sub) => {
      this.tauriService
        .promisified<LocalizedStrings>('plugin:cabr2_config|get_localized_strings', { language })
        .subscribe(
          (strings) => {
            logger.trace('loading localized strings successful:', strings);
            const mergedStrings = { ...I18nService.getDefaultStrings() };
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

export interface LocalizedStringsHeader {
  name: string;
  locale: string;
}
