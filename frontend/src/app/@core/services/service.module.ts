import { DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ConfigService } from './config/config.service';
import DocumentService from './document/document.service';
import { GlobalModel } from '../models/global.model';
import { I18nService } from './i18n/i18n.service';
import { IConfigService } from './config/config.interface';
import { II18nService } from './i18n/i18n.interface';
import { ILoadSaveService } from './loadSave/loadSave.interface';
import { INativeService } from './native/native.interface';
import { IProviderService } from './provider/provider.interface';
import { LoadSaveService } from './loadSave/loadSave.service';
import Logger from '../utils/logger';
import { ProviderService } from './provider/provider.service';
import { TauriService } from './native/tauri.service';

const logger = new Logger('service.module');

logger.trace('loading services for tauri environment');

@NgModule({
  providers: [
    {
      provide: IConfigService,
      useClass: ConfigService,
      deps: [INativeService, DomSanitizer],
    },
    {
      provide: II18nService,
      useClass: I18nService,
      deps: [INativeService],
    },
    {
      provide: ILoadSaveService,
      useClass: LoadSaveService,
      deps: [INativeService],
    },
    {
      provide: INativeService,
      useClass: TauriService,
    },
    {
      provide: IProviderService,
      useClass: ProviderService,
      deps: [INativeService, GlobalModel],
    },
    DocumentService,
  ],
})
export class ServiceModule {}
