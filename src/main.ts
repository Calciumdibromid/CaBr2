import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import Logger from './app/@core/utils/logger';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

const logger = new Logger('bootstrap');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => logger.error(err));
