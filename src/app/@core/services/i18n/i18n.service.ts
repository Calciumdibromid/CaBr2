import { Injectable } from '@angular/core';
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
  constructor(
    private tauriService: TauriService,
  ) { }

  static getDefaultStrings(): LocalizedStrings {
    return DEFAULT_STRINGS;
  }

  getAvailableLanguages(): Observable<LocalizedStringsHeader[]> {
    return this.tauriService.promisified({
      cmd: 'getAvailableLanguages',
    });
  }

  getLocalizedStrings(language: string): Observable<LocalizedStrings> {
    return new Observable((sub) => {
      this.tauriService.promisified<LocalizedStrings>({
        cmd: 'getLocalizedStrings',
        language,
      }).subscribe(
        (strings) => {
          logger.trace('loading localized strings successful:', strings);
          sub.next(strings);
        },
        (err) => {
          logger.error('loading localized strings failed:', err);
          sub.next(I18nService.getDefaultStrings());
        }
      );
    });
  }
}

export interface LocalizedStringsHeader {
  name: string;
  locale: string;
}
