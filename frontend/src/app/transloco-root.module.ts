import { Injectable, NgModule } from '@angular/core';
import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
} from '@ngneat/transloco';

import { environment } from '../environments/environment';
import { II18nService } from './@core/services/i18n/i18n.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private i18nService: II18nService) {}

  getTranslation(lang: string): Observable<Translation> {
    return this.i18nService.getTranslation(lang);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: [
          { id: 'en_us', label: 'English' },
          { id: 'de_de', label: 'Deutsch' },
          { id: 'de_by', label: 'Bayrisch' },
          { id: 'ru_ru', label: 'Русский' },
          { id: 'hr_hr', label: 'Hrvatski' },
        ],
        defaultLang: 'en_us',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
        fallbackLang: ['en_us'],
        missingHandler: {
          // It will use the first language set in the `fallbackLang` property
          useFallbackTranslation: true,
          allowEmpty: true,
          logMissingKey: false,
        },
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule {}
