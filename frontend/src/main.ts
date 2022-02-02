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

// TODO(#1126) remove after some time
const config = localStorage.getItem('config');
if (config?.startsWith('{"config":{')) {
  logger.warning('migrating local storage config');
  const newConfig = config.slice(10, config.length - 1);
  localStorage.setItem('config', newConfig);
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => logger.error(err));
