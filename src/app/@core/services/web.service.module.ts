import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserService } from './native/web/browser.service';
import { ConfigWebService } from './config/web/config.service';
import DocumentService from './document/document.service';
import { I18nWebService } from './i18n/web/i18n.service';
import { IConfigService } from './config/config.interface';
import { II18nService } from './i18n/i18n.interface';
import { ILoadSaveService } from './loadSave/loadSave.interface';
import { INativeService } from './native/native.interface';
import { IProviderService } from './provider/provider.interface';
import { LoadSaveService } from './loadSave/web/loadSave.service';
import Logger from '../utils/logger';
import { MatDialog } from '@angular/material/dialog';
import { ProviderService } from './provider/web/provider.service';

const logger = new Logger('service.module');

logger.trace('loading services for web environment');

@NgModule({
  providers: [
    {
      provide: IConfigService,
      useClass: ConfigWebService,
    },
    {
      provide: II18nService,
      useClass: I18nWebService,
      deps: [HttpClient],
    },
    {
      provide: ILoadSaveService,
      useClass: LoadSaveService,
      deps: [HttpClient, MatDialog],
    },
    {
      provide: INativeService,
      useClass: BrowserService,
    },
    {
      provide: IProviderService,
      useClass: ProviderService,
    },
    DocumentService,
  ],
})
export class ServiceModule {}
