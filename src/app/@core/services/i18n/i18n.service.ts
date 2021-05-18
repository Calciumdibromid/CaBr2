import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { Observable } from 'rxjs';

import {
  getDefaultStrings,
  II18nService,
  LocalizedStrings,
  LocalizedStringsHeader,
} from './i18n.service.interface';
import Logger from '../../utils/logger';
import { ServiceModule } from '../service.module';
import { TauriService } from '../tauri/tauri.service';

const logger = new Logger('i18n-service');

@Injectable({
  providedIn: ServiceModule,
})
export class I18nService implements II18nService {
  constructor(private tauriService: TauriService) {}

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
