import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';

import { CONFIG_SERVICE } from './config/config.interface';
import { I18N_SERVICE } from './i18n/i18n.interface';
import { LOAD_SAVE_SERVICE } from './loadSave/loadSave.interface';
import { NATIVE_SERVICE } from './native/native.interface';
import { PROVIDER_SERVICE } from './provider/provider.interface';

@NgModule({
  providers: [
    {
      provide: CONFIG_SERVICE,
      useClass: environment.serviceProvider.configService,
    },
    {
      provide: I18N_SERVICE,
      useClass: environment.serviceProvider.i18nService,
    },
    {
      provide: LOAD_SAVE_SERVICE,
      useClass: environment.serviceProvider.loadSaveService,
    },
    {
      provide: NATIVE_SERVICE,
      useClass: environment.serviceProvider.nativeService,
    },
    {
      provide: PROVIDER_SERVICE,
      useClass: environment.serviceProvider.providerService,
    },
  ]
})
export class ServiceModule {}
