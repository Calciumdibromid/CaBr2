import { Inject, Injectable } from '@angular/core';
import { merge } from 'lodash';
import { Observable } from 'rxjs';

import {
  getDefaultStrings,
  II18nService,
  LocalizedStrings,
  LocalizedStringsHeader,
} from './i18n.interface';
import Logger from '../../utils/logger';
import { NATIVE_SERVICE } from '../native/native.interface';
import { ServiceModule } from '../service.module';
import { TauriService } from '../native/tauri.service';

const logger = new Logger('i18n-service');

@Injectable({
  providedIn: ServiceModule,
})
export class I18nService implements II18nService {
  constructor(@Inject(NATIVE_SERVICE) private tauriService: TauriService) {}

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
