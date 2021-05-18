import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';

@NgModule({
  providers: [
    {
      provide: 'IConfigService',
      useClass: environment.serviceProvider.configService,
    },
    {
      provide: 'II18nService',
      useClass: environment.serviceProvider.i18nService,
    },
    {
      provide: 'ILoadSaveService',
      useClass: environment.serviceProvider.loadSaveService,
    },
    {
      provide: 'IProviderService',
      useClass: environment.serviceProvider.providerService,
    },
  ]
})
export class ServiceModule {}
