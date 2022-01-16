import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import Logger from './app/@core/utils/logger';

const logger = new Logger('bootstrap');

logger.debug('environment.production:', environment.production);
logger.debug('environment.web:', environment.web);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => logger.error(err));
