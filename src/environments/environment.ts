// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ConfigService } from 'src/app/@core/services/config/config.service';
import { I18nService } from 'src/app/@core/services/i18n/i18n.service';
import { LoadSaveService } from 'src/app/@core/services/loadSave/loadSave.service';
import { ProviderService } from 'src/app/@core/services/provider/provider.service';
import { TauriService } from 'src/app/@core/services/native/tauri.service';

export const environment = {
  production: false,
  web: false,
  serviceProvider: {
    i18nService: I18nService,
    configService: ConfigService,
    loadSaveService: LoadSaveService,
    nativeService: TauriService,
    providerService: ProviderService,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
